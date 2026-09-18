#version 300 es 

precision highp float;    

uniform float u_fuel_ratio = 1.;
uniform vec3 u_color_1 = vec3(0.62, 0.325, 0.05);
uniform vec3 u_color_edge = vec3(1.,0.,1.);
uniform float u_time = 0.;

uniform sampler2D u_texture;
uniform sampler2D u_noise_texture;

in vec2 v_tex_coord;                          
in vec4 v_color;       

out vec4 FragColor;

float noise(vec2 uv)
{
    return texture(u_noise_texture, uv).r; 
}

void main()                                  
{   

    vec4 texel = texture(u_texture, v_tex_coord);
    float inside_region = smoothstep(0.3,0.7,texel.g);
    float outline_region = smoothstep(0.7,0.8,texel.b);
    float blur_region = smoothstep(0.8,0.9,texel.r);
    

    vec4 res = vec4(0.4471, 0.4471, 0.4471, 1.0) * inside_region * texel.a;
    res += vec4(1.0, 0.0, 0.6667, 1.0) * texel.r ;
    res = mix(res, vec4(1.0, 0.0, 0.502, 1.0), outline_region * texel.a);
    FragColor = vec4(res.rgb * texel.a, texel.a);
    
}                                   


