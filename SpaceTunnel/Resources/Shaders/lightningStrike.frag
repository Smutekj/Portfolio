#version 300 es 

precision highp float;

in vec2 v_tex_coord;
in vec4 v_color;

uniform float u_time;

out vec4 FragColor;

void main() {

    float region = smoothstep(-0.15, -0.1, v_tex_coord.y) - smoothstep(0.1, 0.15, v_tex_coord.y);
    FragColor = vec4(v_color.rgb * v_color.a * region, v_color.a * region);
}