#version 300 es 

precision highp float;   

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

// A standard gaussian function, used for weighting samples
float gaussian(float x, float sigma) {
  const float pi = 3.141592653589793;
  return exp(-(x * x) / (2.0 * sigma * sigma)) / (sqrt(2.0 * pi) * sigma);
}

// This approximates the error function, needed for the gaussian integral
vec2 erf(vec2 x) {
  vec2 s = sign(x), a = abs(x);
  x = 1.0 + (0.278393 + (0.230389 + 0.078108 * (a * a)) * a) * a;
  x *= x;
  return s - s / (x * x);
}

// Return the blurred mask along the x dimension
float roundedBoxShadowX(float x, float y, float sigma, float corner, vec2 halfSize) {
  float delta = min(halfSize.y - corner - abs(y), 0.0);
  float curved = halfSize.x - corner + sqrt(max(0.0, corner * corner - delta * delta));
  vec2 integral = 0.5 + 0.5 * erf((x + vec2(-curved, curved)) * (sqrt(0.5) / sigma));
  return integral.y - integral.x;
}

// Return the mask for the shadow of a box from lower to upper
float roundedBoxShadow(vec2 lower, vec2 upper, vec2 point, float sigma, float corner) {
  // Center everything to make the math easier
  vec2 center = (lower + upper) * 0.5;
  vec2 halfSize = (upper - lower) * 0.5;
  point -= center;

  // The signal is only non-zero in a limited range, so don't waste samples
  float low = point.y - halfSize.y;
  float high = point.y + halfSize.y;
  float start = clamp(-3.0 * sigma, low, high);
  float end = clamp(3.0 * sigma, low, high);

  // Accumulate samples (we can get away with surprisingly few samples)
  float step = (end - start) / 4.0;
  float y = start + step * 0.5;
  float value = 0.0;
  for (int i = 0; i < 4; i++) {
    value += roundedBoxShadowX(point.x, point.y - y, sigma, corner, halfSize) * gaussian(y, sigma) * step;
    y += step;
  }

  return value;
}


out vec4 FragColor;

void main()
{
    
    float aspect = v_resolution.x / v_resolution.y;
    float v_blur_uv = v_blur;
    vec2 size_uv = vec2(1.*aspect, 1.)  ;
    vec2 uv = vec2(
        (v_tex_coord.x * 2. - 1.)*aspect,
        v_tex_coord.y*2. - 1.
    );

    // float sdf = sdRoundedBox(uv, size_uv, v_corner_radius);
    float shape = roundedBoxShadow(-size_uv/2., size_uv/2., uv, v_blur_uv + 0.0001, v_corner_radius);
    // float sdf = sdSquircle(uv, 0.6*size_uv, v);
    // shape = smoothstep(0.8, 0.9, shape);
    // float outline= smoothstep(0.0, 0.3, shape) - smoothstep(0.7, 0.8, shape);
    // float shape2 = 1.0 - smoothstep(-v_blur_uv, v_blur_uv, sdf);
    // float outline = smoothstep(v_blur_uv, -v_blur_uv, sdf) 
    //               - smoothstep(v_blur_uv, -v_blur_uv, sdf + 0.*v_outline_width);
    
    vec4 result = vec4(3.*v_fill_color.rgb * v_fill_color.a * shape, shape * v_fill_color.a);
    // result = mix(result, v_outline_color, outline);
    
    FragColor = result;
}