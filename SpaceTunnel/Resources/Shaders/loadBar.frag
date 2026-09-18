#version 300 es 

precision highp float;

uniform float u_time;

in vec2 v_resolution;
in highp vec2 v_tex_coord;
in vec4 v_fill_color;
in vec4 v_outline_color;
in float v_corner_radius;
in float v_outline_width;
in float v_blur;

out vec4 FragColor;

float sdRoundedBox(vec2 p, vec2 size, float radius) {
    vec2 d = abs(p) - size + radius;
    return length(max(d, 0.0f)) + min(max(d.x, d.y), 0.0f) - radius;
}

void main() {
    float aspect = v_resolution.x / v_resolution.y;
    vec2 uv = vec2((v_tex_coord.x * 2.f - 1.f), (v_tex_coord.y * 2.f - 1.f) / aspect);

    //! skew
    vec2 uv_skew = vec2(
        uv.x - 0.5*uv.y,
        uv.y
    );
    float sdf = sdRoundedBox(uv_skew, vec2(0.9f, 0.8f/aspect), 0.04f);

    float inside_region = smoothstep(-0.015f, -0.02f, sdf*2.);
    float outline_region = smoothstep(-0.025f, -0.02f, sdf*2.) - smoothstep(0.0f, 0.01f, sdf*2.);
    float outside_region = 1.f - inside_region;

    float loaded_percentage = v_blur;
    float loaded_mask = 1.f - smoothstep(loaded_percentage, loaded_percentage + 0.03f, v_tex_coord.x);

    vec4 color1 = vec4(1.0f, 0.0f, 0.98f, 1.0f);
    vec4 color2 =vec4(1.f);// vec4(1.0f, 0.45f, 0.0f, 1.0f);
    vec4 outline_color = 5.f*vec4(0.74f, 0.01f, 1.0f, 1.0f);

    vec2 dir = vec2(1.f, 1.f);
    float x = dot(vec2(uv.x, abs(uv.y)), dir);
    float wave = (sin(x * 45.1f) + 1.f) * 0.5f;
    vec4 res = mix(color1, color2, wave);
    // float dark_region = 1. - smoothstep(0.00f, 0.10f, result_r);
    // vec4 res = mix(color1, color2, dark_region);

    res = mix(vec4(0.f), res, inside_region * loaded_mask);
    res = mix(res, outline_color, outline_region);
    FragColor = res;

}
