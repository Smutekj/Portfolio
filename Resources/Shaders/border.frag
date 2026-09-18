#version 300 es 

precision highp float;

in highp vec2 v_tex_coord;
in vec4 v_color;

out vec4 FragColor;

uniform float u_wave_speed = 0.f;
uniform float u_wave_length = 2000.f;
uniform float u_thickness = 7.f;
uniform float u_antialias = 8.f;
uniform float u_time;

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

float horizontalLineRegion(vec2 uv, float center_height, float thickness, float antialias) {

    float y_start1 = center_height - thickness / 2.f;
    float y_start2 = center_height - thickness / 2.f + antialias / 2.f;
    float y_end1 = center_height + thickness / 2.f - antialias / 2.f;
    float y_end2 = center_height + thickness / 2.f;
    return smoothstep(y_start1, y_start2, uv.y) - smoothstep(y_end1, y_end2, uv.y);
}

void main() {
    float border_wave = 0.5f * sin((v_tex_coord.x - u_time * u_wave_speed) / u_wave_length * 2.f * 3.141592f) + 0.5f;

    vec3 wave_color = v_color.rgb;
    vec3 complementary_color = complementary(wave_color);

    vec3 color = vec3(0.f);
    float region = horizontalLineRegion(v_tex_coord, 0.f, u_thickness*2.f-1.f, u_antialias);

    float wave_shape = smoothstep(0.25f, 0.75f, border_wave);
    color = mix(complementary_color, wave_color, wave_shape);

    FragColor = vec4(color * region, region);
}