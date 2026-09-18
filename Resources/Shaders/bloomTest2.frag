#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_src_resolution;
in highp vec2 v_tex_coord;
in vec4 v_color;
out vec4 FragColor;
void main(){
  vec2 srcTexelSize = vec2(1.0 / u_src_resolution.x, 1.0 / u_src_resolution.y);
  float x = srcTexelSize.x;
  float y = srcTexelSize.y;

  vec4 a = texture(u_texture, vec2(v_tex_coord.x - 2.*x, v_tex_coord.y + 2.*y));
  vec4 b = texture(u_texture, vec2(v_tex_coord.x,       v_tex_coord.y + 2.*y));
  vec4 c = texture(u_texture, vec2(v_tex_coord.x + 2.*x, v_tex_coord.y + 2.*y));

  vec4 d = texture(u_texture, vec2(v_tex_coord.x - 2.*x, v_tex_coord.y));
  vec4 e = texture(u_texture, vec2(v_tex_coord.x,       v_tex_coord.y));
  vec4 f = texture(u_texture, vec2(v_tex_coord.x + 2.*x, v_tex_coord.y));

  vec4 g = texture(u_texture, vec2(v_tex_coord.x - 2.*x, v_tex_coord.y - 2.*y));
  vec4 h = texture(u_texture, vec2(v_tex_coord.x,       v_tex_coord.y - 2.*y));
  vec4 i = texture(u_texture, vec2(v_tex_coord.x + 2.*x, v_tex_coord.y - 2.*y));

  vec4 j = texture(u_texture, vec2(v_tex_coord.x - x, v_tex_coord.y + y));
  vec4 k = texture(u_texture, vec2(v_tex_coord.x + x, v_tex_coord.y + y));
  vec4 l = texture(u_texture, vec2(v_tex_coord.x - x, v_tex_coord.y - y));
  vec4 m = texture(u_texture, vec2(v_tex_coord.x + x, v_tex_coord.y - y));

  vec4 downsample = e*0.125;
  downsample += (a+c+g+i)*0.03125;
  downsample += (b+d+f+h)*0.0625;
  downsample += (j+k+l+m)*0.125;
  FragColor = downsample;
}
