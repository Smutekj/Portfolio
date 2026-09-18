#version 300 es 

precision highp float;

in highp vec2 v_tex_coord;
in vec4 v_color;

uniform float u_wave_speed = 5.f;
uniform float u_thickness = 5.f;
uniform float u_antialias_width = 3.f;
uniform vec4 u_color1 = vec4(1.f, 1.f, 1.f, 1.f);
uniform vec4 u_color2 = vec4(0.1f, 0.1f, 0.1f, 1.f);
uniform float u_time;

out vec4 FragColor;

void main() {

    vec2 dir = vec2(1.f, 1.f);

    float x = dot(vec2(v_tex_coord.x, abs(v_tex_coord.y)), dir);
    float wave = (sin(x * 0.5f - u_wave_speed * u_time) + 1.f) * 0.5f;

    float region = smoothstep(-u_thickness - u_antialias_width / 2.f, -u_thickness + u_antialias_width / 2.f, v_tex_coord.y) -
        smoothstep(u_thickness - u_antialias_width / 2.f, u_thickness + u_antialias_width / 2.f, v_tex_coord.y);

    vec4 color = mix(u_color1, u_color2, wave) * region;

    FragColor = vec4(color.rgb * color.a, color.a);
}