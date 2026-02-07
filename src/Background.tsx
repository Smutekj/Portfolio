import { useEffect, useRef, useState } from 'react'

import { type RGBA } from './Colors.tsx'

// Vertex shader
const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

// Fragment shader with hexagon pattern
const fragmentShaderSource = `
        precision mediump float;
        uniform vec2 resolution;
        uniform vec3 primaryColor;
        uniform float time;

        
        float rand( float n )
        {
            return fract(cos(n)*41415.92653);
        }

        float noise(vec2 p)
        {
            vec2 f  = smoothstep(0.0, 1.0, fract(p));
            p  = floor(p);
            float n = p.x + p.y*57.0;
            return mix(mix(rand(n+0.0), rand(n+1.0),f.x), mix( rand(n+57.0), rand(n+58.0),f.x),f.y);
        }

        float fbm( vec2 p )
        {
            mat2 m2 = mat2(1.6,-1.2,1.2,1.6);	
            float f = 0.5000*noise( p ); p = m2*p;
            f += 0.2500*noise( p ); p = m2*p;
            f += 0.1666*noise( p ); p = m2*p;
            f += 0.0834*noise( p );
            return f;
        }

        float rand12(vec2 co)
        {
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        vec2 rand21(float p)
        {
            return fract(vec2(sin(p * 591.32), cos(p * 391.32)));
        }

        //      Simplex noise stolen from:
        //      Author : Ian McEwan, Ashima Arts.
        //      https://github.com/stegu/webgl-noise
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x);}

        vec4 taylorInvSqrt(vec4 r)
        {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v)
        { 
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 =   v - i + dot(i, C.xxx) ;

            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            //   x0 = x0 - 0.0 + 0.0 * C.xxx;
            //   x1 = x0 - i1  + 1.0 * C.xxx;
            //   x2 = x0 - i2  + 2.0 * C.xxx;
            //   x3 = x0 - 1.0 + 3.0 * C.xxx;
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

            // Permutations
            i = mod289(i); 
            vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
            //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

            //Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            // Mix final noise value
            vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                                -0.577350269189626,  // -1.0 + 2.0 * C.x
                                0.024390243902439); // 1.0 / 41.0
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i); // Avoid truncation effects in permutation
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                + i.x + vec3(0.0, i1.x, 1.0 ));

            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
            m = m*m ;
            m = m*m ;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }


        vec2 rotate(vec2 p, float a)
        {
            return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
        }


        vec3 hexCoord(vec2 p, float hexSize)
        {
            vec3 q = vec3(p / hexSize, 0.0);
            q.z = -0.5 * q.x - q.y;
            
            float z = -0.5 * q.x - q.y;
            q.y -= 0.5 * q.x;
            
            vec3 i = floor(q+0.5);
            float s = floor(i.x + i.y + i.z);
            vec3 d = abs(i-q);
            
            if( d.x >= d.y && d.x >= d.z ) i.x -= s;
            else if( d.y >= d.x && d.y >= d.z )	i.y -= s;
            else i.z -= s;
            
            vec2 coord = vec2(i.x, ( i.y - i.z + (1.0-mod(i.x, 2.0)) ) / 2.0 );
            float dist = length(p - vec2(coord.x, coord.y - 0.5*mod(i.x-1.0, 2.0))*hexSize) / hexSize;
            return vec3(coord, dist);
        }

        const vec3 baseGridColor = vec3(0.9, 0.9, 0.9);
        const vec3 backgroundColor = vec3(0.1, 0.1, 0.1);
        const vec2 waveVectors = vec2(1./100., 1./100.);
        const float waveAmplitude = 0.2;
        const float waveSpeed = 0.0;

        float lavaLamp(vec2 uv)
        {
            vec2 pos = vec2(uv);

            float DF = 0.0;

            // Add a random position
            float a = 0.0;
            vec2 vel = vec2(time*.1);
            DF += snoise(pos+vel)*.25+.25;

            // Add a random position
            a = snoise(pos*vec2(cos(time*0.15),sin(time*0.1))*0.1)*3.1415;
            vel = vec2(cos(a),sin(a));
            DF += snoise(pos)*.2+0.2;

            return smoothstep(.7,.75,1.-fract(DF)) ;
        }

        void main() {
          
            vec2 uv = (gl_FragCoord.xy + resolution.xy*2.5);
            uv.x *= resolution.x / resolution.y; // aspect ratio

            vec3 hex = hexCoord(uv, 100. );
            float cellHash = rand12(hex.xy);
            
            float bubbles = 0.4-(snoise(vec3(uv /500., time*0.1))*0.2 + 0.2); //lavaLamp(uv/resolution.y); //
            
            vec3 background = mix(backgroundColor, vec3(0.7,0.7,0.7), cellHash);
            vec3 gridColor = mix(baseGridColor, primaryColor, bubbles);
            vec3 col = mix(background, gridColor, smoothstep(0.1, 1.0, hex.b));
            
            col -= 0.3*cellHash;
            col += 0.7*bubbles* primaryColor; 
            gl_FragColor = vec4(col, 0.2);
        }
    `;

