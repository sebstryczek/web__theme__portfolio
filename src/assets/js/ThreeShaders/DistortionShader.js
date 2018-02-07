THREE.DistortionShader = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "time": { type: "f", value: 0.0 },
    "speed": { type: "f", value: 0.2 }
  },
  
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join( "\n" ),
  
  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform float time;",
    "uniform float speed;",
    "varying vec2 vUv;",
    "void main() {",
      "vec2 p = vUv;",
      "float t = time * speed;",
      "float min = t - floor(t);",
      "float max = min + 0.01;",
      "if (p.y > min && p.y < max)",
        "p.x = p.x - 0.01;",
        "if (p.x < 0.0) p.x = p.x + 1.0;",
      "vec4 color = texture2D(tDiffuse, p);",
      "gl_FragColor = color;",
    "}"

  ].join( "\n" )

};
