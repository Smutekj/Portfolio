#version 300 es 

precision highp float;    

in vec2 v_tex_coord;                          
in vec4 v_color;       

uniform float u_time;

uniform sampler2D u_texture;

out vec4 FragColor;
void main()
{

    float circle_sdf = distance(v_tex_coord, vec2(0.5));
    float shape_factor = 1.-smoothstep(0.2, 0.5, circle_sdf);

    FragColor = shape_factor * v_color;
}                                          