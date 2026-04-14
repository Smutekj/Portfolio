#version 300 es 

precision highp float;    

in vec2 v_tex_coord;                          
in vec2 v_resolution;                          
in vec4 v_color;       

out vec4 FragColor;

uniform sampler2D u_texture;

void main(void) {
	
    vec4 texel = texture(u_texture, v_tex_coord);
    float inside_region = smoothstep(0.3,0.7,texel.g);
    float outline_region = smoothstep(0.3,0.7,texel.b);
    float blur_region = smoothstep(0.3,0.7,texel.r);

	vec3 grad_color1 = vec3(0.1, 0.1, 0.1);
	vec3 grad_color2 = vec3(0.3, 0.3, 0.3);
	float center_dist = distance(vec2(0.5), v_tex_coord);
	float gradient_mask = smoothstep(0.1, 0.4, center_dist);
	vec3 inside_color = mix(grad_color1, grad_color2, gradient_mask);

	vec3 color = vec3(1,1,1)* outline_region;
	color += v_color.rgb * texel.r * texel.a;
	color = mix(color, inside_color, inside_region);
	FragColor = vec4(color * texel.a, texel.a);
}