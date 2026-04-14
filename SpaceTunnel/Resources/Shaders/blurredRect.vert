#version 300 es 

precision highp float;   

layout(location = 0) in vec2 a_position; 
layout(location = 1) in vec2 a_tex_pos; 

//! instance attributes
layout(location = 2) in vec2 a_translation; 
layout(location = 3) in vec2 a_scale;
layout(location = 4) in float a_angle; 
layout(location = 5) in vec4 a_fill_color;
layout(location = 6) in vec4 a_outline_color;
layout(location = 7) in float a_corner_radius;
layout(location = 8) in float a_outline_width;
layout(location = 9) in float a_blur;

out vec2 v_resolution;
out vec2 v_tex_coord;      
out vec4 v_fill_color;
out vec4 v_outline_color;
out float v_corner_radius;
out float v_outline_width;
out float v_blur;

uniform mat4 u_view_projection;

void main()                                   
{                                     

    vec2 scaled_pos = a_scale * a_position ; 
    vec2 transformed_pos = vec2(cos(a_angle)*scaled_pos.x - sin(a_angle) * scaled_pos.y,
                                 sin(a_angle)*scaled_pos.x + cos(a_angle) * scaled_pos.y);

    gl_Position = u_view_projection*vec4(transformed_pos + a_translation, 0., 1.0);    
    
    v_resolution= a_scale * 2.;      
    v_tex_coord = a_tex_pos;

    v_fill_color = a_fill_color;
    v_outline_color = a_outline_color;
    v_corner_radius = a_corner_radius;
    v_outline_width= a_outline_width;
    v_blur = a_blur;
}                                             