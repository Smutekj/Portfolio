#version 300 es 

precision highp float;    
                 
in highp vec2 v_tex_coord;
in vec4 v_color;
in float v_time;
in float v_brightness;

out vec4 FragColor;

const int lightning_number = 2;
const vec2 u_amplitude = vec2(40.0,1.);
const float u_scale_x = 2.5;
const float u_thickness = 0.03;
const float u_speed = 3.0;
const float u_glow_thickness = 0.04;
const vec4 u_glow_color = vec4(0.0, 1.0, 0.2, 1.0);
const float u_amplitude_decay = 0.5;

// plot function 
float plotglow(vec2 st, float pct, float half_width, float glow_half_width){
  float top =  smoothstep( pct-half_width - glow_half_width, pct - half_width, st.y) -
                smoothstep( pct- half_width, pct - half_width + glow_half_width, st.y);
  float bot =  smoothstep( pct + half_width - glow_half_width, pct + half_width, st.y) -
                smoothstep( pct + half_width, pct+half_width + glow_half_width, st.y);
    return top + bot;
}

float plot(vec2 st, float pct, float half_width){
  return  smoothstep( pct-half_width, pct, st.y) -
          smoothstep( pct, pct+half_width, st.y);
}

vec2 hash22(vec2 uv) {
    uv = vec2(dot(uv, vec2(127.1,311.7)),
              dot(uv, vec2(269.5,183.3)));
    return 2.0 * fract(sin(uv) * 45.5453123) - 1.0;
}

float noise(vec2 uv) {
    vec2 iuv = floor(uv);
    vec2 fuv = fract(uv);
    vec2 blur = smoothstep(0.0, 1.0, fuv);
    return mix(mix(dot(hash22(iuv + vec2(0.0,0.0)), fuv - vec2(0.0,0.0)),
                   dot(hash22(iuv + vec2(1.0,0.0)), fuv - vec2(1.0,0.0)), blur.x),
               mix(dot(hash22(iuv + vec2(0.0,1.0)), fuv - vec2(0.0,1.0)),
                   dot(hash22(iuv + vec2(1.0,1.0)), fuv - vec2(1.0,1.0)), blur.x), blur.y) + 0.5;
}

float fbm(vec2 n) {
    // return texture(u_noise_texture, n).a;
    float total = 0.0, amp = 1.0;
    for (int i = 0; i < 1; i++) {
        total += noise(n) * amp;
        n += n;
        amp *= u_amplitude_decay;
    }
    return total;
}

vec2 rotate(vec2 in_vec, float angle)
{
    vec2 result = vec2(in_vec.x*sin(angle) + in_vec.y*cos(angle), -in_vec.x * cos(angle) + in_vec.y * sin(angle));
    return result;
}

void main()                                  
{          

   	vec2 uv = vec2(v_tex_coord.x/u_scale_x, v_tex_coord.y);
	
    vec4 color = vec4(0.);
	vec2 t;
	float y;
	float pct;
	float buff;	
	// add more lightning
	for ( int i = 0; i < lightning_number/2; i++){
		t = uv*u_amplitude  + (vec2(float(i), -float(i)) - v_time*u_speed);
		y = fbm(t);
		pct = plot(uv, y, u_thickness);
		buff = plotglow(uv, y, u_thickness, u_glow_thickness);
		color += pct*v_color;
		color += buff*u_glow_color;
	}
    // other direction
	for ( int i = 0; i < lightning_number/2; i++){
		t = uv*u_amplitude  + (vec2(float(i), float(i)) + v_time*u_speed);
		y = fbm(t);
		pct = plot(uv, y, u_thickness);
		buff = plotglow(uv, y, u_thickness,  u_glow_thickness);
		color += pct*v_color;
		color += buff*u_glow_color;
	}
	
	FragColor = vec4(v_brightness*color.rgb, v_color.a);
}
