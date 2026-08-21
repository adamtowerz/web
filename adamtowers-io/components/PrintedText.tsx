'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';

// tweakpane@4's published types re-export from '@tweakpane/core', a package it doesn't
// actually declare as a dependency — that module never resolves, so we type just the
// handful of methods this file calls rather than fight the upstream types.
interface TweakpaneBindingApi {
    on(event: string, callback: (ev: {last: boolean}) => void): void;
}
interface TweakpanePane {
    addBinding(target: object, key: string, options?: object): TweakpaneBindingApi;
    addButton(options: {title: string}): TweakpaneBindingApi;
    on(event: string, callback: () => void): void;
    refresh(): void;
    dispose(): void;
}

// Renders `children` through the experimental HTML-in-canvas API (WICG explainer:
// https://github.com/WICG/html-in-canvas), so the text can be run through a WebGPU shader
// that gives it slight printing imperfections, while staying real, selectable, accessible DOM.
// Ships behind chrome://flags/#canvas-place-element — everywhere else this just renders
// `children` directly with no canvas involved.
function supportsHtmlInCanvas() {
    return (
        typeof HTMLCanvasElement !== 'undefined' &&
        typeof GPUQueue !== 'undefined' &&
        'captureElementImage' in HTMLCanvasElement.prototype &&
        'copyElementImageToTexture' in GPUQueue.prototype &&
        !!navigator.gpu
    );
}

const shaderCode = /* wgsl */ `
  struct Params {
    resolution: vec2f,
    seed: f32,
    jitterPx: f32,
    bleedMix: f32,
    grainAmount: f32,
    densityAmount: f32,
    vignetteAmount: f32,
    revealT: f32,
    revealScale: f32,
    revealFeather: f32,
    dpr: f32,
  }

  @group(0) @binding(0) var<uniform> params: Params;
  @group(0) @binding(1) var textTexture: texture_2d<f32>;
  @group(0) @binding(2) var textSampler: sampler;

  struct VertexOut {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
  }

  @vertex
  fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
    let pos = array<vec2f, 6>(
      vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
      vec2f(1.0, -1.0), vec2f(1.0, 1.0), vec2f(-1.0, 1.0),
    );
    var out: VertexOut;
    out.position = vec4f(pos[i], 0.0, 1.0);
    out.uv = vec2f((pos[i].x + 1.0) * 0.5, (1.0 - pos[i].y) * 0.5);
    return out;
  }

  fn hash(p: vec2f) -> f32 {
    var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Value noise: smoothly interpolated hash, used for the intro reveal's blotchy shape.
  fn noise2d(p: vec2f) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let a = hash(i);
    let b = hash(i + vec2f(1.0, 0.0));
    let c = hash(i + vec2f(0.0, 1.0));
    let d = hash(i + vec2f(1.0, 1.0));
    let u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  fn fbm2d(p: vec2f) -> f32 {
    var value = 0.0;
    var amplitude = 0.5;
    var pos = p;
    for (var i = 0; i < 3; i++) {
      value += amplitude * noise2d(pos);
      pos = pos * 2.0 + vec2f(37.0, 17.0);
      amplitude *= 0.5;
    }
    return value / 0.875; // amplitudes (0.5 + 0.25 + 0.125) sum to 0.875 — renormalize to ~[0, 1]
  }

  @fragment
  fn fs(in: VertexOut) -> @location(0) vec4f {
    let resolution = params.resolution;
    let fragCoord = in.uv * resolution;
    // Everything below is tuned by eye in CSS-pixel terms — re-deriving it straight from
    // fragCoord (device pixels) would make grain, jitter, and blotch size all quietly
    // shrink on HiDPI screens as the backing store grows relative to the CSS box.
    let visualCoord = fragCoord / params.dpr;

    // The pristine capture, with none of the print imperfections below applied — what the
    // intro reveal blends in from, and what a fully-unrevealed pixel renders as.
    let cleanTexel = textureSample(textTexture, textSampler, in.uv);

    // Sub-pixel horizontal misregistration, varying per scanline band (imperfect print roller).
    let band = floor(visualCoord.y / 3.0);
    let jitterPx = (hash(vec2f(band, params.seed)) - 0.5) * params.jitterPx;
    let sampleUv = clamp(in.uv + vec2f(jitterPx * params.dpr / resolution.x, 0.0), vec2f(0.0), vec2f(1.0));

    let texel = textureSample(textTexture, textSampler, sampleUv);

    // Ink bleed: fatten glyph edges very slightly by taking the max alpha of nearby texels,
    // one CSS pixel out in each direction.
    let px = params.dpr / resolution;
    var bleed = texel.a;
    bleed = max(bleed, textureSample(textTexture, textSampler, sampleUv + vec2f(px.x, 0.0)).a);
    bleed = max(bleed, textureSample(textTexture, textSampler, sampleUv - vec2f(px.x, 0.0)).a);
    bleed = max(bleed, textureSample(textTexture, textSampler, sampleUv + vec2f(0.0, px.y)).a);
    bleed = max(bleed, textureSample(textTexture, textSampler, sampleUv - vec2f(0.0, px.y)).a);
    var alpha = mix(texel.a, bleed, params.bleedMix);

    // Paper grain: fine per-(CSS)-pixel noise so ink density isn't perfectly flat.
    let grain = 1.0 + (hash(visualCoord + params.seed) - 0.5) * params.grainAmount;
    alpha *= grain;

    // Uneven inking: slow, large-scale density variation across the block.
    let density = 1.0 + (hash(floor(visualCoord / 24.0) + params.seed) - 0.5) * params.densityAmount;
    alpha *= density;

    // Vignette: fades toward the bottom of the block, like a page trailing off, rather than
    // darkening in from every edge.
    let vignette = 1.0 - smoothstep(0.4, 1.0, in.uv.y) * params.vignetteAmount;
    alpha *= vignette;

    alpha = clamp(alpha, 0.0, 1.0);

    // Intro reveal: instead of fading every pixel's effect intensity in unison, threshold a
    // noise field against a sweeping value so imperfections bloom in at random points first,
    // then spread until they cover the whole block — like a print slowly developing.
    let revealNoise = fbm2d(visualCoord * params.revealScale + params.seed);
    let mask = smoothstep(revealNoise - params.revealFeather, revealNoise + params.revealFeather, params.revealT);

    let outPremult = mix(cleanTexel.rgb * cleanTexel.a, texel.rgb * alpha, mask);
    let outAlpha = mix(cleanTexel.a, alpha, mask);
    return vec4f(outPremult, outAlpha);
  }
`;

