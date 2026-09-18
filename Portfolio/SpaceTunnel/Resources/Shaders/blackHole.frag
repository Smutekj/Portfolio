#version 300 es 

precision highp float;

in highp vec2 v_tex_coord;
in vec4 v_color;

vec3 u_swirl_color = vec3(1.000f, 0.392f, 0.078f);
vec3 u_edge_color = vec3(0.95f, 0.95f, 0.05f);
uniform float u_time;

out vec4 FragColor;

// Ref - https://x.com/cmzw_/status/1787147460772864188 (celestianmaze)
vec3 mod289(vec3 x) {
    return x - floor(x * (1.0f / 289.0f)) * 289.0f;
}
vec4 mod289(vec4 x) {
    return x - floor(x * (1.0f / 289.0f)) * 289.0f;
}
vec4 permute(vec4 x) {
    return mod(((x * 34.0f) + 1.0f) * x, 289.0f);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159f - 0.85373472095314f * r;
}

vec3 rotateZ(vec3 v, float angle) {
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);
    return vec3(v.x * cosAngle - v.y * sinAngle, v.x * sinAngle + v.y * cosAngle, v.z);
}

float hash( vec2 a )
{
    return fract( sin(  dot( a, vec2( 3433.8, 3843.98) ) ) * 45933.8 );
}
float hash( vec3 a )
{
    return fract( sin(  dot( a, vec3( 3433.8, 3843.98, 125.15) ) ) * 45933.8 );
}

// Succint version by Fabrice
float snoise( vec2 U )
{
    vec2 id = floor( U );
          U = fract( U );
    U *= U * ( 3. - 2. * U );  
    
    vec2 A = vec2( hash(id)            , hash(id + vec2(0,1)) ),  
         B = vec2( hash(id + vec2(1,0)), hash(id + vec2(1,1)) ),  
         C = mix( A, B, U.x);
    
    return mix( C.x, C.y, U.y );
}

float noise3(vec3 P)
{
    vec3 i = floor(P);
    vec3 f = fract(P);

    f = f*f*(3.0-2.0*f);

    return mix(
        mix(
            mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
            mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x),
            f.y
        ),
        mix(
            mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
            mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x),
            f.y
        ),
        f.z
    );
}



void main() {
    // Normalized pixel coordinates (from 0 to 1) and (from -1 to 1)
    vec2 uv = v_tex_coord * 2.f - 1.f;
    float radius_sq = dot(uv, uv);

    vec3 uv3 = vec3(uv * 2.f, 0.5f) * 0.66f;

    float angle = -0.5f * (1.f + 1.f / (radius_sq + 0.05f)); //! make it swirly 
    uv3 = rotateZ(uv3, angle + 0.6f * u_time);

    float frequency = 5.3f;
    float distortion = -0.11f;
    float noise = noise3(vec3(uv3.xy, u_time*0.005f) * frequency + 1.0f) + distortion;

    vec3 color = noise * u_swirl_color;

    float circle_radius = 0.23f;
    float sdf_circle = radius_sq - circle_radius * circle_radius;
    float circle_edge_region = smoothstep(-0.05f * 0.05f, 0.f, sdf_circle) - smoothstep(0.f, 0.15f * 0.15f, sdf_circle);
    float circle_inside_region = smoothstep(0.f, -0.05f * 0.05f, sdf_circle);

    float sdf_circle_outside = radius_sq - 0.35f*0.35f;
    float circle_outside_mask = 1.f - smoothstep(0.05f*0.05f, 0.55f*0.55f, sdf_circle_outside);

    color = mix(color, u_edge_color, circle_edge_region);
    color = mix(color, vec3(0.f), circle_inside_region);
    color *= 1.5f * circle_outside_mask; 
    // Output to screen
    FragColor = vec4(color*circle_outside_mask, circle_outside_mask);
}