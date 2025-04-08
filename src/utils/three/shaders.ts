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

    // 改良版2Dノイズ - より不規則なパターンを生成
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // 4つの角からのランダム値を非線形に合成
        float a = random(i + vec2(0.0, 0.0));
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // より不規則な補間
        vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);

        return mix(
            mix(a, b, u.x),
            mix(c, d, u.x),
            u.y
        );
    }

    // 追加の非線形ノイズ関数
    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        // オクターブを重ねてより複雑なノイズを生成
        for(int i = 0; i < 5; i++) {
            value += amplitude * noise(st * frequency);
            st = st * 2.1 + vec2(1.5, -2.3); // 各オクターブで座標をずらす
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        return value;
    }

    void main() {
        vUv = uv;
        vec3 pos = position;

        // エッジ付近での歪みを抑制
        vec2 uvFromCenter = uv - vec2(0.5);
        float edgeWeight = 1.0 - smoothstep(0.3, 0.48, length(uvFromCenter));

        // 不規則な微細振動（エッジで抑制）
        float t = uTime * uSpeed;
        float microVibration1 = sin(t * 43.0 + pos.x * 17.0) * 0.01;
        float microVibration2 = cos(t * 31.0 + pos.y * 23.0) * 0.008;
        float microVibration3 = sin(t * 57.0 + (pos.x + pos.y) * 13.0) * 0.006;
        float combinedMicroVibration = (microVibration1 + microVibration2 + microVibration3) * edgeWeight;

        // 非線形なノイズパターンを生成
        vec2 noiseCoord1 = vec2(pos.x * 15.0 + t * 1.5, pos.y * 13.0 - t);
        vec2 noiseCoord2 = vec2(pos.y * 12.0 - t * 1.2, pos.x * 17.0 + t * 0.8);
        vec2 noiseCoord3 = vec2((pos.x + pos.y) * 11.0 + t, (pos.x - pos.y) * 14.0 - t * 1.3);

        float noise1 = fbm(noiseCoord1) * 0.35;
        float noise2 = fbm(noiseCoord2) * 0.25;
        float noise3 = fbm(noiseCoord3) * 0.2;

        // ノイズを合成（エッジで抑制）
        float finalNoise = (noise1 + noise2 + noise3) * 2.0 - 1.0;
        float distortion = (finalNoise + combinedMicroVibration) * uDistortionStrength * edgeWeight;

        pos.z += distortion;
        vDistortion = distortion;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

export const fragmentShader = `
    varying vec2 vUv;
    varying float vDistortion;
    uniform sampler2D uTexture;
    uniform float uDistortionStrength;
    uniform float uTime;

    // フラグメントシェーダー用ノイズ関数
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        vec2 uv = vUv;
        float t = uTime * 5.0;

        // エッジ付近での歪みを抑制
        vec2 uvFromCenter = uv - vec2(0.5);
        float edgeWeight = 1.0 - smoothstep(0.3, 0.48, length(uvFromCenter));

        // アスペクト比を考慮した歪みの強さの調整
        vec2 aspectAdjust = vec2(1.0, 1.777777778); // 16:9のアスペクト比に基づく調整
        float distortion = vDistortion * 0.1;
        vec2 distortedUv = uv;

        // 複数の非線形な歪みを重ね合わせ（エッジで抑制、アスペクト比考慮）
        vec2 noise1 = vec2(
            random(uv + t * 0.1) * 2.0 - 1.0,
            (random(uv + t * 0.2) * 2.0 - 1.0) / aspectAdjust.y
        ) * distortion * 0.2 * edgeWeight;

        vec2 noise2 = vec2(
            random(uv * 1.5 - t * 0.15) * 2.0 - 1.0,
            (random(uv * 1.5 + t * 0.25) * 2.0 - 1.0) / aspectAdjust.y
        ) * distortion * 0.15 * edgeWeight;

        vec2 noise3 = vec2(
            random(uv * 2.0 + t * 0.3) * 2.0 - 1.0,
            (random(uv * 2.0 - t * 0.35) * 2.0 - 1.0) / aspectAdjust.y
        ) * distortion * 0.1 * edgeWeight;

        // アスペクト比を考慮した歪みの適用
        vec2 totalNoise = noise1 + noise2 + noise3;
        distortedUv.x += totalNoise.x;
        distortedUv.y += totalNoise.y;

        // UV座標が範囲外にならないように制限
        distortedUv = clamp(distortedUv, vec2(0.0), vec2(1.0));

        // テクスチャのサンプリング
        vec4 color = texture2D(uTexture, distortedUv);

        gl_FragColor = color;
    }
`;
