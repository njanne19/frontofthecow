'use client'; 

import React, { useState, useEffect } from 'react' 
import styles from './MetaBalls.module.css'; 
import { Properties } from 'csstype';


// Defines interface for calling the metaball generator
// Generator props are passed into the parent function and describe
// how metaballs should be initially generated. After this, 
// then each metaball has its own props (see below)
export interface MetaballGeneratorProps {
    filenames: string[], // Files to use as cowspots
    numMetaballs: number, // Total number of balls
    generationOrder: string // How to sample cowspot svg files, default ('random') 
}

// Define interface for a single metaball 
export interface MetaballProps {
    spotFile: string,
    left: number, 
    top: number, 
    size: number, 
    initialLeft: number, 
    initialTop: number, 
    velocityX: number, 
    velocityY: number
}

// Define a function that updates the metaball (moves it on the screen)
function updateMetaballs(metaballPropsList: MetaballProps[]) {
    return metaballPropsList.map((metaballProps) => {

        // Check for horizontal wall collisions (left and right)
        if (metaballProps.left > 100 || metaballProps.left < 0) {
            metaballProps.velocityX = -1.0 * metaballProps.velocityX; // reverse and slow down velocity
        }

        // Check for vertical wall collisions (top and bottom)
        if (metaballProps.top > 100 || metaballProps.top < 0) {
            metaballProps.velocityY = -1.0 * metaballProps.velocityY; // reverse and slow down velocity
        }

        // Update positions
        metaballProps.left += metaballProps.velocityX * (1/50);
        metaballProps.top += metaballProps.velocityY * (1/50);

        if (Math.abs(metaballProps.velocityX) <= 0.1 || Math.abs(metaballProps.velocityY) <= 0.1) {
            metaballProps.velocityX = Math.random() * 3 + 0.1; 
            metaballProps.velocityY = Math.random() * 3 + 0.1;
        }

        return metaballProps;
    });
}

// Child componet (each individual ball)
const Metaball: React.FC<MetaballProps> = (props) => {

    // const style: Properties ={
    //     position: 'fixed', 
    //     left: `${props.left}%`, 
    //     top: `${props.top}%`,
    //     width: `${props.size}px`,
    //     height: `${props.size}px`,
    //     borderRadius: '50%', 
    //     backgroundColor: 'black'
    // }

    const style: Properties ={
        position: 'fixed', 
        left: `${props.left}%`, 
        top: `${props.top}%`,
        width: `${props.size}px`,
        height: `${props.size}px`,
    }

    return (
        <div style={style}>
            <img src={props.spotFile} draggable={false} />
        </div>
    );
}



interface MetaballsProps { 
    initialMetaballPropsList: MetaballProps[]; 
}

// Parent component to be rendered 
const Metaballs: React.FC<MetaballsProps> = ({ initialMetaballPropsList }) => {

    // Set up initial state for metaballs
    const [metaballPropsList, setMetaballPropsList] = useState<MetaballProps[]>(initialMetaballPropsList);

    // Then add the useEffect hook to set an interval to update everyone's properties 
    // This function is called when the component is mounted. 
    useEffect(() => {

        console.log("Prop list: ", metaballPropsList);

        const interval = setInterval(() => {
            setMetaballPropsList(
                (prevPropsList) => updateMetaballs(prevPropsList)
            );
        }, Math.floor(1/60 * 1000));

        return () => clearInterval(interval); 
    }, []);

    // Now we can return the functional component
    // Generate metaballs one-by-one based on props
    return (
        <div className={styles.outerMetaBallsContainer}>
            <div className={styles.innerMetaBallsContainer}>
                {metaballPropsList.map((metaballProps, index) => {
                    return (
                        <Metaball key={index} {...metaballProps}/>
                    );
                })}
            </div>
        </div>
    )
};

// Default export for the functional component 
export default Metaballs;
