export const vertexShader = `
    varying vec2 vUv;
    varying float vDistortion;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uDistortionStrength;

    // ノイズ関数
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 改良版Simplex-like 2Dノイズ
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                         + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                               dot(x12.zw,x12.zw)), 0.0);
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

    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 6; i++) {
            value += amplitude * snoise(st * frequency);
            st = st * 2.1 + vec2(1.5, -2.3);
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        return value;
    }

    void main() {
        vUv = uv;
        vec3 pos = position;

        // エッジ付近での歪みを制御
        vec2 uvFromCenter = uv - vec2(0.5);
        float edgeWeight = 1.0 - smoothstep(0.35, 0.5, length(uvFromCenter));

        // 時間に基づく動的な歪み
        float t = uTime * uSpeed;
        vec2 noiseCoord = vec2(
            pos.x * 0.8 + t * 0.3,
            pos.y * 0.8 - t * 0.2
        );

        // 複数の周波数の歪みを合成
        float noise = fbm(noiseCoord);
        float displacement = noise * uDistortionStrength * edgeWeight;

        // Z軸の変位を適用
        pos.z += displacement * 2.0;

        // より有機的な動きのための追加の歪み
        float organicNoise = snoise(vec2(t * 0.5, pos.y * 0.3)) *
                            snoise(vec2(pos.x * 0.3, t * 0.4));
        pos.z += organicNoise * uDistortionStrength * edgeWeight * 0.5;

        vDistortion = displacement;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

export const fragmentShader = `
    varying vec2 vUv;
    varying float vDistortion;
    uniform sampler2D uTexture;
    uniform float uDistortionStrength;
    uniform float uTime;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vec2 uv = vUv;
        float t = uTime * 0.8;

        // エッジ付近での歪みを制御
        vec2 uvFromCenter = uv - vec2(0.5);
        float edgeWeight = 1.0 - smoothstep(0.35, 0.5, length(uvFromCenter));

        // 歪みの強さを計算
        float distortionStrength = vDistortion * uDistortionStrength;

        // UVの歪み
        vec2 distortedUv = uv + vec2(
            sin(t + uv.y * 10.0) * 0.02,
            cos(t + uv.x * 10.0) * 0.02
        ) * distortionStrength * edgeWeight;

        // より有機的な歪みを追加
        distortedUv += vec2(
            sin(t * 0.7 + distortedUv.y * 8.0) * 0.01,
            cos(t * 0.6 + distortedUv.x * 8.0) * 0.01
        ) * distortionStrength * edgeWeight;

        // UV座標を制限
        distortedUv = clamp(distortedUv, vec2(0.0), vec2(1.0));

        // テクスチャのサンプリング
        vec4 color = texture2D(uTexture, distortedUv);

        // 歪みに基づく色の調整
        float distortionColor = abs(vDistortion) * 0.1;
        color.rgb += vec3(distortionColor) * edgeWeight;

        gl_FragColor = color;
    }
`;
