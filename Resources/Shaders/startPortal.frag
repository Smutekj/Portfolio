#version 300 es 

precision highp float;

in highp vec2 v_tex_coord;
in vec4 v_color;
in float v_time;
in float v_duration;
in float v_brightness;

out vec4 FragColor;

uniform float u_duration_start = 1.0f;
uniform float u_duration_end = 0.5f;
uniform float u_duration = 2.0f;
uniform float u_thickness = 0.2f;
uniform float u_glow_thickness = 0.08f;

vec4 permute_3d(vec4 x) {
    return mod(((x * 34.0f) + 1.0f) * x, 289.0f);
}
vec4 taylorInvSqrt3d(vec4 r) {
    return 1.79284291400159f - 0.85373472095314f * r;
}

float simplexNoise3d(vec3 v) {
    const vec2 C = vec2(1.0f / 6.0f, 1.0f / 3.0f);
    const vec4 D = vec4(0.0f, 0.5f, 1.0f, 2.0f);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0f - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    //  x0 = x0 - 0. + 0.0 * C
    vec3 x1 = x0 - i1 + 1.0f * C.xxx;
    vec3 x2 = x0 - i2 + 2.0f * C.xxx;
    vec3 x3 = x0 - 1.f + 3.0f * C.xxx;

    // Permutations
    i = mod(i, 289.0f);
    vec4 p = permute_3d(permute_3d(permute_3d(i.z + vec4(0.0f, i1.z, i2.z, 1.0f)) + i.y + vec4(0.0f, i1.y, i2.y, 1.0f)) + i.x + vec4(0.0f, i1.x, i2.x, 1.0f));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0f / 7.0f; // N=7
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0f * floor(p * ns.z * ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0f * x_);    // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0f - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0f + 1.0f;
    vec4 s1 = floor(b1) * 2.0f + 1.0f;
    vec4 sh = -step(h, vec4(0.0f));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt3d(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6f - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0f);
    m = m * m;
    return 42.0f * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm3d(vec3 x, const in int it) {
    float v = 0.0f;
    float a = 0.5f;
    vec3 shift = vec3(100);

    for(int i = 0; i < 32; ++i) {
        if(i < it) {
            v += a * simplexNoise3d(x);
            x = x * 2.0f + shift;
            a *= 0.5f;
        }
    }
    return v;
}

vec3 rotateZ(vec3 v, float angle) {
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);
    return vec3(v.x * cosAngle - v.y * sinAngle, v.x * sinAngle + v.y * cosAngle, v.z);
}

#define saturate(V) clamp(V, 0.0, 1.0)
vec3 hue2rgb(float hue) {

    float R = abs(hue * 6.0f - 3.0f) - 1.0f;
    float G = 2.0f - abs(hue * 6.0f - 2.0f);
    float B = 2.0f - abs(hue * 6.0f - 4.0f);
    return saturate(vec3(R, G, B));
}
vec3 hsv2rgb(const in vec3 hsv) {
    return ((hue2rgb(hsv.x) - 1.0f) * hsv.y + 1.0f) * hsv.z;
}
vec4 hsv2rgb(const in vec4 hsv) {
    return vec4(hsv2rgb(hsv.rgb), hsv.a);
}
vec3 rgb2hsv(const in vec3 c) {
    vec4 K = vec4(0.f, -0.33333333333333333333f, 0.6666666666666666666f, -1.0f);
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    float d = q.x - min(q.w, q.y);
    return vec3(abs(q.z + (q.w - q.y) / (6.f * d + 0.00001f)), d / (q.x + 0.00001f), q.x);
}
vec4 rgb2hsv(const in vec4 c) {
    return vec4(rgb2hsv(c.rgb), c.a);
}

vec3 complementary(vec3 color) {
    float M = max(color.r, max(color.g, color.b));
    vec3 hsv = rgb2hsv(color / M);
    float h = mod(hsv.x + 0.5f, 1.f);
    vec3 complementary_hsv = vec3(h, hsv.y, hsv.z);
    return hsv2rgb(complementary_hsv) * M;
}

void main() {
    // Normalized pixel coordinates (from 0 to 1) and (from -1 to 1)
    vec2 uv = 2.f * v_tex_coord - vec2(1.f);

    float angle = -0.8f * log2(length(uv));
    uv = rotateZ(vec3(uv.xy, v_time), angle + 0.001f * v_time).xy;

    float radiusNoiseFast = simplexNoise3d(vec3(6.f * uv.xy, 0.002f * v_time));
    float radiusNoise = simplexNoise3d(vec3(10.f * uv.xy, 0.001f * v_time));

    float circle_radius = 0.9f * (smoothstep(0.f, u_duration_start, v_time) - smoothstep(u_duration - u_duration_end, u_duration, v_time));
    circle_radius += +0.05f * radiusNoise + 0.03f * radiusNoiseFast; // perturb the portal

    float sdf_circle = distance(uv, vec2(0.f)) - circle_radius;
    float circle_edge_region = smoothstep(-u_thickness, 0.f, sdf_circle) - smoothstep(0.f, u_thickness, sdf_circle);
    float circle_inside_region = smoothstep(0.f, -0.1f, sdf_circle);
    float circle = 1.f - smoothstep(0.f, u_thickness, sdf_circle);

    vec3 color = vec3(0, 0.0f, 0.0f);
    color = mix(color, v_color.rgb * v_brightness, circle_edge_region);
    color = mix(color, vec3(0.0039f, 0.9922f, 0.5294f), circle_inside_region);

    float inside_alpha = 0.2f * (1.f - smoothstep(u_duration_start, u_duration - u_duration_end, v_time));
    float alpha = circle;
    alpha = mix(alpha, inside_alpha, circle_inside_region);
    FragColor = alpha * vec4(color, 1.0f);
}