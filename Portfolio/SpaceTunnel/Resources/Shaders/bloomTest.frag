#version 300 es
precision highp float;

in highp vec2 v_tex_coord;

out vec4 FragColor;

uniform sampler2D u_texture;
uniform vec2 u_src_resolution;
uniform float u_threshold;


void main(){
    vec2 halfTexel = vec2(0.5 / u_src_resolution.x, 0.5 / u_src_resolution.y);

    // sample at 4 points offset by half a texel
    // hardware bilinear does a 2x2 average for free at each tap
    // so this is effectively a 4x4 = 16 pixel average with only 4 taps
    //vec4 center = texture(u_texture, v_tex_coord + vec2(-halfTexel.x,  halfTexel.y));
    vec4 a = texture(u_texture, v_tex_coord + vec2(-halfTexel.x,  halfTexel.y));
    vec4 b = texture(u_texture, v_tex_coord + vec2( halfTexel.x,  halfTexel.y));
    vec4 c = texture(u_texture, v_tex_coord + vec2(-halfTexel.x, -halfTexel.y));
    vec4 d = texture(u_texture, v_tex_coord + vec2( halfTexel.x, -halfTexel.y));

    vec4 avg = (a + b + c + d) / 4.;

    // brightness threshold
    float brightness = dot(avg.rgb, vec3(0.2126, 0.7152, 0.0722));
    float soft = brightness - u_threshold;
    soft = clamp(soft, 0.0, 1.0);
    soft = (soft * soft) / (2.0 * u_threshold + 0.0001);
    float contribution = max(soft, brightness - u_threshold) / max(brightness, 0.0001);
    FragColor = vec4(avg.rgb , avg.a);
}
