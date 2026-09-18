#version 300 es

precision highp float;

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

vec3 hexCoord2(vec2 p, float hexSize)
{
    vec3 q = vec3(p / hexSize, 0.0);
    q.z = -0.5 * q.x - q.y;
    
    float z = -0.5 * q.x - q.y;
    q.y -= 0.5 * q.x;
    
    vec3 i = floor(q+0.5);
    float s = floor(i.x + i.y + i.z);
    vec3 d = abs(i-q);
    
    if( d.x >= d.y && d.x >= d.z ) i.x -= s;
    else if( d.y >= d.x && d.y >= d.z )	i.y -= s;
    else i.z -= s;
    
    vec2 hex_coord = vec2(i.x, ( i.y - i.z + (1.0-mod(i.x, 2.0)) ) / 2.0 );
    vec2 coord = (p - vec2(hex_coord.x, hex_coord.y - 0.5*mod(i.x-1.0, 2.0))*hexSize) / hexSize;
    float dist = length(coord);
    return vec3(coord.xy, dist);
}
vec3 hexCoord(vec2 p, float hexSize)
{
    vec3 q = vec3(p / hexSize, 0.0);
    q.z = -0.5 * q.x - q.y;
    
    float z = -0.5 * q.x - q.y;
    q.y -= 0.5 * q.x;
    
    vec3 i = floor(q+0.5);
    float s = floor(i.x + i.y + i.z);
    vec3 d = abs(i-q);
    
    if( d.x >= d.y && d.x >= d.z ) i.x -= s;
    else if( d.y >= d.x && d.y >= d.z )	i.y -= s;
    else i.z -= s;
    
    vec2 coord = vec2(i.x, ( i.y - i.z + (1.0-mod(i.x, 2.0)) ) / 2.0 );
    float dist = length(p - vec2(coord.x, coord.y - 0.5*mod(i.x-1.0, 2.0))*hexSize) / hexSize;
    return vec3(coord, dist);
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

const vec3 baseGridColor = vec3(0.9, 0.9, 0.9);
const vec3 backgroundColor = vec3(0.1, 0.1, 0.1);
const vec2 waveVectors = vec2(1./100., 1./100.);

in vec2 v_tex_coord;
in vec4 v_color;

out vec4 FragColor;

void main() {
  
    vec2 uv = v_tex_coord;
    // uv.x *= u_resolution.x / u_resolution.y; // aspect ratio

    vec3 hex = hexCoord2(uv*2.f, 0.035);

    FragColor = vec4(vec3(smoothstep(0.1, 1., hex.b)), 0.9);
    // float star_sdf = sdHexagram(hex.xy, 0.2);
    // FragColor = vec4(vec3(smoothstep(-0.05, 0.05, star_sdf)), 0.9);
    //FragColor = vec4(0.);
}