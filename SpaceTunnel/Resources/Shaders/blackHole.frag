#version 300 es 

precision highp float;

in vec2 v_tex_coord;
in vec4 v_color;

vec3 u_swirl_color = vec3(1.000f, 0.392f, 0.078f);
vec3 u_edge_color = vec3(0.861f, 0.092f, 0.078f);
uniform float u_time;

out vec4 FragColor;

// Ref - https://x.com/cmzw_/status/1787147460772864188 (celestianmaze)
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
    return mod(((x * 34.0f) + 1.0f) * x, 289.0f);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159f - 0.85373472095314f * r;
}

float snoise(vec3 v) {
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

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(i.z + vec4(0.0f, i1.z, i2.z, 1.0f)) + i.y + vec4(0.0f, i1.y, i2.y, 1.0f)) + i.x + vec4(0.0f, i1.x, i2.x, 1.0f));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857f; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0f * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0f * x_);    // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0f - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0) * 2.0f + 1.0f;
    vec4 s1 = floor(b1) * 2.0f + 1.0f;
    vec4 sh = -step(h, vec4(0.0f));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

//Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

// Mix final noise value
    vec4 m = max(0.6f - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0f);
    m = m * m;
    return 42.0f * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm3d(vec3 x) {
    float v = 0.0f;
    float a = 0.5f;
    vec3 shift = vec3(100);

    for(int i = 0; i < 1; ++i) {
        v += a * snoise(x);
        x = x * 2.0f + shift;
        a *= 0.5f;
    }
    return v;
}

vec3 rotateZ(vec3 v, float angle) {
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);
    return vec3(v.x * cosAngle - v.y * sinAngle, v.x * sinAngle + v.y * cosAngle, v.z);
}

float facture(vec3 vector) {
    vec3 normalizedVector = normalize(vector);
    return max(max(normalizedVector.x, normalizedVector.y), normalizedVector.z);
}

void main() {
    // Normalized pixel coordinates (from 0 to 1) and (from -1 to 1)
    vec2 uv = v_tex_coord * 2.f - 1.f;

    vec3 color = vec3(uv.xy * 2.f, 0.5f);

    color = normalize(color);
    color.z -= 0.2f * u_time;

    float angle = -0.5f * log2(max(length(uv), 0.0001)); // log base 0.5

    color = rotateZ(color, angle + 0.6*u_time);

    float frequency = 1.8f;
    float distortion = 0.41f;
    color.y = fbm3d(vec3(color.xy, -u_time*0.2) * frequency + 1.0f) + distortion;

    color = color.y * u_swirl_color;// + color.z * vec3(0.5059, 0.1333, 0.5333) ;

    vec3 uv_circle = rotateZ(vec3(0.1f * uv.xy, 0.1f * u_time), u_time);
    float circle_radius = 0.23f + 0.01f * sin(u_time * 5.f) ;//+ 0.05f * snoise(uv_circle); // perturb the portal

    float sdf_circle = distance(uv, vec2(0.f)) - circle_radius;
    float circle_edge_region = smoothstep(-0.05f, 0.f, sdf_circle) - smoothstep(0.f, 0.15f, sdf_circle);
    float circle_inside_region = smoothstep(0.f, -0.05f, sdf_circle);

    float sdf_circle_outside = distance(uv, vec2(0.f)) - 0.35f;
    float circle_outside_mask = 1.f - smoothstep(0.05f, 0.55f, sdf_circle_outside);
    
    color = mix(color, u_edge_color * 1.2f, circle_edge_region);
    color = mix(color, vec3(0.f), circle_inside_region);
    color *= 3.5f * circle_outside_mask; 
    // Output to screen
    FragColor = vec4(color, circle_outside_mask);
}