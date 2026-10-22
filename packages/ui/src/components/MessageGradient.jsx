import { useEffect, useRef } from 'react';
import { fragmentShader } from './messageGradient.js';

// First default preset approved October 21, 2026. Only the seed varies on subsequent sequences.
export const defaultMessageGradient = Object.freeze({
  seed: 473393, blueAmount: .91, blackAmount: .56, orangeAmount: .5,
  grain: .34, softness: 1, motion: 1, detail: 0, distortion: .12,
  cropX: .66, cropY: .58, scale: 1.87, smallScale: .34, easing: 'in-out',
});
export function movementEase(t, easing) {
  if (easing === 'in') return t ** 3;
  if (easing === 'out') return 1 - (1 - t) ** 3;
  if (easing === 'in-out') return t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
  return t;
}

/** Decorative renderer; a failed/unsupported context leaves the CSS fallback. */
export function MessageGradient({ settings, loop = false, paused = false, duration = 5 }) {
  const canvasRef = useRef(null);
  const live = useRef();
  live.current = { ...defaultMessageGradient, ...settings };
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    let frame, program, buffer, shaders = [], disposed = false;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let elapsed = 0, previous = null;
    function cleanup() {
      cancelAnimationFrame(frame);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
    }
    try {
      program = gl.createProgram();
      for (const [type, source] of [[gl.VERTEX_SHADER, 'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}'], [gl.FRAGMENT_SHADER, fragmentShader]]) {
        const shader = gl.createShader(type); shaders.push(shader);
        gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Gradient compilation failed');
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Gradient linking failed');
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const uniforms = Object.fromEntries(['seed','t','grain','softness','motion','detail','distortion','blueAmount','blackAmount','orangeAmount','cropOrigin','cropSize'].map(k => [k, gl.getUniformLocation(program,k)]));
      function render(now) {
        if (disposed) return;
        if (previous !== null) elapsed += (now - previous) / 1000;
        previous = now;
        const config = live.current;
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        gl.viewport(0, 0, w, h);
        const size = Math.max(rect.width, rect.height, 506 * (loop ? config.smallScale : config.scale));
        const cropW = rect.width / size, cropH = rect.height / size;
        gl.uniform2f(uniforms.cropSize, cropW, cropH);
        gl.uniform2f(uniforms.cropOrigin, config.cropX * (1-cropW), (1-config.cropY) * (1-cropH));
        const t = media.matches || paused ? .5 : loop ? .5 + .5 * Math.cos(2 * Math.PI * elapsed / Math.max(.1,duration)) : Math.min(1,elapsed);
        gl.uniform1f(uniforms.t, movementEase(t,config.easing));
        gl.uniform1f(uniforms.seed,config.seed*.017);
        ['grain','softness','motion','detail','distortion','blueAmount','blackAmount','orangeAmount'].forEach(k => gl.uniform1f(uniforms[k],config[k]));
        gl.drawArrays(gl.TRIANGLES,0,6);
        canvas.style.opacity = loop || media.matches ? '1' : String(Math.max(0,Math.min(1,t/.2,(1-t)/.2)));
        if (!media.matches && !paused && !document.hidden) frame = requestAnimationFrame(render);
      }
      const resume = () => { cancelAnimationFrame(frame); previous = null; if (!document.hidden) render(performance.now()); };
      document.addEventListener('visibilitychange',resume); media.addEventListener('change',resume);
      render(performance.now());
      return () => { disposed=true; cleanup(); document.removeEventListener('visibilitychange',resume); media.removeEventListener('change',resume); };
    } catch { cleanup(); }
  }, [loop, paused, duration, settings]);
  return <canvas className="computer-message-gradient" ref={canvasRef} aria-hidden="true" />;
}
