#version 300 es

precision highp float;
in highp vec2 v_tex_coord;
in vec2 v_uv;
in vec4 v_color;

out vec4 FragColor;

uniform sampler2D u_texture;

float extractRegion(vec3 mask, vec3 image, float threshold) {
    return 1.f - smoothstep(threshold*0.95, threshold*1.05, distance(image, mask));
}

//! v_color holds information about cooldown on the button
void main() {
    vec4 image = texture(u_texture, v_tex_coord);

    float edge_region = extractRegion(vec3(1, 0.462, 0), image.rgb, 0.1f);

    vec2 uv = v_uv - vec2(0.5f);

    float is_on = v_color.r;
    float cooldown_fraction = v_color.a;

    float t = 1.f - cooldown_fraction;
    float pi = 3.141592f;
    float theta = atan(uv.x, -uv.y) + pi;
    float x = (theta) / (2.f * pi);

    float light_region = smoothstep(t, t, x);

    vec4 res = image;
    if(is_on > 0.5f) {
        res = mix(image, 2.f*image, edge_region) ;
    } else {
        res = mix(image * 0.2f, image, light_region);
    }
    
        FragColor = res * image.a;
    

}