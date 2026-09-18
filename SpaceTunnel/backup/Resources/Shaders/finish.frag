#version 300 es

precision mediump float;

uniform vec2 u_resolution;
uniform vec3 u_primaryColor;
uniform float u_time;


float rand( float n )
{
    return fract(cos(n)*41415.92653);
}

float noise(vec2 p)
{
    vec2 f  = smoothstep(0.0, 1.0, fract(p));
    p  = floor(p);
    float n = p.x + p.y*57.0;
    return mix(mix(rand(n+0.0), rand(n+1.0),f.x), mix( rand(n+57.0), rand(n+58.0),f.x),f.y);
}

float fbm( vec2 p )
{
    mat2 m2 = mat2(1.6,-1.2,1.2,1.6);	
    float f = 0.5000*noise( p ); p = m2*p;
    f += 0.2500*noise( p ); p = m2*p;
    f += 0.1666*noise( p ); p = m2*p;
    f += 0.0834*noise( p );
    return f;
}

float rand12(vec2 co)
{
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rand21(float p)
{
    return fract(vec2(sin(p * 591.32), cos(p * 391.32)));
}

//      Simplex noise stolen from:
//      Author : Ian McEwan, Ashima Arts.
//      https://github.com/stegu/webgl-noise
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x);}

vec2 rotate(vec2 p, float a)
{
    return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
}


//! stolen from: https://iquilezles.org/articles/distfunctions2d/
float sdHexagram( in vec2 p, in float r )
{
    const vec4 k = vec4(-0.5,0.8660254038,0.5773502692,1.7320508076);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= 2.0*min(dot(k.yx,p),0.0)*k.yx;
    p -= vec2(clamp(p.x,r*k.z,r*k.w),r);
    return length(p)*sign(p.y);
}

//! stolen from: https://iquilezles.org/articles/distfunctions2d/
float sdStar( in vec2 p, in float r, in int n, in float m)
{
    // next 4 lines can be precomputed for a given shape
    float an = 3.141593/float(n);
    float en = 3.141593/m;  // m is between 2 and n
    vec2  acs = vec2(cos(an),sin(an));
    vec2  ecs = vec2(cos(en),sin(en)); // ecs=vec2(0,1) for regular polygon

    float bn = mod(atan(p.x,p.y),2.0*an) - an;
    p = length(p)*vec2(cos(bn),abs(sin(bn)));
    p -= r*acs;
    p += ecs*clamp( -dot(p,ecs), 0.0, r*acs.y/ecs.y);
    return length(p)*sign(p.x);
}

in vec2 v_tex_coord;
in vec4 v_color;

out vec4 FragColor;

void main() {
  
    vec2 uv = v_tex_coord;
    // uv.x *= u_resolution.x / u_resolution.y; // aspect ratio


    vec2 uv_periodic = mod(uv, 50.);
    vec2 grid = floor(uv/50.f);

    float sdf_star = sdStar(uv_periodic, 20., 6, 10.); 
    float star_shape = 1.-smoothstep(-0.5, 0.5, sdf_star);

    FragColor = vec4(vec3(star_shape), star_shape);
}