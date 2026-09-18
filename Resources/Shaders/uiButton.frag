#version 300 es

precision highp float;
in highp vec2 v_tex_coord;
in vec2 v_uv;
in vec4 v_color;

out vec4 FragColor;

uniform sampler2D u_texture;

float extractRegion(vec4 mask, vec4 image, float threshold) {
    return 1.f - step(threshold, distance(image, mask));
}

//! v_color holds information about cooldown on the button
void main() {
    vec4 image = texture(u_texture, v_tex_coord);

    float border_region = extractRegion(vec4(0, 1, 0, 1), image, 0.1f);
    float edge_region = extractRegion(vec4(0, 0, 1, 1), image, 0.1f);
    float inside_region = extractRegion(vec4(1, 0, 0, 1), image, 0.1f);
    float inside2_region = extractRegion(vec4(1, 1, 0, 1), image, 0.1f);

    vec2 uv = v_uv - vec2(0.5f);

    float is_on = v_color.r;
    float cooldown_fraction = v_color.a;

    float t = 1.f - v_color.a;
    float pi = 3.141592f;
    float theta = atan(uv.x, -uv.y) + pi;
    float x = (theta) / (2.f * pi);

    float light_region = smoothstep(t, t, x);

    // vec4 res = image;
    //     FragColor = mix(res, vec4(1,0.5,0), ) * image.a;
    // if(is_on > 0.5f) {
    // } else {
    //     FragColor = mix(image * 0.2f, image, light_region) * image.a;
    // }

}