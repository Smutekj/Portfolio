#version 300 es 

precision highp float;   

layout(location = 0) in vec2 a_position; 
layout(location = 1) in vec2 a_tex_pos; 

//! instance attributes
layout(location = 2) in vec2 a_translation; 
layout(location = 3) in vec2 a_scale;
layout(location = 4) in float a_angle; 
layout(location = 5) in vec2 a_tex_coord;
layout(location = 6) in vec2 a_tex_dim;
layout(location = 7) in vec4 a_color;
layout(location = 8) in float a_time;
layout(location = 9) in float a_duration;
layout(location = 10) in float a_brightness;
layout(location = 11) in float a_depth;

out highp vec2 v_tex_coord;      
out vec2 v_resolution;
out vec4 v_color;      
out float v_time;      
out float v_duration;      
out float v_brightness;      

uniform mat4 u_view_projection;

void main()                                   
{                                     

    vec2 scaled_pos = a_scale * a_position; 
    vec2 transformed_pos = vec2(cos(a_angle)*scaled_pos.x - sin(a_angle) * scaled_pos.y,
                                 sin(a_angle)*scaled_pos.x + cos(a_angle) * scaled_pos.y);

    gl_Position = u_view_projection*vec4(transformed_pos + a_translation, 0., 1.0);    
    
    v_tex_coord = vec2(a_tex_coord.x + a_tex_dim.x*a_tex_pos.x, a_tex_coord.y + a_tex_dim.y*a_tex_pos.y) ;
    v_color     = a_color;      
    v_resolution= a_scale * 2.;      
    v_time =  a_time;      
    v_duration = a_duration;
    v_brightness = a_brightness;      
}                                             