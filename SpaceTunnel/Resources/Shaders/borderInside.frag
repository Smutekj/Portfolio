#version 300 es 

precision highp float;    
                 
in vec2 v_tex_coord;                          
in vec4 v_color;       

uniform float wave_speed = 5.;
uniform float u_time;

out vec4 FragColor;

void main()                                  
{            
    vec2 dir = vec2(1., 1.);
    float x = dot(vec2(v_tex_coord.x, abs(v_tex_coord.y)),  dir);
    float wave = (sin(x*0.5 -wave_speed * u_time) + 1.)/2.;
    vec4 color = mix(v_color, vec4(0.1, 0.1, 0.1, 1.), wave);
    
    FragColor = vec4(color.rgb * color.a, color.a); 
}                                            