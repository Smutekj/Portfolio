#version 300 es 

precision highp float;

uniform float u_time;

in vec2 v_tex_coord;
in vec2 v_resolution;
in vec4 v_color;

out vec4 FragColor;

const float speed = 10.f;
const float arrows_angle = 3.f;

void main() {
    vec2 uv = vec2(v_tex_coord.x, (v_tex_coord.y - 0.5f) * 2.f);
    float outer_edge = smoothstep(-0.75f, -0.85f, uv.y) + smoothstep(0.75f, 0.85f, uv.y);
    float edges = outer_edge;

    float mask = mod(v_tex_coord.x - u_time*speed * 5. / v_resolution.x, 1./5.0f);
    mask = smoothstep(1./10.f, 1.f/10.f, mask);

    float y_phase = abs(v_tex_coord.y - 0.5f) * 2.f;
    float wave_uv = v_tex_coord.x * v_resolution.x / 5.f + y_phase*arrows_angle - speed * u_time;
    float wave = (sin(wave_uv) + 1.f) / 2.f;
    vec4 color2 = mix(v_color, vec4(0.3f, 0.3f, 0.3f, 0.1f), wave);
    // color2 = mix(color, vec3(0.f), border_region_up);
    color2 = mix(color2, vec4(1.0, 0.0, 0.0, 0.1), edges);
    FragColor = color2;
}