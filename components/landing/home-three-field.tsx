"use client"

import { useEffect, useRef } from "react"
import {
  AdditiveBlending,
  Box3,
  type BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  LineBasicMaterial,
  LineLoop,
  type Material,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  type Path,
  Scene,
  ShaderMaterial,
  ShapeGeometry,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three"
import { SVGLoader } from "three/addons/loaders/SVGLoader.js"
import { usePrefersReducedMotion } from "@/lib/gsap/use-prefers-reduced-motion"

const BRAND_PRIMARY = 0x01dea2
const BRAND_AGUA = 0x01635c
const ISOTIPO_SRC = "/brand/syntia-isotipo.svg"
const SVG_CENTER = 242.82
const SVG_HALF = 242.82
const BACKGROUND_ZOOM = 2.35
const CURVE_SEGMENTS = 64

const SWEEP_VERTEX = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const SWEEP_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform vec3 uPrimary;
  varying vec2 vPos;

  void main() {
    float band = sin(vPos.x * 0.55 + vPos.y * 0.42 + uTime * 1.35) * 0.5 + 0.5;
    band = pow(band, 2.8);
    gl_FragColor = vec4(uPrimary, band * 0.18);
  }
`

function svgPointToWorld(point: Vector2): Vector3 {
  return new Vector3(
    (point.x - SVG_CENTER) / SVG_HALF,
    -((point.y - SVG_CENTER) / SVG_HALF),
    0,
  )
}

function transformSvgGeometry(geometry: BufferGeometry) {
  const position = geometry.getAttribute("position") as BufferAttribute
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)
    position.setX(i, (x - SVG_CENTER) / SVG_HALF)
    position.setY(i, -((y - SVG_CENTER) / SVG_HALF))
  }
  position.needsUpdate = true
  geometry.computeBoundingBox()
}

function pathToEdgePoints(path: Path): Vector3[] {
  return path.getPoints(CURVE_SEGMENTS).map(svgPointToWorld)
}

function fitGroupToView(
  group: Group,
  camera: OrthographicCamera,
  zoom: number,
) {
  group.position.set(0, 0, 0)
  group.scale.setScalar(1)
  group.updateMatrixWorld(true)

  const box = new Box3().setFromObject(group)
  if (box.isEmpty()) return

  const center = box.getCenter(new Vector3())
  group.position.sub(center)

  const size = box.getSize(new Vector3())
  const maxDim = Math.max(size.x, size.y, 0.001)
  const viewHeight = maxDim / zoom
  const aspect = (camera.right - camera.left) / (camera.top - camera.bottom)
  const viewWidth = viewHeight * aspect

  camera.left = -viewWidth / 2
  camera.right = viewWidth / 2
  camera.top = viewHeight / 2
  camera.bottom = -viewHeight / 2
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()
}

export function HomeThreeField() {
  const mountRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const mountEl = mountRef.current
    if (!mountEl) return

    let frameId = 0
    let disposed = false
    const cleanupFns: Array<() => void> = []

    async function init() {
      const host = mountRef.current
      if (!host || disposed) return

      let svgText: string
      try {
        const response = await fetch(ISOTIPO_SRC)
        if (!response.ok) return
        svgText = await response.text()
      } catch {
        return
      }

      if (disposed || !mountRef.current) return

      const loader = new SVGLoader()
      const svgData = loader.parse(svgText)
      if (!svgData.paths.length || disposed || !mountRef.current) return

      const scene = new Scene()
      const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 20)
      camera.position.set(0, 0, 5)
      camera.lookAt(0, 0, 0)

      const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.setClearColor(0x000000, 0)

      const canvas = renderer.domElement
      canvas.style.position = "absolute"
      canvas.style.inset = "0"
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      canvas.style.display = "block"
      canvas.style.pointerEvents = "none"
      host.appendChild(canvas)

      const isotipoGroup = new Group()

      const fillMaterial = new MeshBasicMaterial({
        color: BRAND_AGUA,
        transparent: true,
        opacity: 0.07,
        depthWrite: false,
        side: DoubleSide,
      })

      const edgeMaterial = new LineBasicMaterial({
        color: BRAND_PRIMARY,
        transparent: true,
        opacity: 0.44,
        depthWrite: false,
        blending: AdditiveBlending,
      })

      const sweepMaterial = new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPrimary: { value: new Color(BRAND_PRIMARY) },
        },
        vertexShader: SWEEP_VERTEX,
        fragmentShader: SWEEP_FRAGMENT,
      })

      const disposables: Array<BufferGeometry | Material> = [
        fillMaterial,
        edgeMaterial,
        sweepMaterial,
      ]

      for (const svgPath of svgData.paths) {
        const shapes = svgPath.toShapes()

        for (const shape of shapes) {
          const geometry = new ShapeGeometry(shape, CURVE_SEGMENTS)
          transformSvgGeometry(geometry)
          if (geometry.getAttribute("position").count === 0) continue

          isotipoGroup.add(new Mesh(geometry, fillMaterial))

          const sweepGeometry = geometry.clone()
          const sweepMesh = new Mesh(sweepGeometry, sweepMaterial)
          sweepMesh.position.z = 0.01
          isotipoGroup.add(sweepMesh)
          disposables.push(geometry, sweepGeometry)
        }

        for (const subPath of svgPath.subPaths) {
          const edgePoints = pathToEdgePoints(subPath)
          if (edgePoints.length < 3) continue

          const edgeGeometry = new BufferGeometry().setFromPoints(edgePoints)
          const edgeLine = new LineLoop(edgeGeometry, edgeMaterial)
          edgeLine.position.z = 0.02
          isotipoGroup.add(edgeLine)
          disposables.push(edgeGeometry)
        }
      }

      if (isotipoGroup.children.length === 0) return

      scene.add(isotipoGroup)

      const timer = new Timer()
      timer.connect(document)

      const resize = () => {
        if (disposed || !mountRef.current) return
        const { clientWidth, clientHeight } = mountRef.current
        if (clientWidth === 0 || clientHeight === 0) return

        const aspect = clientWidth / clientHeight
        camera.left = -aspect
        camera.right = aspect
        camera.top = 1
        camera.bottom = -1
        camera.updateProjectionMatrix()

        renderer.setSize(clientWidth, clientHeight, false)
        fitGroupToView(isotipoGroup, camera, BACKGROUND_ZOOM)
      }

      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(host)
      cleanupFns.push(() => resizeObserver.disconnect())

      resize()

      const animate = (timestamp: number) => {
        if (disposed) return

        timer.update(timestamp)
        const elapsed = timer.getElapsed()
        sweepMaterial.uniforms.uTime.value = elapsed

        const breathe = 1 + Math.sin(elapsed * 0.45) * 0.012
        isotipoGroup.scale.setScalar(breathe)
        fillMaterial.opacity = 0.055 + Math.sin(elapsed * 0.5) * 0.02
        edgeMaterial.opacity = 0.36 + Math.sin(elapsed * 0.8) * 0.1

        renderer.render(scene, camera)
        frameId = window.requestAnimationFrame(animate)
      }

      frameId = window.requestAnimationFrame(animate)

      cleanupFns.push(() => {
        window.cancelAnimationFrame(frameId)
        timer.dispose()
        for (const item of disposables) item.dispose()
        renderer.dispose()
        if (canvas.parentNode === host) {
          host.removeChild(canvas)
        }
      })
    }

    // Se difiere a tiempo ocioso del navegador: es un fondo decorativo (aria-hidden)
    // y su coste de WebGL/parsing SVG no debe competir por el hilo principal con el
    // LCP ni con la interactividad temprana de la página.
    let idleId: number | undefined
    let timeoutId: number | undefined

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => void init(), { timeout: 2000 })
    } else {
      timeoutId = window.setTimeout(() => void init(), 200)
    }

    return () => {
      disposed = true
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      for (const cleanup of cleanupFns) cleanup()
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-0 z-[1] min-h-[inherit] bg-[url('/brand/syntia-isotipo.svg')] bg-center bg-no-repeat opacity-20"
        style={{ backgroundSize: `${BACKGROUND_ZOOM * 100}%` }}
        aria-hidden
      />
    )
  }

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-[1] min-h-[inherit]"
      aria-hidden
    />
  )
}
