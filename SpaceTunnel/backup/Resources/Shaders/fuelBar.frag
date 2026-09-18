#version 300 es 

precision highp float;    

uniform float u_fuel_ratio = 1.;
uniform vec2 u_bar_min_uv = vec2(0,0);
uniform vec2 u_bar_size_uv = vec2(1,1) 
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
    float outline_region = smoothstep(0.3,0.7,texel.b);
    float blur_region = smoothstep(0.3,0.7,texel.r);

	vec2 st = (v_tex_coord - u_bar_min_uv)/u_bar_size_uv;

    vec2 uv1 = st;
    vec2 uv2 = st;
    vec2 uv3 = st;
    
    float t = u_time * 0.369;

    vec2 scroll_speed1 = vec2(0.25, 0.);
    vec2 scroll_speed2 = vec2(0.3, 0.05);
    vec2 scroll_speed3 = vec2(0.35, -0.13);

    uv1 = v_tex_coord / vec2(0.7, 0.8);
    uv2 = v_tex_coord / vec2(0.5, 1.0);
    uv3 = v_tex_coord / vec2(1.2, 0.69);
    
    uv1 = uv1 - t * scroll_speed1;
    uv2 = uv2 - t * scroll_speed2;
    uv3 = uv3 - t * scroll_speed2;

    float result_r = noise(uv1) * noise(uv3);
    

	float min_uv = 25. /220.;
	float max_uv = 195. /220.;
    float alpha = 1.-smoothstep(u_fuel_ratio, u_fuel_ratio + 0.03, (1.-st.x - min_uv) / (max_uv - min_uv));
    vec4 res = alpha * vec4(2.*result_r * u_color_1,  1.0);


    res = mix(vec4(0.), res, inside_region*alpha);
    res += vec4(1.0, 0.5333, 0.0, 1.0) * texel.r * texel.a;
    res = mix(res, vec4(1.0, 0.7333, 0.0, 1.0), outline_region * texel.a);
    FragColor = vec4(res.rgb * texel.a, texel.a );
    
}                                   


