'use client';

import {useEffect, useRef, useState, useMemo} from 'react';

function useDarkMode() {
    // Initialize with the correct value immediately on the client
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false; // SSR fallback
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Theme detection effect for listening to changes
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isDarkMode;
}

const HeroImage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | undefined>(undefined);
    const [colorMode, setColorMode] = useState(0); // Start with blue, randomize after mount
    const animationRef = useRef<number | undefined>(undefined);
    const isDarkMode = useDarkMode();

    // Set random color mode after mount to avoid hydration mismatch
    useEffect(() => {
        setColorMode(Math.floor(Math.random() * 5));
    }, []);


    useEffect(() => {
        let device: GPUDevice;
        let context: GPUCanvasContext;
        let renderPipeline: GPURenderPipeline;
        let crtPipeline: GPURenderPipeline;
        let uniformBuffer: GPUBuffer;
        let bindGroup: GPUBindGroup;
        let crtBindGroup: GPUBindGroup;
        let intermediateTexture: GPUTexture;
        let sampler: GPUSampler;

        const initWebGPU = async () => {
            const canvas = canvasRef.current;
            if (!canvas) {
                return;
            }

            if (canvas.width === 0 || canvas.height === 0) {
                return;
            }

            // Check WebGPU support
            if (!navigator.gpu) {
                console.log('WebGPU not supported');
                return;
            }

            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (!adapter) {
                    console.log('WebGPU adapter not available');
                    return;
                }

                device = await adapter.requestDevice();
                context = canvas.getContext('webgpu') as GPUCanvasContext;

                if (!context) {
                    console.log('WebGPU context not available');
                    return;
                }

                const format = navigator.gpu.getPreferredCanvasFormat();
                context.configure({
                    device,
                    format,
                    alphaMode: 'premultiplied',
                });

                setIsWebGPUSupported(true);

                // Vertex shader - simple quad covering the screen
                const vertexShaderCode = /* wgsl */ `
          @vertex
          fn main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
            let pos = array<vec2f, 6>(
              vec2f(-1.0, -1.0),
              vec2f( 1.0, -1.0),
              vec2f(-1.0,  1.0),
              vec2f( 1.0, -1.0),
              vec2f( 1.0,  1.0),
              vec2f(-1.0,  1.0)
            );
            return vec4f(pos[vertexIndex], 0.0, 1.0);
          }
        `;

                // Fragment shader - simplex noise with color banding and dithering
                const fragmentShaderCode = /* wgsl */ `
          struct Uniforms {
            time: f32,
            color_mode: f32,
            is_dark_mode: f32,
            resolution: vec2f,
          }

          @group(0) @binding(0) var<uniform> uniforms: Uniforms;

          // 3D hash function
          fn hash3(p: vec3f) -> f32 {
            var p3 = fract(p * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
          }

          // 3D noise function
          fn noise3d(p: vec3f) -> f32 {
            let i = floor(p);
            let f = fract(p);

            // Eight corners of the cube
            let a = hash3(i);
            let b = hash3(i + vec3f(1.0, 0.0, 0.0));
            let c = hash3(i + vec3f(0.0, 1.0, 0.0));
            let d = hash3(i + vec3f(1.0, 1.0, 0.0));
            let e = hash3(i + vec3f(0.0, 0.0, 1.0));
            let f_corner = hash3(i + vec3f(1.0, 0.0, 1.0));
            let g = hash3(i + vec3f(0.0, 1.0, 1.0));
            let h = hash3(i + vec3f(1.0, 1.0, 1.0));

            // Smooth interpolation
            let u = f * f * (3.0 - 2.0 * f);

            // Trilinear interpolation
            return mix(
              mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
              mix(mix(e, f_corner, u.x), mix(g, h, u.x), u.y),
              u.z
            );
          }

          // 3D Fractional Brownian Motion (fBm)
          fn fbm3d(p: vec3f) -> f32 {
            var value = 0.0;
            var amplitude = 0.5;
            var frequency = 1.0;
            var pos = p;

            for (var i = 0; i < 4; i++) {
              value += amplitude * (noise3d(pos * frequency) * 2.0 - 1.0); // Convert to -1 to 1 range
              pos *= 2.0;
              amplitude *= 0.5;
            }

            return value;
          }

          // Classical ordered dithering function - returns binary pattern
          fn dither(pos: vec2f, value: f32) -> f32 {
            let dither_matrix = array<f32, 16>(
              0.0/16.0, 8.0/16.0, 2.0/16.0, 10.0/16.0,
              12.0/16.0, 4.0/16.0, 14.0/16.0, 6.0/16.0,
              3.0/16.0, 11.0/16.0, 1.0/16.0, 9.0/16.0,
              15.0/16.0, 7.0/16.0, 13.0/16.0, 5.0/16.0
            );

            let x = i32(pos.x) % 4;
            let y = i32(pos.y) % 4;
            let threshold = dither_matrix[y * 4 + x];

            // Return binary decision for classical dithering
            return select(0.0, 1.0, fract(value) > threshold);
          }

          @fragment
          fn main(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
            // Downscale to 8 "DPI" equivalent - create chunky pixels
            let pixel_size = 8.0;
            let downscaled_coord = floor(fragCoord.xy / pixel_size) * pixel_size;
            let time = uniforms.time * 0.0003;

            // 3D noise coordinates with time as Z dimension
            let x = downscaled_coord.x * 0.005;
            let y = downscaled_coord.y * 0.0035;

            // Single 3D fbm call for natural movement
            let combined_noise = fbm3d(vec3f(x, y, time));

            // Color banding with dithering - ensure proper normalization
            let normalized_noise = clamp((combined_noise + 1.0) * 0.5, 0.0, 1.0); // Force into 0-1 range
            let bands = 6.0;
            let lower_band_index = clamp(i32(floor(normalized_noise * bands)), 0, 5);
            let upper_band_index = min(lower_band_index + 1, 5);
            let dither_pattern = dither(downscaled_coord / pixel_size, normalized_noise * bands);
            let band_index = select(lower_band_index, upper_band_index, dither_pattern > 0.5);
            let intensity = f32(clamp(band_index, 0, 5)) / 5.0;
            let mode = i32(uniforms.color_mode);
            let is_dark = uniforms.is_dark_mode > 0.5;

            var target_color: vec3f;
            if (mode == 0) {
              target_color = vec3f(0.4, 0.4, 1.0); // Blue
            } else if (mode == 1) {
              target_color = vec3f(1.0, 0.0, 0.0); // Red
            } else if (mode == 2) {
              target_color = vec3f(0.0, 0.8, 0.0); // Green
            } else if (mode == 3) {
              target_color = vec3f(1.0, 0.0, 1.0); // Purple
            } else {
              target_color = vec3f(0.95, 0.95, 0.95); // White
            }

            // Theme-aware color mixing
            var color: vec3f;
            if (is_dark || mode == 4) {
              // Dark mode: mix from black to full color
              color = mix(vec3f(0.0), target_color, intensity);
            } else {
              // Light mode: mix from white background to target color
              color = mix(vec3f(0.9), target_color * 0.8, intensity);
            }

            return vec4f(color, 1.0);
          }
        `;

                // CRT post-processing shader
                const crtShaderCode = /* wgsl */ `
          struct Uniforms {
            time: f32,
            color_mode: f32,
            is_dark_mode: f32,
            resolution: vec2f,
          }

          @group(0) @binding(0) var<uniform> uniforms: Uniforms;
          @group(0) @binding(1) var inputTexture: texture_2d<f32>;
          @group(0) @binding(2) var inputSampler: sampler;

          // CRT barrel distortion
          fn barrelDistortion(uv: vec2f, amount: f32) -> vec2f {
            let center = vec2f(0.5, 0.5);
            let delta = uv - center;
            let delta2 = delta * delta;
            let r2 = delta2.x + delta2.y;
            let factor = 1.0 + r2 * amount;
            return center + delta * factor;
          }

          @fragment
          fn main(@builtin(position) fragCoord: vec4f) -> @location(0) vec4f {
            // Get resolution from texture dimensions instead of uniforms
            let resolution = vec2f(textureDimensions(inputTexture));
            var uv = fragCoord.xy / resolution;

            // Pre-scale UV to zoom in slightly (eliminates black borders from distortion)
            let zoom = 0.95;
            uv = (uv - 0.5) * zoom + 0.5;

            // Apply barrel distortion
            let distortion_amount = 0.15;
            uv = barrelDistortion(uv, distortion_amount);

            // Clamp UVs
            let clamped_uv = clamp(uv, vec2f(0.0), vec2f(1.0));

            // Chromatic aberration (increased)
            let aberration_amount = 0.025;
            let r = textureSampleLevel(inputTexture, inputSampler, clamp(clamped_uv - vec2f(aberration_amount, 0.0), vec2f(0.0), vec2f(1.0)), 0.0).r;
            let g = textureSampleLevel(inputTexture, inputSampler, clamped_uv, 0.0).g;
            let b = textureSampleLevel(inputTexture, inputSampler, clamp(clamped_uv + vec2f(aberration_amount, 0.0), vec2f(0.0), vec2f(1.0)), 0.0).b;
            var color = vec3f(r, g, b);

            // Scanlines (reduced intensity)
            let scanline = sin(fragCoord.y * 0.1) * 0.08;
            color *= (1.0 - scanline);

            // Vignette
            let vignette_center = clamped_uv - vec2f(0.5);
            let vignette = 1.0 - dot(vignette_center, vignette_center) * 0.8;
            color *= vignette;

            // Phosphor glow (reduced)
            let glow_strength = 0.15;
            color += color * glow_strength;

            // Flicker
            let flicker = 1.0 - (sin(uniforms.time * 0.00005) * 0.02);
            color *= flicker;

            return vec4f(color, 1.0);
          }
        `;

                // Create shaders
                const vertexShader = device.createShaderModule({
                    code: vertexShaderCode,
                });

                const fragmentShader = device.createShaderModule({
                    code: fragmentShaderCode,
                });

                const crtShader = device.createShaderModule({
                    code: crtShaderCode,
                });

                // Create uniform buffer
                uniformBuffer = device.createBuffer({
                    size: 24, // WebGPU requires 16-byte alignment: 4+4+4+8 = 20 bytes, padded to 24
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                });

                // Create bind group layout
                const bindGroupLayout = device.createBindGroupLayout({
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: {type: 'uniform' as GPUBufferBindingType},
                        },
                    ],
                });

                // Create bind group
                bindGroup = device.createBindGroup({
                    layout: bindGroupLayout,
                    entries: [
                        {
                            binding: 0,
                            resource: {buffer: uniformBuffer},
                        },
                    ],
                });

                // Create render pipeline (first pass - noise generation)
                renderPipeline = device.createRenderPipeline({
                    layout: device.createPipelineLayout({
                        bindGroupLayouts: [bindGroupLayout],
                    }),
                    vertex: {
                        module: vertexShader,
                        entryPoint: 'main',
                    },
                    fragment: {
                        module: fragmentShader,
                        entryPoint: 'main',
                        targets: [{format}],
                    },
                    primitive: {
                        topology: 'triangle-list',
                    },
                });

                // Create intermediate texture for first pass
                intermediateTexture = device.createTexture({
                    size: {width: canvas.width, height: canvas.height},
                    format,
                    usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
                });

                // Create sampler for CRT shader
                sampler = device.createSampler({
                    magFilter: 'nearest',
                    minFilter: 'nearest',
                });

                // Create CRT bind group layout (uniforms + texture + sampler)
                const crtBindGroupLayout = device.createBindGroupLayout({
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: {type: 'uniform' as GPUBufferBindingType},
                        },
                        {
                            binding: 1,
                            visibility: GPUShaderStage.FRAGMENT,
                            texture: {sampleType: 'float' as GPUTextureSampleType},
                        },
                        {
                            binding: 2,
                            visibility: GPUShaderStage.FRAGMENT,
                            sampler: {type: 'filtering' as GPUSamplerBindingType},
                        },
                    ],
                });

                // Create CRT bind group
                crtBindGroup = device.createBindGroup({
                    layout: crtBindGroupLayout,
                    entries: [
                        {
                            binding: 0,
                            resource: {buffer: uniformBuffer},
                        },
                        {
                            binding: 1,
                            resource: intermediateTexture.createView(),
                        },
                        {
                            binding: 2,
                            resource: sampler,
                        },
                    ],
                });

                // Create CRT pipeline (second pass - post-processing)
                crtPipeline = device.createRenderPipeline({
                    layout: device.createPipelineLayout({
                        bindGroupLayouts: [crtBindGroupLayout],
                    }),
                    vertex: {
                        module: vertexShader,
                        entryPoint: 'main',
                    },
                    fragment: {
                        module: crtShader,
                        entryPoint: 'main',
                        targets: [{format}],
                    },
                    primitive: {
                        topology: 'triangle-list',
                    },
                });

                // Animation loop with two-pass rendering
                const animate = (timestamp: number) => {
                    if (!canvas || !context || !device || !renderPipeline || !crtPipeline ||
                        !bindGroup || !crtBindGroup || !uniformBuffer || !intermediateTexture) {
                        return;
                    }

                    try {
                        // Update uniforms
                        const uniformData = new Float32Array([
                            timestamp, // time
                            colorMode, // color_mode
                            isDarkMode ? 1.0 : 0.0, // is_dark_mode
                            canvas.width, // resolution.x
                            canvas.height, // resolution.y
                        ]);
                        device.queue.writeBuffer(uniformBuffer, 0, uniformData);

                        const commandEncoder = device.createCommandEncoder();

                        // First pass: Render noise to intermediate texture
                        const intermediateView = intermediateTexture.createView();
                        const firstPass = commandEncoder.beginRenderPass({
                            colorAttachments: [
                                {
                                    view: intermediateView,
                                    clearValue: {r: 0, g: 0, b: 0, a: 1},
                                    loadOp: 'clear' as GPULoadOp,
                                    storeOp: 'store' as GPUStoreOp,
                                },
                            ],
                        });

                        firstPass.setPipeline(renderPipeline);
                        firstPass.setBindGroup(0, bindGroup);
                        firstPass.draw(6);
                        firstPass.end();

                        // Second pass: Apply CRT effect (simplified for now) to canvas
                        const currentTexture = context.getCurrentTexture();
                        const textureView = currentTexture.createView();
                        const secondPass = commandEncoder.beginRenderPass({
                            colorAttachments: [
                                {
                                    view: textureView,
                                    clearValue: {r: 0, g: 0, b: 0, a: 1},
                                    loadOp: 'clear' as GPULoadOp,
                                    storeOp: 'store' as GPUStoreOp,
                                },
                            ],
                        });

                        secondPass.setPipeline(crtPipeline);
                        secondPass.setBindGroup(0, crtBindGroup);
                        secondPass.draw(6);
                        secondPass.end();

                        device.queue.submit([commandEncoder.finish()]);
                    } catch (error) {
                        console.warn('WebGPU render error:', error);
                        // Skip this frame and continue
                    }

                    animationRef.current = requestAnimationFrame(animate);
                };

                // Start animation
                animationRef.current = requestAnimationFrame(animate);

            } catch (error) {
                console.error('WebGPU initialization failed:', error);
                setIsWebGPUSupported(false);
            }
        };

        // Handle canvas resize
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        initWebGPU();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = undefined;
            }
            window.removeEventListener('resize', handleResize);

            // Clean up WebGPU resources
            if (uniformBuffer) {
                uniformBuffer.destroy();
            }
            if (intermediateTexture) {
                intermediateTexture.destroy();
            }
            if (device) {
                device.destroy();
            }
        };
    }, [colorMode, isDarkMode]);

    const handleCanvasClick = () => {
        setColorMode((prev) => (prev + 1) % 5);
    };

    // Get the current color for the border with 50% opacity
    const borderColor = useMemo(() => {
        const colors = [
            'rgba(102, 102, 255, 0.5)',  // Blue
            'rgba(255, 0, 0, 0.5)',       // Red
            'rgba(0, 204, 0, 0.5)',       // Green
            'rgba(255, 0, 255, 0.5)',     // Purple
            'rgba(242, 242, 242, 0.5)',   // White
        ];
        return colors[colorMode];
    }, [colorMode]);

    return (
        <div className="relative w-full h-64 overflow-hidden rounded-lg" style={{border: `1px solid ${borderColor}`}} suppressHydrationWarning>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-pointer"
                onClick={handleCanvasClick}
            />
            {isWebGPUSupported === false && (
                <div className="absolute inset-0 flex items-center justify-center font-mono">
                    <div className="text-center">
                        <div className="text-lg font-medium mb-2">WebGPU Visualization</div>
                        <div className="text-sm">WebGPU not supported in this browser</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroImage;