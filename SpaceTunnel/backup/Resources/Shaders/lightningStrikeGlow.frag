#version 300 es 

precision highp float;

in vec2 v_tex_coord;
in vec4 v_color;

uniform vec3 u_base_color = vec3(1.0, 0.53, 0.0);
uniform float u_time;

out vec4 FragColor;

void main() {

    float y_dist = (1.-abs(v_tex_coord.y*v_tex_coord.y));
    FragColor = vec4(u_base_color * y_dist, y_dist);
}