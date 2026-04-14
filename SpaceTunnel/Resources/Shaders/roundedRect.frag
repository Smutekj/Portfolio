#version 300 es 

precision highp float;   

uniform float u_time;

in vec2 v_resolution;
in vec2 v_tex_coord;      
in vec4 v_fill_color;
in vec4 v_outline_color;
in float v_corner_radius;
in float v_outline_width;
in float v_blur;


float sdRoundedBox(vec2 p, vec2 size, float radius)
{
    vec2 d = abs(p) - size + radius;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}

out vec4 FragColor;

void main()
{
    
    float aspect = v_resolution.x / v_resolution.y;
    float v_blur_uv = v_blur;
    vec2 size_uv = vec2(1., 1./aspect)  ;
    vec2 uv = vec2(
        (v_tex_coord.x * 2. - 1.),
        (v_tex_coord.y*2. - 1.) / aspect
    );

    float sdf = sdRoundedBox(uv, 0.9*size_uv, 0.2);
    float shape = 1.-smoothstep(-0.05, 0.0, sdf);
    float outline= smoothstep(-0.08, -0.06, sdf) - smoothstep(-0.04, 0.0, sdf);
    // float outline = smoothstep(v_blur_uv, -v_blur_uv, sdf) 
    //               - smoothstep(v_blur_uv, -v_blur_uv, sdf + 0.*v_outline_width);
    
    vec4 result = vec4(v_fill_color.rgb * v_fill_color.a * shape, shape * v_fill_color.a);
    result = mix(result, 7.*v_outline_color, outline);
    
    FragColor = result;
}