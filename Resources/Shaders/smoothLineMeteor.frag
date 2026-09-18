#version 300 es

precision highp float;
in highp vec2 v_tex_coord;
in vec4 v_color;

out vec4 FragColor;

uniform float antialiasing_width = -1.5f;

void main() {
    float uv_y = v_tex_coord.y * 2.f - 1.f;
    float profile = 1.f-smoothstep(-1.f + antialiasing_width, 1.f, uv_y);
    FragColor = profile * vec4(v_color.rgb * v_color.a, v_color.a);
}