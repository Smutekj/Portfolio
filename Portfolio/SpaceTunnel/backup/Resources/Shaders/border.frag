#version 300 es 

precision highp float;

in vec2 v_tex_coord;
in vec4 v_color;

uniform float u_wave_speed = 20000.f;
uniform float u_wave_length = 50.f;
uniform float u_time;

out vec4 FragColor;

void main() {
    float border_wave =  0.5f * sin((v_tex_coord.x - u_time * 20.f) / u_wave_length * 2.f * 3.141592f) + 0.5f;

    vec3 wave_color = v_color.rgb;
    vec3 base_color =  wave_color ;
    
    vec3 color = vec3(0.f);
    float border_region_up = smoothstep(-4.f, -7.f, v_tex_coord.y);
    float border_region_down = smoothstep(4.f, 7.f, v_tex_coord.y);
    float border_region = border_region_down + border_region_up;
    color = mix(color, base_color, border_region);

    float wave_shape = smoothstep(0.1f, 0.9f, border_wave) * border_region;
    color = mix(color, wave_color, wave_shape);
    // color += wave_shape * u_wave_color; 

    FragColor = vec4(color, border_region);
}