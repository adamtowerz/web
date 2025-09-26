'use client';

import { useEffect, useRef, useState } from 'react';

const HeroImage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebGPUSupported, setIsWebGPUSupported] = useState(false);
  const [colorMode, setColorMode] = useState(0); // 0=yellow, 1=red, 2=green, 3=blue, 4=purple
  const [isDarkMode, setIsDarkMode] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  // Theme detection effect
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    let device: GPUDevice;
    let context: GPUCanvasContext;
    let renderPipeline: GPURenderPipeline;
    let uniformBuffer: GPUBuffer;
    let bindGroup: GPUBindGroup;

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

          // Hash function for noise generation - returns vec2f for gradients
          fn hash22(p: vec2f) -> vec2f {
            var p3 = fract(vec3f(p.xyx) * vec3f(0.1031, 0.1030, 0.0973));
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.xx + p3.yz) * p3.zy);
          }

          // Simple hash for single value
          fn hash12(p: vec2f) -> f32 {
            var p3 = fract(vec3f(p.xyx) * 0.1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
          }

          // Simplex noise function
          fn simplex_noise(p: vec2f) -> f32 {
            let K1 = 0.366025404; // (sqrt(3)-1)/2;
            let K2 = 0.211324865; // (3-sqrt(3))/6;

            let i = floor(p + (p.x + p.y) * K1);
            let a = p - i + (i.x + i.y) * K2;
            let o = select(vec2f(0.0, 1.0), vec2f(1.0, 0.0), a.x > a.y);
            let b = a - o + K2;
            let c = a - 1.0 + 2.0 * K2;

            let h = max(0.5 - vec3f(dot(a, a), dot(b, b), dot(c, c)), vec3f(0.0));

            // Generate proper gradient vectors
            let ga = hash22(i) * 2.0 - 1.0;
            let gb = hash22(i + o) * 2.0 - 1.0;
            let gc = hash22(i + vec2f(1.0)) * 2.0 - 1.0;

            let n = h * h * h * h * vec3f(
              dot(a, ga),
              dot(b, gb),
              dot(c, gc)
            );

            return dot(n, vec3f(70.0));
          }

          // Fractional Brownian Motion (fBm) using simplex noise
          fn fbm(p: vec2f) -> f32 {
            var value = 0.0;
            var amplitude = 0.5;
            var frequency = 1.0;
            var pos = p;

            for (var i = 0; i < 4; i++) {
              value += amplitude * simplex_noise(pos * frequency);
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

            // Multiple sine waves to simulate noise - we know this works
            let x = downscaled_coord.x * 0.01;
            let y = downscaled_coord.y * 0.01;
            let t = time;

            // Create multiple octaves like fbm but with sine waves
            let wave1 = sin(x * 3.0 + t * 2.0) * sin(y * 2.5 + t * 1.5);
            let wave2 = sin(x * 6.0 + t * -1.0) * sin(y * 5.0 + t * 2.5) * 0.5;
            let wave3 = sin(x * 12.0 + t * 3.0) * sin(y * 8.0 + t * -2.0) * 0.25;
            let wave4 = sin(x * 24.0 + t * -4.0) * sin(y * 16.0 + t * 1.0) * 0.125;

            let combined_noise = wave1 + wave2 + wave3 + wave4;

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
              target_color = vec3f(1.0, 1.0, 0.0); // Yellow
            } else if (mode == 1) {
              target_color = vec3f(1.0, 0.0, 0.0); // Red
            } else if (mode == 2) {
              target_color = vec3f(0.0, 1.0, 0.0); // Green
            } else if (mode == 3) {
              target_color = vec3f(0.0, 0.0, 1.0); // Blue
            } else {
              target_color = vec3f(1.0, 0.0, 1.0); // Purple
            }

            // Theme-aware color mixing
            var color: vec3f;
            if (is_dark) {
              // Dark mode: mix from black to full color
              color = mix(vec3f(0.0), target_color, intensity);
            } else {
              // Light mode: mix from white background to target color
              color = mix(vec3f(0.9), target_color * 0.8, intensity);
            }

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
              buffer: { type: 'uniform' as GPUBufferBindingType },
            },
          ],
        });

        // Create bind group
        bindGroup = device.createBindGroup({
          layout: bindGroupLayout,
          entries: [
            {
              binding: 0,
              resource: { buffer: uniformBuffer },
            },
          ],
        });

        // Create render pipeline
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
            targets: [{ format }],
          },
          primitive: {
            topology: 'triangle-list',
          },
        });

        // Animation loop
        const animate = (timestamp: number) => {
          if (!canvas || !context || !device || !renderPipeline || !bindGroup || !uniformBuffer) return;

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

            // Get current texture and ensure it's from the same device
            const currentTexture = context.getCurrentTexture();
            const textureView = currentTexture.createView();

            // Render
            const commandEncoder = device.createCommandEncoder();
            const renderPass = commandEncoder.beginRenderPass({
              colorAttachments: [
                {
                  view: textureView,
                  clearValue: { r: 0, g: 0, b: 0, a: 1 },
                  loadOp: 'clear' as GPULoadOp,
                  storeOp: 'store' as GPUStoreOp,
                },
              ],
            });

            renderPass.setPipeline(renderPipeline);
            renderPass.setBindGroup(0, bindGroup);
            renderPass.draw(6);
            renderPass.end();

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
      if (device) {
        device.destroy();
      }
    };
  }, [colorMode]);

  const handleCanvasClick = () => {
    setColorMode((prev) => (prev + 1) % 5);
  };

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gradient-to-br from-blue-900 to-purple-900">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
      />
      {!isWebGPUSupported && (
        <div className="absolute inset-0 flex items-center justify-center text-white/70">
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