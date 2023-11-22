'use client'; 

import * as THREE from 'three'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MarchingCubes, MarchingCube, MeshTransmissionMaterial, Environment, Bounds } from '@react-three/drei'
import { Physics, RigidBody, BallCollider } from '@react-three/rapier'

function MetaBall({ color, initialPosition, ...props }) {
  const api = useRef()
  useFrame(() => {
    // Apply a random impulse for random movement
    const randomImpulse = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize().multiplyScalar(0.00000001);
    api.current.applyImpulse(randomImpulse);
  })

  return (
    <RigidBody ref={api} colliders={false} linearDamping={4} angularDamping={0.95} position={initialPosition} {...props}>
      <MarchingCube strength={0.35} subtract={6} color={color} />
      <mesh>
        <sphereGeometry args={[0.04]} />
        <meshBasicMaterial color="black" toneMapped={false} />
      </mesh>
      <BallCollider args={[0.1]} type="dynamic" />
    </RigidBody>
  )
}

export default function Metaballs() {
  const numberOfBalls = 50; // Increase the number for more metaballs

  // Generate metaballs with random positions
  const metaballs = [];
  for (let i = 0; i < numberOfBalls; i++) {
    const position = [Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5];
    metaballs.push(<MetaBall key={i} color="black" initialPosition={position} />);
  }

  return (
    <div className="canvas-container">
        <Canvas className="full-screen-container" dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 25 }}>
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={2} />
        <Physics gravity={[0, 2, 0]}>
            <MarchingCubes resolution={80} maxPolyCount={20000} enableUvs={false} enableColors>
            <MeshTransmissionMaterial
                vertexColors
                transmissionSampler
                transmission={0.9}
                thickness={0.15}
                roughness={0}
                chromaticAberration={0.15}
                anisotropy={0.5}
                envMapIntensity={0.5}
                distortion={0.5}
                distortionScale={0.5}
                temporalDistortion={0.1}
            />
            {metaballs}
            </MarchingCubes>
        </Physics>
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr" />
        {/* Zoom to fit a 1/1/1 box to match the marching cubes */}
        <Bounds fit clip observe margin={1}>
            <mesh visible={false}>
            <boxGeometry />
            </mesh>
        </Bounds>
        </Canvas>
    </div> 
  )
}
