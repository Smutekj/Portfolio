#version 300 es 

precision highp float;

in vec2 v_resolution;
in highp vec2 v_tex_coord;
in vec4 v_fill_color;
in vec4 v_outline_color;
in float v_corner_radius;
in float v_outline_width;
in float v_blur;

float sdRoundedBox(vec2 p, vec2 size, float radius) {
    vec2 d = abs(p) - size + radius;
    return length(max(d, 0.0f)) + min(max(d.x, d.y), 0.0f) - radius;
}

out vec4 FragColor;

void main() {
    vec2 uv = vec2((v_tex_coord.x * 2.f - 1.f), (v_tex_coord.y * 2.f - 1.f));
    vec2 uv_world = vec2(uv.x * v_resolution.x / 2.f, uv.y * v_resolution.y / 2.f);
    //! skew
    uv_world = vec2( uv_world.x - 0.3*uv_world.y, uv_world.y);
    vec2 size_world = 0.9*v_resolution / 2.f ;

    // float sdf = sdRoundedBox(uv_sq, size_uv, vec2(v_corner_radius, v_corner_radius/aspect));
    float sdf = sdRoundedBox(uv_world, size_world, v_corner_radius * v_resolution.y);
    float shape = 1.f - smoothstep(-v_outline_width, -v_outline_width*0.5f, sdf);
    float outline = smoothstep(-v_outline_width, -v_outline_width * 0.5f, sdf) - smoothstep(-v_outline_width * 0.5f, 0.0f, sdf);

    vec4 result = vec4(v_fill_color.rgb * v_fill_color.a * shape, v_fill_color.a * shape);
    result = mix(result, v_outline_color, outline);

    FragColor = result;
}
