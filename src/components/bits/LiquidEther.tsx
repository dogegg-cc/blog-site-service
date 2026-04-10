import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './LiquidEther.css';

// --- 类型与接口 ---

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

// --- Shader 字符串 ---

const face_vert = `
attribute vec3 position;
uniform vec2 px;
uniform vec2 boundarySpace;
varying vec2 uv;
precision highp float;
void main(){
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5)+(pos.xy)*0.5;
  gl_Position = vec4(pos, 1.0);
}
`;

const line_vert = `
attribute vec3 position;
uniform vec2 px;
precision highp float;
varying vec2 uv;
void main(){
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}
`;

const mouse_vert = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main(){
  vec2 pos = position.xy * scale * 2.0 * px + center;
  vUv = uv;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const advection_frag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform bool isBFECC;
uniform vec2 fboSize;
uniform vec2 px;
varying vec2 uv;
void main(){
  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
  if(isBFECC == false){
    vec2 vel = texture2D(velocity, uv).xy;
    vec2 uv2 = uv - vel * dt * ratio;
    vec2 newVel = texture2D(velocity, uv2).xy;
    gl_FragColor = vec4(newVel, 0.0, 0.0);
  } else {
    vec2 spot_new = uv;
    vec2 vel_old = texture2D(velocity, uv).xy;
    vec2 spot_old = spot_new - vel_old * dt * ratio;
    vec2 vel_new1 = texture2D(velocity, spot_old).xy;
    vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
    vec2 error = spot_new2 - spot_new;
    vec2 spot_new3 = spot_new - error / 2.0;
    vec2 vel_2 = texture2D(velocity, spot_new3).xy;
    vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
    vec2 newVel2 = texture2D(velocity, spot_old2).xy; 
    gl_FragColor = vec4(newVel2, 0.0, 0.0);
  }
}
`;

const color_frag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D palette;
uniform vec4 bgColor;
varying vec2 uv;
void main(){
  vec2 vel = texture2D(velocity, uv).xy;
  float lenv = clamp(length(vel), 0.0, 1.0);
  vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
  vec3 outRGB = mix(bgColor.rgb, c, lenv);
  float outA = mix(bgColor.a, 1.0, lenv);
  gl_FragColor = vec4(outRGB, outA);
}
`;

const divergence_frag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 px;
varying vec2 uv;
void main(){
  float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
  float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
  float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
  float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
  float divergence = (x1 - x0 + y1 - y0) / 2.0;
  gl_FragColor = vec4(divergence / dt);
}
`;

const externalForce_frag = `
precision highp float;
uniform vec2 force;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main(){
  vec2 circle = (vUv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  gl_FragColor = vec4(force * d, 0.0, 1.0);
}
`;

const poisson_frag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 px;
varying vec2 uv;
void main(){
  float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
  float div = texture2D(divergence, uv).r;
  float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
  gl_FragColor = vec4(newP);
}
`;

const pressure_frag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  float step = 1.0;
  float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
  vec2 v = texture2D(velocity, uv).xy;
  vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
  v = v - gradP * dt;
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

const viscous_frag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D velocity_new;
uniform float v;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  vec2 old = texture2D(velocity, uv).xy;
  vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
  vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
  vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
  vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
  vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
  newv /= 4.0 * (1.0 + v * dt);
  gl_FragColor = vec4(newv, 0.0, 0.0);
}
`;

// --- 逻辑类 ---

class CommonClass {
  width = 0;
  height = 0;
  aspect = 1;
  pixelRatio = 1;
  time = 0;
  delta = 0;
  container: HTMLElement | null = null;
  renderer: THREE.WebGLRenderer | null = null;
  clock: THREE.Clock | null = null;

  init(container: HTMLElement) {
    this.container = container;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.autoClear = false;
    this.renderer.setClearColor(new THREE.Color(0x000000), 0);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height);
    const el = this.renderer.domElement;
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.display = 'block';
    this.clock = new THREE.Clock();
    this.clock.start();
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.aspect = this.width / this.height;
    if (this.renderer) this.renderer.setSize(this.width, this.height, false);
  }

  update() {
    if (!this.clock) return;
    this.delta = this.clock.getDelta();
    this.time += this.delta;
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    this.clock = null;
  }
}

class MouseClass {
  coords = new THREE.Vector2();
  coords_old = new THREE.Vector2();
  diff = new THREE.Vector2();
  timer: number | null = null;
  container: HTMLElement | null = null;
  docTarget: Document | null = null;
  listenerTarget: Window | null = null;
  isHoverInside = false;
  hasUserControl = false;
  isAutoActive = false;
  autoIntensity = 2.0;
  takeoverActive = false;
  takeoverStartTime = 0;
  takeoverDuration = 0.25;
  takeoverFrom = new THREE.Vector2();
  takeoverTo = new THREE.Vector2();
  onInteract: (() => void) | null = null;

  private _onMouseMove = this.onDocumentMouseMove.bind(this);
  private _onTouchStart = this.onDocumentTouchStart.bind(this);
  private _onTouchMove = this.onDocumentTouchMove.bind(this);
  private _onTouchEnd = this.onTouchEnd.bind(this);
  private _onDocumentLeave = this.onDocumentLeave.bind(this);

  init(container: HTMLElement) {
    this.container = container;
    this.docTarget = container.ownerDocument || null;
    const defaultView =
      this.docTarget?.defaultView ||
      (typeof window !== 'undefined' ? window : null);
    if (!defaultView) return;
    this.listenerTarget = defaultView;
    this.listenerTarget.addEventListener('mousemove', this._onMouseMove);
    this.listenerTarget.addEventListener('touchstart', this._onTouchStart, {
      passive: true,
    });
    this.listenerTarget.addEventListener('touchmove', this._onTouchMove, {
      passive: true,
    });
    this.listenerTarget.addEventListener('touchend', this._onTouchEnd);
    this.docTarget?.addEventListener('mouseleave', this._onDocumentLeave);
  }

  dispose() {
    if (this.listenerTarget) {
      this.listenerTarget.removeEventListener('mousemove', this._onMouseMove);
      this.listenerTarget.removeEventListener('touchstart', this._onTouchStart);
      this.listenerTarget.removeEventListener('touchmove', this._onTouchMove);
      this.listenerTarget.removeEventListener('touchend', this._onTouchEnd);
    }
    if (this.docTarget) {
      this.docTarget.removeEventListener('mouseleave', this._onDocumentLeave);
    }
  }

  private isPointInside(clientX: number, clientY: number) {
    if (!this.container) return false;
    const rect = this.container.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  }

  private updateHoverState(clientX: number, clientY: number) {
    this.isHoverInside = this.isPointInside(clientX, clientY);
    return this.isHoverInside;
  }

  setCoords(x: number, y: number) {
    if (!this.container) return;
    if (this.timer) window.clearTimeout(this.timer);
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nx = (x - rect.left) / rect.width;
    const ny = (y - rect.top) / rect.height;
    this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
    this.timer = window.setTimeout(() => {}, 100);
  }

  setNormalized(nx: number, ny: number) {
    this.coords.set(nx, ny);
  }

  onDocumentMouseMove(event: MouseEvent) {
    if (!this.updateHoverState(event.clientX, event.clientY)) return;
    if (this.onInteract) this.onInteract();
    if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      this.takeoverFrom.copy(this.coords);
      this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
      this.takeoverStartTime = performance.now();
      this.takeoverActive = true;
      this.hasUserControl = true;
      this.isAutoActive = false;
      return;
    }
    this.setCoords(event.clientX, event.clientY);
    this.hasUserControl = true;
  }

  onDocumentTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const t = event.touches[0];
    if (!this.updateHoverState(t.clientX, t.clientY)) return;
    if (this.onInteract) this.onInteract();
    this.setCoords(t.clientX, t.clientY);
    this.hasUserControl = true;
  }

  onDocumentTouchMove(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    const t = event.touches[0];
    if (!this.updateHoverState(t.clientX, t.clientY)) return;
    if (this.onInteract) this.onInteract();
    this.setCoords(t.clientX, t.clientY);
  }

  onTouchEnd() {
    this.isHoverInside = false;
  }
  onDocumentLeave() {
    this.isHoverInside = false;
  }

  update() {
    if (this.takeoverActive) {
      const t =
        (performance.now() - this.takeoverStartTime) /
        (this.takeoverDuration * 1000);
      if (t >= 1) {
        this.takeoverActive = false;
        this.coords.copy(this.takeoverTo);
        this.coords_old.copy(this.coords);
        this.diff.set(0, 0);
      } else {
        const k = t * t * (3 - 2 * t);
        this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
      }
    }
    this.diff.subVectors(this.coords, this.coords_old);
    this.coords_old.copy(this.coords);
    if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
    if (this.isAutoActive && !this.takeoverActive)
      this.diff.multiplyScalar(this.autoIntensity);
  }
}

class AutoDriver {
  mouse: MouseClass;
  getInteractionTime: () => number;
  enabled: boolean;
  speed: number;
  resumeDelay: number;
  rampDurationMs: number;
  active = false;
  current = new THREE.Vector2(0, 0);
  target = new THREE.Vector2();
  lastTime = performance.now();
  activationTime = 0;
  margin = 0.2;
  private _tmpDir = new THREE.Vector2();

  constructor(
    mouse: MouseClass,
    getInteractionTime: () => number,
    opts: {
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDuration: number;
    },
  ) {
    this.mouse = mouse;
    this.getInteractionTime = getInteractionTime;
    this.enabled = opts.enabled;
    this.speed = opts.speed;
    this.resumeDelay = opts.resumeDelay || 3000;
    this.rampDurationMs = (opts.rampDuration || 0) * 1000;
    this.pickNewTarget();
  }

  pickNewTarget() {
    const r = Math.random;
    this.target.set(
      (r() * 2 - 1) * (1 - this.margin),
      (r() * 2 - 1) * (1 - this.margin),
    );
  }

  forceStop() {
    this.active = false;
    this.mouse.isAutoActive = false;
  }

  update() {
    if (!this.enabled) return;
    const now = performance.now();
    const idle = now - this.getInteractionTime();
    if (idle < this.resumeDelay || this.mouse.isHoverInside) {
      if (this.active) this.forceStop();
      return;
    }
    if (!this.active) {
      this.active = true;
      this.current.copy(this.mouse.coords);
      this.lastTime = now;
      this.activationTime = now;
    }
    this.mouse.isAutoActive = true;
    let dtSec = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (dtSec > 0.2) dtSec = 0.016;
    const dir = this._tmpDir.subVectors(this.target, this.current);
    const dist = dir.length();
    if (dist < 0.01) {
      this.pickNewTarget();
      return;
    }
    dir.normalize();
    let ramp = 1;
    if (this.rampDurationMs > 0) {
      const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
      ramp = t * t * (3 - 2 * t);
    }
    const step = this.speed * dtSec * ramp;
    const move = Math.min(step, dist);
    this.current.addScaledVector(dir, move);
    this.mouse.setNormalized(this.current.x, this.current.y);
  }
}

abstract class ShaderPass {
  common: CommonClass;
  uniforms?: Record<string, THREE.IUniform>;
  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.Camera = new THREE.Camera();
  material: THREE.RawShaderMaterial | null = null;
  geometry: THREE.BufferGeometry | null = null;
  plane: THREE.Mesh | null = null;
  outputTarget: THREE.WebGLRenderTarget | null = null;

  constructor(
    common: CommonClass,
    outputTarget: THREE.WebGLRenderTarget | null,
    materialProps?: THREE.ShaderMaterialParameters,
  ) {
    this.common = common;
    this.outputTarget = outputTarget;
    if (materialProps) {
      this.material = new THREE.RawShaderMaterial(materialProps);
      this.uniforms = this.material.uniforms;
      this.geometry = new THREE.PlaneGeometry(2, 2);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);
    }
  }

  render() {
    if (!this.common.renderer) return;
    this.common.renderer.setRenderTarget(this.outputTarget);
    this.common.renderer.render(this.scene, this.camera);
    this.common.renderer.setRenderTarget(null);
  }

  dispose() {
    this.material?.dispose();
    this.geometry?.dispose();
  }
}

class Advection extends ShaderPass {
  line: THREE.LineSegments;
  constructor(
    common: CommonClass,
    simProps: {
      cellScale: THREE.Vector2;
      fboSize: THREE.Vector2;
      dt: number;
      src: THREE.WebGLRenderTarget;
      dst: THREE.WebGLRenderTarget;
    },
  ) {
    super(common, simProps.dst, {
      vertexShader: face_vert,
      fragmentShader: advection_frag,
      uniforms: {
        boundarySpace: { value: simProps.cellScale },
        px: { value: simProps.cellScale },
        fboSize: { value: simProps.fboSize },
        velocity: { value: simProps.src.texture },
        dt: { value: simProps.dt },
        isBFECC: { value: true },
      },
    });

    const boundaryG = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1,
      -1, 0,
    ]);
    boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const boundaryM = new THREE.RawShaderMaterial({
      vertexShader: line_vert,
      fragmentShader: advection_frag,
      uniforms: this.uniforms,
    });
    this.line = new THREE.LineSegments(boundaryG, boundaryM);
    this.scene.add(this.line);
  }

  update(dt: number, isBounce: boolean, BFECC: boolean) {
    if (!this.uniforms) return;
    this.uniforms.dt.value = dt;
    this.line.visible = isBounce;
    this.uniforms.isBFECC.value = BFECC;
    this.render();
  }

  dispose() {
    super.dispose();
    this.line.geometry.dispose();
    (this.line.material as THREE.Material).dispose();
  }
}

class ExternalForce extends ShaderPass {
  mouseMesh: THREE.Mesh;
  constructor(
    common: CommonClass,
    simProps: {
      cellScale: THREE.Vector2;
      cursor_size: number;
      dst: THREE.WebGLRenderTarget;
    },
  ) {
    super(common, simProps.dst);
    const mouseG = new THREE.PlaneGeometry(1, 1);
    const mouseM = new THREE.RawShaderMaterial({
      vertexShader: mouse_vert,
      fragmentShader: externalForce_frag,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        px: { value: simProps.cellScale },
        force: { value: new THREE.Vector2(0, 0) },
        center: { value: new THREE.Vector2(0, 0) },
        scale: {
          value: new THREE.Vector2(simProps.cursor_size, simProps.cursor_size),
        },
      },
    });
    this.mouseMesh = new THREE.Mesh(mouseG, mouseM);
    this.scene.add(this.mouseMesh);
  }

  update(
    mouse: MouseClass,
    force: number,
    cellScale: THREE.Vector2,
    cursorSize: number,
  ) {
    const fX = (mouse.diff.x / 2) * force;
    const fY = (mouse.diff.y / 2) * force;
    const csX = cursorSize * cellScale.x;
    const csY = cursorSize * cellScale.y;
    const cX = Math.min(
      Math.max(mouse.coords.x, -1 + csX + cellScale.x * 2),
      1 - csX - cellScale.x * 2,
    );
    const cY = Math.min(
      Math.max(mouse.coords.y, -1 + csY + cellScale.y * 2),
      1 - csY - cellScale.y * 2,
    );
    const u = (this.mouseMesh.material as THREE.RawShaderMaterial).uniforms;
    u.force.value.set(fX, fY);
    u.center.value.set(cX, cY);
    u.scale.value.set(cursorSize, cursorSize);
    this.render();
  }

  dispose() {
    super.dispose();
    this.mouseMesh.geometry.dispose();
    (this.mouseMesh.material as THREE.Material).dispose();
  }
}

class Viscous extends ShaderPass {
  dst0: THREE.WebGLRenderTarget;
  dst1: THREE.WebGLRenderTarget;
  constructor(
    common: CommonClass,
    simProps: {
      cellScale: THREE.Vector2;
      boundarySpace: THREE.Vector2;
      viscous: number;
      src: THREE.WebGLRenderTarget;
      dst: THREE.WebGLRenderTarget;
      dst_: THREE.WebGLRenderTarget;
      dt: number;
    },
  ) {
    super(common, simProps.dst, {
      vertexShader: face_vert,
      fragmentShader: viscous_frag,
      uniforms: {
        boundarySpace: { value: simProps.boundarySpace },
        velocity: { value: simProps.src.texture },
        velocity_new: { value: simProps.dst_.texture },
        v: { value: simProps.viscous },
        px: { value: simProps.cellScale },
        dt: { value: simProps.dt },
      },
    });
    this.dst0 = simProps.dst_;
    this.dst1 = simProps.dst;
  }

  update(
    viscous: number,
    iterations: number,
    dt: number,
  ): THREE.WebGLRenderTarget {
    if (!this.uniforms) return this.dst1;
    this.uniforms.v.value = viscous;
    this.uniforms.dt.value = dt;
    let fbo_out = this.dst1;
    for (let i = 0; i < iterations; i++) {
      const isEven = i % 2 === 0;
      const f_in = isEven ? this.dst0 : this.dst1;
      fbo_out = isEven ? this.dst1 : this.dst0;
      this.uniforms.velocity_new.value = f_in.texture;
      this.outputTarget = fbo_out;
      this.render();
    }
    return fbo_out;
  }
}

class Divergence extends ShaderPass {
  constructor(
    common: CommonClass,
    simProps: {
      cellScale: THREE.Vector2;
      boundarySpace: THREE.Vector2;
      src: THREE.WebGLRenderTarget;
      dst: THREE.WebGLRenderTarget;
      dt: number;
    },
  ) {
    super(common, simProps.dst, {
      vertexShader: face_vert,
      fragmentShader: divergence_frag,
      uniforms: {
        boundarySpace: { value: simProps.boundarySpace },
        velocity: { value: simProps.src.texture },
        px: { value: simProps.cellScale },
        dt: { value: simProps.dt },
      },
    });
  }

  update(vel: THREE.WebGLRenderTarget) {
    if (this.uniforms) this.uniforms.velocity.value = vel.texture;
    this.render();
  }
}

class Poisson extends ShaderPass {
  dst0: THREE.WebGLRenderTarget;
  dst1: THREE.WebGLRenderTarget;
  constructor(
    common: CommonClass,
    simProps: {
      cellScale: THREE.Vector2;
      boundarySpace: THREE.Vector2;
      src: THREE.WebGLRenderTarget;
      dst: THREE.WebGLRenderTarget;
      dst_: THREE.WebGLRenderTarget;
    },
  ) {
    super(common, simProps.dst, {
      vertexShader: face_vert,
      fragmentShader: poisson_frag,
      uniforms: {
        boundarySpace: { value: simProps.boundarySpace },
        pressure: { value: simProps.dst_.texture },
        divergence: { value: simProps.src.texture },
        px: { value: simProps.cellScale },
      },
    });
    this.dst0 = simProps.dst_;
    this.dst1 = simProps.dst;
  }

  update(iterations: number): THREE.WebGLRenderTarget {
    let p_out = this.dst1;
    for (let i = 0; i < iterations; i++) {
      const isEven = i % 2 === 0;
      const p_in = isEven ? this.dst0 : this.dst1;
      p_out = isEven ? this.dst1 : this.dst0;
      if (this.uniforms) this.uniforms.pressure.value = p_in.texture;
      this.outputTarget = p_out;
      this.render();
    }
    return p_out;
  }
}

class Pressure extends ShaderPass {
  constructor(
    common: CommonClass,
    simProps: {
      cellScale: THREE.Vector2;
      boundarySpace: THREE.Vector2;
      src_p: THREE.WebGLRenderTarget;
      src_v: THREE.WebGLRenderTarget;
      dst: THREE.WebGLRenderTarget;
      dt: number;
    },
  ) {
    super(common, simProps.dst, {
      vertexShader: face_vert,
      fragmentShader: pressure_frag,
      uniforms: {
        boundarySpace: { value: simProps.boundarySpace },
        pressure: { value: simProps.src_p.texture },
        velocity: { value: simProps.src_v.texture },
        px: { value: simProps.cellScale },
        dt: { value: simProps.dt },
      },
    });
  }

  update(vel: THREE.WebGLRenderTarget, pressure: THREE.WebGLRenderTarget) {
    if (this.uniforms) {
      this.uniforms.velocity.value = vel.texture;
      this.uniforms.pressure.value = pressure.texture;
    }
    this.render();
  }
}

class Simulation {
  common: CommonClass;
  options: SimOptions;
  fbos: Record<string, THREE.WebGLRenderTarget> = {};
  fboSize = new THREE.Vector2();
  cellScale = new THREE.Vector2();
  boundarySpace = new THREE.Vector2();

  advection!: Advection;
  externalForce!: ExternalForce;
  viscous!: Viscous;
  divergence!: Divergence;
  poisson!: Poisson;
  pressure!: Pressure;

  constructor(common: CommonClass, options: SimOptions) {
    this.common = common;
    this.options = options;
    this.init();
  }

  init() {
    this.calcSize();
    this.createAllFBO();
    this.createShaderPass();
  }

  private calcSize() {
    const w = Math.max(
      1,
      Math.round(this.options.resolution * this.common.width),
    );
    const h = Math.max(
      1,
      Math.round(this.options.resolution * this.common.height),
    );
    this.cellScale.set(1 / w, 1 / h);
    this.fboSize.set(w, h);
  }

  private createAllFBO() {
    const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
    const type = isIOS ? THREE.HalfFloatType : THREE.FloatType;
    const opts = {
      type,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    };
    const keys = [
      'vel_0',
      'vel_1',
      'vel_viscous0',
      'vel_viscous1',
      'div',
      'pressure_0',
      'pressure_1',
    ];
    keys.forEach((k) => {
      this.fbos[k] = new THREE.WebGLRenderTarget(
        this.fboSize.x,
        this.fboSize.y,
        opts,
      );
    });
  }

  private createShaderPass() {
    const common = this.common;
    this.advection = new Advection(common, {
      cellScale: this.cellScale,
      fboSize: this.fboSize,
      dt: this.options.dt,
      src: this.fbos.vel_0,
      dst: this.fbos.vel_1,
    });
    this.externalForce = new ExternalForce(common, {
      cellScale: this.cellScale,
      cursor_size: this.options.cursor_size,
      dst: this.fbos.vel_1,
    });
    this.viscous = new Viscous(common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      viscous: this.options.viscous,
      src: this.fbos.vel_1,
      dst: this.fbos.vel_viscous1,
      dst_: this.fbos.vel_viscous0,
      dt: this.options.dt,
    });
    this.divergence = new Divergence(common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src: this.fbos.vel_viscous1,
      dst: this.fbos.div,
      dt: this.options.dt,
    });
    this.poisson = new Poisson(common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src: this.fbos.div,
      dst: this.fbos.pressure_1,
      dst_: this.fbos.pressure_0,
    });
    this.pressure = new Pressure(common, {
      cellScale: this.cellScale,
      boundarySpace: this.boundarySpace,
      src_p: this.fbos.pressure_1,
      src_v: this.fbos.vel_viscous1,
      dst: this.fbos.vel_0,
      dt: this.options.dt,
    });
  }

  resize() {
    this.calcSize();
    Object.values(this.fbos).forEach((fbo) =>
      fbo.setSize(this.fboSize.x, this.fboSize.y),
    );
  }

  update(mouse: MouseClass) {
    if (this.options.isBounce) this.boundarySpace.set(0, 0);
    else this.boundarySpace.copy(this.cellScale);

    this.advection.update(
      this.options.dt,
      this.options.isBounce,
      this.options.BFECC,
    );
    this.externalForce.update(
      mouse,
      this.options.mouse_force,
      this.cellScale,
      this.options.cursor_size,
    );

    let vRes = this.fbos.vel_1;
    if (this.options.isViscous) {
      vRes = this.viscous.update(
        this.options.viscous,
        this.options.iterations_viscous,
        this.options.dt,
      );
    }
    this.divergence.update(vRes);
    const pRes = this.poisson.update(this.options.iterations_poisson);
    this.pressure.update(vRes, pRes);
  }

  dispose() {
    Object.values(this.fbos).forEach((fbo) => fbo.dispose());
    this.advection.dispose();
    this.externalForce.dispose();
    this.viscous.dispose();
    this.divergence.dispose();
    this.poisson.dispose();
    this.pressure.dispose();
  }
}

class Output extends ShaderPass {
  simulation: Simulation;
  constructor(
    common: CommonClass,
    paletteTex: THREE.Texture,
    bgVec4: THREE.Vector4,
    simOptions: SimOptions,
  ) {
    super(common, null);
    this.simulation = new Simulation(common, simOptions);
    this.material = new THREE.RawShaderMaterial({
      vertexShader: face_vert,
      fragmentShader: color_frag,
      transparent: true,
      depthWrite: false,
      uniforms: {
        velocity: { value: this.simulation.fbos.vel_0.texture },
        boundarySpace: { value: new THREE.Vector2() },
        palette: { value: paletteTex },
        bgColor: { value: bgVec4 },
      },
    });
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  update(mouse: MouseClass) {
    this.simulation.update(mouse);
    this.render();
  }

  resize() {
    this.simulation.resize();
  }

  dispose() {
    super.dispose();
    this.simulation.dispose();
  }
}

class WebGLManager {
  common: CommonClass = new CommonClass();
  mouse: MouseClass = new MouseClass();
  output: Output | null = null;
  autoDriver: AutoDriver | null = null;
  lastUserInteraction = performance.now();
  running = false;
  paletteTex: THREE.DataTexture;
  bgVec4 = new THREE.Vector4(0, 0, 0, 0);
  props: LiquidEtherProps;

  private _loop = () => {
    if (this.running) {
      this.render();
      requestAnimationFrame(this._loop);
    }
  };

  constructor(
    container: HTMLElement,
    props: LiquidEtherProps,
    colors: string[],
  ) {
    this.props = props;
    this.common.init(container);
    this.mouse.init(container);
    this.mouse.autoIntensity = props.autoIntensity ?? 2.2;
    this.mouse.takeoverDuration = props.takeoverDuration ?? 0.25;
    this.mouse.onInteract = () => {
      this.lastUserInteraction = performance.now();
      this.autoDriver?.forceStop();
    };

    this.paletteTex = this.makePaletteTexture(colors);
    const simOptions: SimOptions = {
      iterations_poisson: props.iterationsPoisson ?? 32,
      iterations_viscous: props.iterationsViscous ?? 32,
      mouse_force: props.mouseForce ?? 20,
      resolution: props.resolution ?? 0.5,
      cursor_size: props.cursorSize ?? 100,
      viscous: props.viscous ?? 30,
      isBounce: props.isBounce ?? false,
      dt: props.dt ?? 0.014,
      isViscous: props.isViscous ?? false,
      BFECC: props.BFECC ?? true,
    };

    this.output = new Output(
      this.common,
      this.paletteTex,
      this.bgVec4,
      simOptions,
    );
    container.prepend(this.common.renderer!.domElement);

    this.autoDriver = new AutoDriver(
      this.mouse,
      () => this.lastUserInteraction,
      {
        enabled: props.autoDemo ?? true,
        speed: props.autoSpeed ?? 0.5,
        resumeDelay: props.autoResumeDelay ?? 1000,
        rampDuration: props.autoRampDuration ?? 0.6,
      },
    );
  }

  private makePaletteTexture(stops: string[]): THREE.DataTexture {
    const arr =
      Array.isArray(stops) && stops.length > 0
        ? stops.length === 1
          ? [stops[0], stops[0]]
          : stops
        : ['#ffffff', '#ffffff'];
    const w = arr.length;
    const data = new Uint8Array(w * 4);
    arr.forEach((col, i) => {
      const c = new THREE.Color(col);
      data[i * 4] = Math.round(c.r * 255);
      data[i * 4 + 1] = Math.round(c.g * 255);
      data[i * 4 + 2] = Math.round(c.b * 255);
      data[i * 4 + 3] = 255;
    });
    const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
    tex.magFilter = tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  render() {
    this.autoDriver?.update();
    this.mouse.update();
    this.common.update();
    this.output?.update(this.mouse);
  }

  start() {
    if (!this.running) {
      this.running = true;
      this._loop();
    }
  }
  pause() {
    this.running = false;
  }
  resize() {
    this.common.resize();
    this.output?.resize();
  }

  dispose() {
    this.pause();
    this.mouse.dispose();
    this.output?.dispose();
    this.common.dispose();
    this.paletteTex.dispose();
  }
}

// --- 组件 ---

const defaultColors = ['#5227FF', '#FF9FFC', '#B19EEF'];

export default function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = defaultColors,
  style = {},
  className = '',
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
}: LiquidEtherProps): React.ReactElement {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<WebGLManager | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const webgl = new WebGLManager(
      container,
      {
        mouseForce,
        cursorSize,
        isViscous,
        viscous,
        iterationsViscous,
        iterationsPoisson,
        dt,
        BFECC,
        resolution,
        isBounce,
        autoDemo,
        autoSpeed,
        autoIntensity,
        takeoverDuration,
        autoResumeDelay,
        autoRampDuration,
      },
      colors,
    );

    webglRef.current = webgl;
    webgl.start();

    const handleResize = () => webgl.resize();
    window.addEventListener('resize', handleResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) webgl.start();
        else webgl.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(container);

    const handleVisibilityChange = () => {
      if (document.hidden) webgl.pause();
      else if (io) {
        // 仅在当前处于视口内时才恢复播放
        const rect = container.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) webgl.start();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      io.disconnect();
      webgl.dispose();
      webglRef.current = null;
    };
    // 忽略依赖项校验，仅在挂载时运行一次初始 WebGL 实例化
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const webgl = webglRef.current;
    if (!webgl || !webgl.output) return;
    const sim = webgl.output.simulation;
    const prevRes = sim.options.resolution;

    Object.assign(sim.options, {
      mouse_force: mouseForce,
      cursor_size: cursorSize,
      isViscous,
      viscous,
      iterations_viscous: iterationsViscous,
      iterations_poisson: iterationsPoisson,
      dt,
      BFECC,
      resolution,
      isBounce,
    });

    if (webgl.autoDriver) {
      webgl.autoDriver.enabled = autoDemo;
      webgl.autoDriver.speed = autoSpeed;
      webgl.autoDriver.resumeDelay = autoResumeDelay;
      webgl.autoDriver.rampDurationMs = autoRampDuration * 1000;
    }

    if (resolution !== prevRes) webgl.resize();
  }, [
    mouseForce,
    cursorSize,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    dt,
    BFECC,
    resolution,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration,
  ]);

  return (
    <div
      ref={mountRef}
      className={`liquid-ether-container ${className}`}
      style={style}
    />
  );
}
