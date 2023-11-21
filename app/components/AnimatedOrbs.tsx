'use client'; 

import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web'; 

// Define interface for an orb 
interface Orb {
    id: number;
    size: number;
    x: number;
    y: number;
}

export function AnimatedOrb( { style }: { style: any }) {
    return <animated.div style={style} className="orb" />; 
}

const generateRandomOrbs = (count: any) => { 
    return Array.from({ length: count }, () => ({
        id: Math.random(), 
        size: Math.random() * 100, // Random size between 0 and 100
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight
    }))
}

export function RenderStaticOrbs() { 
    const [orbs, setOrbs] = useState<Orb[]>([]); 

    useEffect(() => {
        setOrbs(generateRandomOrbs(10)); 
    }, []); // Generate 10 random orbs 

    return (
        <div>
            {orbs.map((orb) => (
                <AnimatedOrb
                    key={orb.id}
                    style={{
                        left: orb.x, 
                        top: orb.y, 
                        width: orb.size, 
                        height: orb.size,
                    }}
                /> 
            ))}
        </div> 
    )
}