export function HexagonBackground() {
    return (
        <svg
            width="100%"
            height="100%"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0.15,
                pointerEvents: "none"
            }}
        >
            <defs>
                <pattern
                    patternUnits="userSpaceOnUse"
                    width="100"
                    height="87"
                    preserveAspectRatio="xMidYMid"
                    patternTransform="translate(1,1) scale(0.5,0.5)"
                    style={{ fill: "#ffffff44" }}
                    id="Hexagons">
                    <path
                        id="path27"
                        d="M 23.246093,0 0,13.382812 V 44.689453 L 0.0839844,44.640625 24.033203,58.505859 24.001953,86.332031 22.841796,87 h 4.478516 L 26.068359,86.275391 26.099609,58.449219 50.083984,44.640625 74.033203,58.505859 74.001953,86.332031 72.841796,87 h 4.478516 L 76.068359,86.275391 76.099609,58.449219 100,44.689453 V 13.365234 L 76.919921,0 H 73.246093 L 50.015625,13.373047 26.919921,0 Z M 25.083984,1.25 49.033203,15.115234 49.001953,42.941406 25.017578,56.75 1.0019531,42.845703 l 0.033203,-27.75 z m 50,0 24.017576,13.904297 -0.0352,27.75 L 75.017578,56.75 51.068359,42.884766 51.099609,15.058594 Z" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#Hexagons)" />
        </svg>
    );
}

export type BeehiveWebGLProps = {
    primaryColor: RGBA,
}

export function BeehiveWebGL({ primaryColor }: BeehiveWebGLProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [program, setProgram] = useState<WebGLProgram>()

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl)
            return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Handle resize
        const resizeObserver = new ResizeObserver(() => {
            if (!canvas || !gl) return;

            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            gl.viewport(0, 0, canvas.width, canvas.height);

            const resolutionLocation = gl.getUniformLocation(program, 'resolution');
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        });
        resizeObserver.observe(canvas);



        // Compile shader
        function compileShader(gl: WebGLRenderingContext, source: string, type: number) {

            const shader = gl.createShader(type);
            if (!shader) return null;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }

        const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) return;

        // Create program
        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Create fullscreen quad
        const positions = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1,
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Set uniforms
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');
        const colorLocation = gl.getUniformLocation(program, 'primaryColor');
        const timeLocation = gl.getUniformLocation(program, 'time');
        setProgram(program)

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform3f(colorLocation, primaryColor.r / 255., primaryColor.g / 255., primaryColor.b / 255.)

        // Enable blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Animation loop
        let startTime = Date.now();
        function render(gl: WebGLRenderingContext) {
            const time = (Date.now() - startTime) * 0.001;
            gl.uniform1f(timeLocation, time);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(() => render(gl));
        }
        render(gl);

        // Cleanup
        return () => {
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(buffer);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        if (!program) return;

        gl.useProgram(program)
        const colorLocation = gl.getUniformLocation(program, 'primaryColor');
        gl.uniform3f(colorLocation, primaryColor.r / 255., primaryColor.g / 255., primaryColor.b / 255.)

    }, [primaryColor])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                background: "black",
                zIndex: -1

            }}
        />
    );
}

