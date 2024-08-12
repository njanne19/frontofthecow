'use client'; 

import React, { useRef, useState, useEffect, useMemo } from 'react' 
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'; 
import { Physics, RigidBody, BallCollider } from '@react-three/rapier'
import { MarchingCubes, MarchingCube, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three' 

function MetaballParent({ metaballProps, ...props }: { metaballProps: MetaballProps, props: any }) { 
    // This reference will give us direct access to the mesh 
    const meshRef = useRef<THREE.Mesh>(null);

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // For each metaball piece, generate a random direction it should go 
    // Since Math.random() generates numbers from 0-1, spread the range to [-0.5, 0.5]
    const direction: { x: number, y: number, z: number } = generate_random_velocity(20); 

    // Subscribe this component to the render-loop, translate the mesh every frame 
    useFrame((state, delta) => {
        if (meshRef.current != null) {

            // Update the current position based on a time delta 
            meshRef.current.position.x += direction.x * delta;
            meshRef.current.position.y += direction.y * delta;

        }

        // Check to see if the ball is out of bounds, if it is, flip the direction vector: 
        if (meshRef.current != null) {
            const position = meshRef.current.position; 
            if (position.x > metaballProps.maxX/2 || position.x < -metaballProps.maxX/2) {
                direction.x *= -1; 
            }
            if (position.y > metaballProps.maxY/2 || position.y < -metaballProps.maxY/2) {
                direction.y *= -1; 
            }
        }
    });

    // Create miniature spheres that will be used to generate the metaball
    const spheres = useMemo(() => {
        const tempSpheres = []; 
        const numberOfSpheres = Math.floor(Math.random() * 5 + 5);

        // Generate random positions around spheres
        for (let i = 0; i < numberOfSpheres; i ++) {
            const randomPosition = {
                x: 2*(Math.random() - 0.5), // adjust range if necessary
                y: 2*(Math.random() - 0.5), 
                z: 0
            };
            const randomRadius = Math.random() * metaballProps.maxRadius/2 + metaballProps.maxRadius/2; 
            tempSpheres.push(
                            <RigidBody colliders={false} position={[randomPosition.x, randomPosition.y, randomPosition.z]>
                                <MarchingCube 
                                strength={0.35} 
                                subtract={6} 
                                color="hotpink" 
                                position={[randomPosition.x, randomPosition.y, randomPosition.z]}
                                />
                                {/* <mesh key={i} position={[randomPosition.x, randomPosition.y, randomPosition.z]}>
                                    <sphereGeometry args={[1, 32, 16]} /> 
                                    <meshBasicMaterial color="black" toneMapped={false} />
                                </mesh> */}
                            </RigidBody>);
        }

        return tempSpheres;

    }, []); 

    return (
            // <mesh
            //     {...props} 
            //     position={metaballProps.position}
            //     ref={meshRef} 
            //     scale={active ? 1.5 : 1} 
            //     onClick={(event) => setActive(!active)}
            //     onPointerOver={(event) => setHover(true)}
            //     onPointerOut={(event) => setHover(false)}>
            //     <sphereGeometry args={[metaballProps.maxRadius, 32, 16]} /> 
            //     <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} /> 
            // </mesh> 
            <group 
                ref={meshRef} 
                {...props} 
                position={metaballProps.position}>
                <Physics gravity={[0, 0, 0]}>
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
                        {spheres}
                    </MarchingCubes>
                </Physics>
            </group> 
    )
}

const generate_random_velocity = (max_velocity: number) => {
    return {x: 2*max_velocity*(Math.random() -0.5), y:2*max_velocity*(Math.random() -0.5), z: 0}; 
};



// Interface definitions for intermediate pieces of metaball generation 
// MetaballProps are the properties passed onto a single metaball functional component 
interface MetaballProps { 
    maxX: number; 
    maxY: number; 
    position: [number, number, number]; 
    maxRadius: number; 
}

// MetaballsGeneratorProps are the properties passed to the generator 
// of (many) metaballs. 
interface MetaballsGeneratorProps {
    count: number
}

export const Metaballs: React.FC<MetaballsGeneratorProps> = ({ count } : { count: number }) => {
    // Camera aspect ratio changes 
    const [cameraAspect, setCameraAspect] = useState(1);

    // Now define some camera properties, and make some calculations 
    const cameraPosition: [number, number, number] = [0, 0, 20];
    const cameraFov = 75;
    const cameraNear = 0.1;
    const cameraFar = 1000;

    // When window resizes, resize camera aspect ratio
    useEffect(() => {
        // Update the aspect ratio and window shape when the window resizes
        const handleResize = () => {
            setCameraAspect(window.innerWidth / window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        // Call handleResize initially to set the initial size
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [cameraAspect]);

    // Define metaball data 
    const [metaballs, setMetaballs] = useState<MetaballProps[]>([]); 

    // Hardcoded found to be the edges of the camera view
    const maxX = 53; 
    const maxY = 27; 

    // Wait for component to mount before generating spheres
    useEffect(() => {
        const generateRandomMetaballs = () => { 
            const newBalls: MetaballProps[] = []; 
            const { innerWidth: width, innerHeight: height } = window; 

            // Then procedurally generate coordinates 
            for (let i = 0; i < count; i ++) {

                // Generate position structure
                const x = Math.random() * maxX - maxX/2; 
                const y = Math.random() * maxY - maxY/2; 
                const z = 0; 
                const position: [number, number, number] = [x, y, z];
                const keepoutRadius = Math.random() * 3; 

                // Assure that the ball is not too close to another center. 
                // If it is, regenerate it. 
                for (let j = 0; j < newBalls.length; j ++) {
                    const otherBall = newBalls[j]; 
                    const otherPosition = otherBall.position; 
                    const dx = x - otherPosition[0]; 
                    const dy = y - otherPosition[1]; 
                    const distance = Math.sqrt(dx*dx + dy*dy); 
                    if (distance < keepoutRadius) {
                        i --; 
                        continue; 
                    }
                }

                newBalls.push({ 
                    position: position, 
                    maxX: maxX, 
                    maxY: maxY,
                    maxRadius: keepoutRadius
                 });
            }
            setMetaballs(newBalls); 
        };

        // Then set the metaballs 
        generateRandomMetaballs(); 
    }, [count]); 

    // Now we can return the functional component
    return (
        <div className="canvas-container"> 
            <Canvas className="full-screen-canvas">
                <PerspectiveCamera
                    position={[0, 0, 20]} // Same as default
                    fov={75} // Can be adjusted
                    aspect={cameraAspect} // Adjust to your canvas size
                    near={0.1}
                    far={1000}
                    makeDefault // Makes this the default camera
                />
                <ambientLight /> 
                <pointLight position={[10, 10, 10]} />
                    {metaballs.map((ball, index) => (
                        <MetaballParent 
                        key={index}
                        metaballProps={ball}
                        />            
                    ))}
            </Canvas>
        </div>
    )
};

