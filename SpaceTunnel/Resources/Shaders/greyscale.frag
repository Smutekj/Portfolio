#version 300 es

precision highp float;                     
in highp vec2 v_tex_coord;
in vec4 v_color;                          

out vec4 FragColor;

uniform sampler2D u_texture;

void main()                                  
{                                            
    vec4 color = v_color *  texture(u_texture, v_tex_coord);
    float alpha = color.a * v_color.a;
    float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    FragColor = vec4(vec3(brightness) * alpha, alpha); 
}                                            