function PrintedCanvas({children, onReady}: {children: ReactNode; onReady: () => void}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        const content = contentRef.current;
        if (!canvas || !content || !navigator.gpu) return;

        let destroyed = false;
        let device: GPUDevice | undefined;
        let context: GPUCanvasContext | undefined;
        let texture: GPUTexture | undefined;
        let uniformBuffer: GPUBuffer | undefined;
        let pane: TweakpanePane | undefined;
        let firstPaintDone = false;
        let introRaf: number | undefined;

        // Tunable at runtime via the Tweakpane panel below (dev only). Defaults dialed in
        // by eye against the live panel. The effect intensities themselves stay fixed at
        // these values always — it's `revealT` below that animates, via the shader's own
        // noise mask, rather than fading these in directly.
        const params = {
            seed: Math.random() * 1000,
            jitterPx: 0.40,
            bleedMix: 0.16,
            grainAmount: 0.32,
            densityAmount: 0.32,
            vignetteAmount: 0.25,
            revealScale: 0.02,
            revealFeather: 0.18,
            // 0..1 progress through the intro; `autoIntro` advances it on a timer, or drag
            // the panel slider directly to walk the reveal by hand (that drag turns
            // `autoIntro` off so the running animation doesn't immediately overwrite it).
            revealProgress: 0,
            autoIntro: true,
        };

        // Cap at 2x — 3x devices don't need a proportionally larger texture/backing-store
        // for legible body text, and it keeps the GPU cost bounded.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Width comes from the canvas's PARENT, not the canvas or its content: under
        // `layoutsubtree`, the content's layout viewport is the canvas's `width` *attribute*,
        // and — empirically, in this build — the canvas's own `getBoundingClientRect()` also
        // reflects that same attribute rather than its ordinary CSS box. Either way, measuring
        // anything inside or on the canvas to decide that attribute is circular: before we
        // ever touch it, everything downstream of the 300 default reports back ~300, and we'd
        // write 300 right back, permanently. The parent is a plain, un-`layoutsubtree`'d <div>
        // sized by ordinary block layout, so it's the one measurement not tainted by any of this.
        //
        // The backing store (`canvas.width`/`height`, in device pixels) is now deliberately
        // larger than the CSS box (`canvas.style.width`/`height`, pinned explicitly in CSS
        // pixels below) for HiDPI crispness — the standard canvas retina technique. This is
        // exactly the kind of attribute/CSS-size split that previously made `layoutsubtree`
        // reflow the content into a narrower column (see git history), so if body text starts
        // wrapping oddly (extra line breaks, text that doesn't fill the visual width) after
        // this change, that's the regression to suspect first.
        const resizeCanvasToContent = () => {
            const cssWidth = Math.max(1, Math.round(canvas.parentElement?.getBoundingClientRect().width ?? 300));
            canvas.style.width = `${cssWidth}px`;
            const w = Math.max(1, Math.round(cssWidth * dpr));
            if (canvas.width !== w) {
                canvas.width = w;
            }
            // Read content's height only after the width write above has taken effect, so it
            // reflects wrapping against the correct viewport rather than the stale one.
            const cssHeight = Math.max(1, Math.round(content.getBoundingClientRect().height));
            canvas.style.height = `${cssHeight}px`;
            const h = Math.max(1, Math.round(cssHeight * dpr));
            if (canvas.height !== h) {
                canvas.height = h;
            }
            return {w, h, cssWidth, cssHeight};
        };

        // Size immediately, and keep sizing on every content resize, independent of the
        // (async, sometimes slow) WebGPU device below — otherwise the canvas sits at the
        // browser's 300x150 default for as long as that handshake takes.
        let paint = () => {};

        // Drives `params.revealProgress` from 0 to 1 on a timer while `autoIntro` is on. The
        // shader maps that 0..1 progress to a -feather..1+feather sweep against its noise
        // mask (see `revealNoise`/`mask` in the shader) so it starts at exactly 0 everywhere —
        // matching the plain DOM text underneath — and ends at exactly 1 everywhere, with
        // every point in between crossing threshold at a moment set by its own noise value
        // instead of all at once.
        const INTRO_DURATION_MS = 6000;
        let introStartTime: number | undefined;
        const runIntro = (timestamp: number) => {
            if (destroyed) return;
            if (!params.autoIntro) {
                introRaf = undefined;
                return;
            }
            if (introStartTime === undefined) introStartTime = timestamp;
            params.revealProgress = Math.min(1, (timestamp - introStartTime) / INTRO_DURATION_MS);
            paint();
            if (params.revealProgress < 1) {
                introRaf = requestAnimationFrame(runIntro);
            } else {
                introRaf = undefined;
                params.autoIntro = false;
                pane?.refresh();
            }
        };
        const restartIntro = () => {
            introStartTime = undefined;
            params.revealProgress = 0;
            params.autoIntro = true;
            pane?.refresh();
            if (introRaf === undefined) introRaf = requestAnimationFrame(runIntro);
        };
        resizeCanvasToContent();
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvasToContent();
            paint();
        });
        resizeObserver.observe(content);

        if (process.env.NODE_ENV !== 'production') {
            import('tweakpane').then(({Pane: PaneCtor}) => {
                if (destroyed) return;
                pane = new PaneCtor({title: 'Printed text'}) as unknown as TweakpanePane;
                pane.addBinding(params, 'jitterPx', {min: 0, max: 2, step: 0.05, label: 'jitter (px)'});
                pane.addBinding(params, 'bleedMix', {min: 0, max: 0.5, step: 0.01, label: 'ink bleed'});
                pane.addBinding(params, 'grainAmount', {min: 0, max: 0.5, step: 0.01, label: 'paper grain'});
                pane.addBinding(params, 'densityAmount', {min: 0, max: 0.5, step: 0.01, label: 'ink density'});
                pane.addBinding(params, 'vignetteAmount', {min: 0, max: 1, step: 0.01, label: 'vignette'});
                pane.addBinding(params, 'revealScale', {min: 0.002, max: 0.1, step: 0.001, label: 'reveal scale'});
                pane.addBinding(params, 'revealFeather', {min: 0.01, max: 0.5, step: 0.01, label: 'reveal feather'});
                pane.addBinding(params, 'autoIntro', {label: 'auto play'});
                pane.addBinding(params, 'revealProgress', {min: 0, max: 1, step: 0.001, label: 'reveal progress'})
                    .on('change', (ev: {last: boolean}) => {
                        // A manual drag on this slider should win over the running animation;
                        // otherwise the next animation frame just overwrites it right back.
                        if (params.autoIntro) {
                            params.autoIntro = false;
                            pane?.refresh();
                        }
                        if (ev.last) paint();
                    });
                pane.addButton({title: 'restart intro'}).on('click', restartIntro);
                pane.addButton({title: 're-roll seed'}).on('click', () => {
                    params.seed = Math.random() * 1000;
                    paint();
                });
                pane.on('change', () => paint());
            });
        }

        const init = async () => {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter || destroyed) return;
            device = await adapter.requestDevice();
            if (destroyed) return;

            context = canvas.getContext('webgpu') ?? undefined;
            if (!context) return;

            // Size the canvas to its real content before the context is ever configured —
            // configuring against the default 300x150 backing store and resizing afterward
            // leaves the swap chain associated with a texture the browser considers stale,
            // producing "TextureView ... associated with [Device], cannot be used with
            // [Device]" errors on every subsequent frame.
            resizeCanvasToContent();

            const format = navigator.gpu.getPreferredCanvasFormat();
            context.configure({device, format, alphaMode: 'premultiplied'});

            device.lost.then((info) => {
                if (!destroyed) console.warn('WebGPU device lost:', info.message);
            });

            const sampler = device.createSampler({magFilter: 'linear', minFilter: 'linear'});
            uniformBuffer = device.createBuffer({
                // resolution (vec2f, 8 bytes) + 10x f32 (40 bytes) = 48 bytes, already a
                // multiple of the struct's 8-byte alignment (see Params in the shader).
                size: 48,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const bindGroupLayout = device.createBindGroupLayout({
                entries: [
                    {binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
                    {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                    {binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                ],
            });

            const shaderModule = device.createShaderModule({code: shaderCode});
            const pipeline = device.createRenderPipeline({
                layout: device.createPipelineLayout({bindGroupLayouts: [bindGroupLayout]}),
                vertex: {module: shaderModule, entryPoint: 'vs'},
                fragment: {module: shaderModule, entryPoint: 'fs', targets: [{format}]},
                primitive: {topology: 'triangle-list'},
            });

            paint = () => {
                if (destroyed || !device || !context || !uniformBuffer) return;

                const {w, h, cssWidth, cssHeight} = resizeCanvasToContent();

                if (!texture || texture.width !== w || texture.height !== h) {
                    texture?.destroy();
                    texture = device.createTexture({
                        size: {width: w, height: h},
                        format: 'rgba8unorm',
                        usage:
                            GPUTextureUsage.TEXTURE_BINDING |
                            GPUTextureUsage.COPY_DST |
                            GPUTextureUsage.RENDER_ATTACHMENT,
                    });
                }

                try {
                    // Source rect is in the element's own CSS pixels; destination is the
                    // higher-resolution (device-pixel) texture — the browser upscales during
                    // the capture itself, same as a hi-dpi `drawImage`.
                    device.queue.copyElementImageToTexture?.(
                        {source: content, sx: 0, sy: 0, swidth: cssWidth, sheight: cssHeight},
                        {destination: {texture}, width: w, height: h},
                    );
                } catch (error) {
                    // Still an active origin trial — the argument shape has already changed once
                    // (see https://github.com/WICG/html-in-canvas#idl-changes) and may again.
                    // Skip this frame rather than crashing the page.
                    console.warn('copyElementImageToTexture failed, skipping this paint:', error);
                    return;
                }

                try {
                    const bindGroup = device.createBindGroup({
                        layout: bindGroupLayout,
                        entries: [
                            {binding: 0, resource: {buffer: uniformBuffer}},
                            {binding: 1, resource: texture.createView()},
                            {binding: 2, resource: sampler},
                        ],
                    });

                    // Maps 0..1 progress to a -feather..1+feather sweep against the shader's
                    // noise mask (see the comment on `runIntro`).
                    const revealT = -params.revealFeather + params.revealProgress * (1 + 2 * params.revealFeather);

                    device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([
                        w, h,
                        params.seed, params.jitterPx, params.bleedMix,
                        params.grainAmount, params.densityAmount, params.vignetteAmount,
                        revealT, params.revealScale, params.revealFeather,
                        dpr,
                    ]));

                    const encoder = device.createCommandEncoder();
                    const pass = encoder.beginRenderPass({
                        colorAttachments: [
                            {
                                view: context.getCurrentTexture().createView(),
                                clearValue: {r: 0, g: 0, b: 0, a: 0},
                                loadOp: 'clear',
                                storeOp: 'store',
                            },
                        ],
                    });
                    pass.setPipeline(pipeline);
                    pass.setBindGroup(0, bindGroup);
                    pass.draw(6);
                    pass.end();
                    device.queue.submit([encoder.finish()]);

                    if (!firstPaintDone) {
                        firstPaintDone = true;
                        setReady(true);
                        onReady();
                    }
                } catch (error) {
                    // e.g. a stale device/context pairing from a dev-mode remount, or a
                    // transient device-loss recovery — skip this frame rather than crash.
                    console.warn('WebGPU render error, skipping this paint:', error);
                }
            };

            canvas.onpaint = paint;

            document.fonts.ready.then(() => {
                if (!destroyed) introRaf = requestAnimationFrame(runIntro);
            });
        };

        init();

        return () => {
            destroyed = true;
            resizeObserver.disconnect();
            if (introRaf !== undefined) cancelAnimationFrame(introRaf);
            pane?.dispose();
            canvas.onpaint = null;
            texture?.destroy();
            context?.unconfigure?.();
            device?.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            layoutsubtree="true"
            aria-hidden={!ready}
            style={{
                position: 'absolute',
                inset: 0,
                // No CSS fade here — the very first frame renders with all intensities at 0
                // (pixel-identical to the plain text underneath), then the shader itself eases
                // them up to their real values, so the reveal is the print effect developing
                // in rather than a cross-fade standing in for it.
                pointerEvents: ready ? 'auto' : 'none',
            }}
        >
            <div ref={contentRef}>{children}</div>
        </canvas>
    );
}

export default function PrintedText({children, className}: {children: ReactNode; className?: string}) {
    const [supported, setSupported] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (supportsHtmlInCanvas()) setSupported(true);
    }, []);

    return (
        <div className={className} style={{position: 'relative'}}>
            {/* Always rendered — this is what everyone sees until (and normally forever,
                since the canvas path is still origin-trial-gated) the shader version below
                takes over. Faded out and then switched to `visibility: hidden` (not
                unmounted, not `display: none`) once redundant: it was left fully opaque
                underneath the canvas's semi-transparent, anti-aliased glyph edges, so the two
                layers' ink compounded and read darker/bolder than intended. `visibility:
                hidden` still occupies layout space — unlike `display: none` — which is what
                the canvas's own sizing (driven by this wrapper's box) depends on. */}
            <div
                aria-hidden={ready || undefined}
                style={{
                    opacity: ready ? 0 : 0.925,
                    visibility: ready ? 'hidden' : 'visible',
                    pointerEvents: ready ? 'none' : undefined,
                    transition: ready ? 'opacity 2000ms ease-out, visibility 0s linear 2000ms' : undefined,
                }}
            >
                {children}
            </div>
            {supported && <PrintedCanvas onReady={() => setReady(true)}>{children}</PrintedCanvas>}
        </div>
    );
}
