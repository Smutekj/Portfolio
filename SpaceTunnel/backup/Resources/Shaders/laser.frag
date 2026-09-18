#version 300 es 

precision highp float;

in vec2 v_tex_coord;
in vec4 v_color;

out vec4 FragColor;

void main() {
    vec2 uv = vec2(v_tex_coord.x, (v_tex_coord.y - 0.5) * 2.);
    float outer_edge = smoothstep(-0.75, -0.85, uv.y) + smoothstep(0.75, 0.85, uv.y);
    float left_edge = smoothstep(-0.8, -0.7, uv.y) - smoothstep(-0.5, -0.0, uv.y);
    float right_edge = smoothstep(0.0, 0.5, uv.y) - smoothstep(0.7, 0.8, uv.y);
    float edges = left_edge + right_edge;
    
    vec3 color = mix(vec3(0.), vec3(6., 0., 0.), edges);
    color = mix(color, vec3(2.,2.,1.) ,outer_edge);
    float alpha = mix(0.3, 1., edges);
    FragColor = vec4(color,alpha); 
}