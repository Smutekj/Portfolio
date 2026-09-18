#version 300 es

precision highp float;
in vec2 v_tex_coord;
in vec4 v_color;

out vec4 FragColor;

uniform sampler2D u_texture;

void main() {
    vec4 color = texture(u_texture, v_tex_coord);
    FragColor = vec4(color.rgb * color.a, color.a);
}