#version 300 es 

precision highp float;    

uniform float u_time;
uniform sampler2D u_noise_texture;

in vec2 v_resolution;
in vec2 v_tex_coord;                          
in vec4 v_color;       

out vec4 FragColor;


float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}


void main() {
    float aspect = v_resolution.x / v_resolution.y;
    vec2 st = vec2(v_tex_coord.x *aspect, v_tex_coord.y ) *3.;
    // st += st * abs(sin(u_time*0.1)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    float f = fbm(st+r);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,1.0));

    FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}

// void main()                                  
// {   

//     vec2 uv1 = v_tex_coord / vec2(0.7, 0.08);
//     vec2 uv2 = v_tex_coord / vec2(0.5, 1.0);
//     vec2 uv3 = v_tex_coord / vec2(1.2, 0.69);
    
//     float t = u_time * 0.369;

//     // vec2 scroll_speed1 = vec2(-0.001*sin(9.959*t), 0.3 + 0.*v_tex_coord.y * 0.2);
//     // vec2 scroll_speed2 = vec2(0.05, 0.5);
//     // vec2 scroll_speed3 = vec2(-0.03, 0.35);

//     // uv1 = v_tex_coord / vec2(0.7, 0.8);
//     // uv2 = v_tex_coord / vec2(0.5, 1.0);
//     // uv3 = v_tex_coord / vec2(1.2, 0.69);
    
//     // uv1 = uv1 - t * scroll_speed1;
//     // uv2 = uv2 - t * scroll_speed2;
//     // uv3 = uv3 - t * scroll_speed3;

//     // float result_r = noise(uv2) * noise(uv3);
//     // float result_l = noise(uv1) * noise(uv2);
    
//     // vec4 res = vec4(0.);
//     // res = res + vec4(result_r*vec3(0.5, 0.7, 0.),  0.);
//     // res = res + vec4(vec3(result_r*10., result_l*0.3, 0.),  1.);
//     vec3 color = vec3(fbm(uv1*2.)); 
//     FragColor = vec4(color, 1.);
// }                                   


