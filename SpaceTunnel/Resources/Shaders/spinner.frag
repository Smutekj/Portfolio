#version 300 es 

precision highp float;

in highp vec2 v_tex_coord;
in vec4 v_color;

vec3 u_swirl_color = vec3(1.000f, 0.392f, 0.078f);
vec3 u_edge_color = vec3(0.95f, 0.95f, 0.05f);

uniform int u_field_count = 5;
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

float smoothFloor(float val, float smoothing_factor) {
    float prev_val = floor(val  - smoothing_factor/2.);
    float next_val = floor(val + smoothing_factor/2.);
    float weight = mod(val/smoothing_factor-0.5, smoothing_factor);

    return weight*prev_val + (1. - weight)*next_val;
}

out vec4 FragColor;

void main() {
    // Normalized pixel coordinates (from 0 to 1) and (from -1 to 1)
    vec2 uv = v_tex_coord * 2.f - 1.f;
    float radius = length(uv);
    const float pi = 3.141592f;
    float angle = atan(uv.y, uv.x) + pi;
    float delta_angle = 2.f * pi / float(u_field_count);

    float circle_region = 1.f - smoothstep(0.9f, 1.f, radius);
    float center_region = 1.f - smoothstep(0.2f, 0.25f, radius);

    vec3 result = u_swirl_color;

    float region_x = smoothFloor(angle / delta_angle, 0.05) / float(u_field_count);

    vec3 region_color = rgb2hsv(vec3(1.f, 0.f, 0.f));
    region_color.r = region_x;
    region_color = hsv2rgb(region_color);
    result = region_color;

    result = mix(result, vec3(0.2f, 0.2f, 0.2f), center_region);

    FragColor = circle_region * vec4(result, 1.f);
}