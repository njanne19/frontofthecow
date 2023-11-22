'use client'; 

import React, { useRef, useState, useEffect } from 'react' 
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'; 
import { Physics, RigidBody, BallCollider } from '@react-three/rapier'
import { MarchingCubes, MarchingCube } from '@react-three/drei'
import * as THREE from 'three' 

function MetaballPiece(props: any) { 
    // This reference will give us direct access to the mesh 
    const meshRef = useRef()

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false) 
    const [active, setActive] = useState(false) 

    // Subscribe this component to the render-loop, rotate the mesh every frame 
    useFrame((state, delta) => (meshRef.current.rotation.x += delta)) 

    return (
            <mesh
                {...props} 
                ref={meshRef} 
                scale={active ? 1.5 : 1} 
                onClick={(event) => setActive(!active)}
                onPointerOver={(event) => setHover(true)}
                onPointerOut={(event) => setHover(false)}>
                <sphereGeometry args={[1, 32, 16]} /> 
                <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} /> 
            </mesh> 
    )
}


// Interface definitions for intermediate pieces of metaball generation 
// MetaballProps are the properties passed onto a single metaball functional component 
interface MetaballProps { 
    position: [number, number, number]; 
}

// MetaballsGeneratorProps are the properties passed to the generator 
// of (many) metaballs. 
interface MetaballsGeneratorProps {
    count: number
}

export const Metaballs: React.FC<MetaballsGeneratorProps> = ({ count } : { count: number }) => {
    // Camera aspect ratio changes 
    const [cameraAspect, setCameraAspect] = useState(1);

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
    }, []);

    // Define metaball data 
    const [metaballs, setMetaballs] = useState<MetaballProps[]>([]); 

    // Wait for component to mount before generating spheres
    useEffect(() => {
        const generateRandomMetaballs = () => { 
            const newBalls = []; 
            const { innerWidth: width, innerHeight: height } = window; 

            // Then procedurally generate coordinates 
            for (let i = 0; i < count; i ++) {
                const x = Math.random() * 5 - 5/2; 
                const y = Math.random() * 5 - 5/2; 
                const z = 0; 
                newBalls.push({ position: [x, y, z] });
            }

            console.log("New Ball Positions: ", newBalls); 

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
                    <MetaballPiece key={index} position={ball.position} />
                ))}
            </Canvas>
        </div>
    )
};

