// R3F-Canvas: Studio-Licht, Reflexionen, Schatten, Orbit-Steuerung.

import { Bounds, ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import { deriveMeasures } from '../pricing/geometry'
import { useConfig } from '../state/store'
import { Wardrobe } from './Wardrobe'

function StudioEnvironment() {
  // Env-Map rein prozedural aus Lightformern – keine externen Assets/HDRIs.
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#15171c']} />
      <Lightformer intensity={1.8} form="rect" position={[0, 3.5, 2]} scale={[7, 3, 1]} />
      <Lightformer
        intensity={1}
        form="rect"
        position={[-3.5, 1.2, 1]}
        scale={[3, 4, 1]}
        rotation-y={Math.PI / 4}
      />
      <Lightformer
        intensity={0.9}
        form="rect"
        position={[3.5, 1.2, 1]}
        scale={[3, 4, 1]}
        rotation-y={-Math.PI / 4}
      />
      <Lightformer intensity={0.6} form="ring" color="#ffffff" position={[0, 2, -3.5]} scale={5} />
    </Environment>
  )
}

export function Scene() {
  const config = useConfig((s) => s.config)
  const measures = deriveMeasures(config)

  const depthM = config.depth / 100
  const totalWM = measures.totalWidth / 100
  const shadowScale = useMemo(() => Math.max(totalWM, depthM) * 1.8 + 1, [totalWM, depthM])

  // `key` erzwingt ein sauberes Neu-Framing, wenn sich die Grundmaße ändern.
  const boundsKey = `${measures.totalWidth}-${measures.totalHeight}-${config.depth}`

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
      camera={{ position: [3, 2.5, 4.4], fov: 30 }}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight intensity={0.35} groundColor="#20222a" color="#ffffff" />
      <directionalLight
        position={[3.5, 6, 4]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={5}
        shadow-camera-bottom={-1}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <directionalLight position={[-4, 3, -2]} intensity={0.3} />

      <Suspense fallback={null}>
        {/* key remountet Bounds bei Maßänderung → sauberes Neu-Framing */}
        <Bounds key={boundsKey} fit clip margin={1.1}>
          <Wardrobe />
        </Bounds>
        <StudioEnvironment />
      </Suspense>

      <ContactShadows
        position={[0, 0.001, depthM / 2]}
        scale={shadowScale}
        resolution={1024}
        far={4}
        blur={2.6}
        opacity={0.45}
        color="#1a1c22"
      />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={1.4}
        maxDistance={9}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 - 0.04}
      />
    </Canvas>
  )
}
