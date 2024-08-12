'use client'; 

import React, { useState, useEffect, use } from 'react' 
import styles from './MetaBalls.module.css'; 
import { Properties } from 'csstype';


// Defines interface for calling the metaball generator
// Generator props are passed into the parent function and describe
// how metaballs should be initially generated. After this, 
// then each metaball has its own props (see below)
interface MetaballGeneratorProps {
    filenames: string[], // Files to use as cowspots
    numMetaballs: number, // Total number of balls
    generationOrder: string // How to sample cowspot svg files, default ('random') 
}

// Define interface for a single metaball 
interface MetaballProps {
    spotFile: string,
    left: number, 
    top: number, 
    size: number, 
    initialLeft: number, 
    initialTop: number, 
    velocity: number
}

// Define a function that generates initial metaball props
// This is called in the parent page to ensure that props are agreed upon 
// between server and client 
function generateInitialMetaballs(props: MetaballGeneratorProps): MetaballProps[] {

    let metaballPropsList: MetaballProps[] = []; 

    // Decompose the props, generate a metaball for each. 
    for (let i = 0; i < props.numMetaballs; i++) { 
        
        // Generate a random index for the filenames 
        const randomIndex = Math.floor(Math.random() * props.filenames.length); 

        // Then generate a random left and top position 
        const randomLeft = Math.floor(Math.random() * 100); 
        const randomTop = Math.floor(Math.random() * 100); 

        // Then generate a random size 
        const randomSize = Math.floor(Math.random() * 100); 

        // Then generate a random velocity 
        const randomVelocity = Math.floor(Math.random() * 10); 

        // Then generate the metaball props 
        const metaballProps: MetaballProps = {
            spotFile: props.filenames[randomIndex], 
            left: randomLeft, 
            top: randomTop, 
            size: randomSize, 
            initialLeft: randomLeft, 
            initialTop: randomTop, 
            velocity: randomVelocity
        }

        // Then push the metaball props onto the list 
        metaballPropsList.push(metaballProps); 

    }

    return metaballPropsList;

    // return [
    //     {spotFile: "/cowspots/CowSpot1.svg", left: 30, top: 50, size: 200, initialLeft: 30, initialTop: 50, velocity: 1},
    //     {spotFile: "/cowspots/CowSpot1.svg", left: 50, top: 50, size: 200, initialLeft: 50, initialTop: 50, velocity: -1}
    // ];
}

// Define a function that updates the metaball (moves it on the screen)
function updateMetaballs(metaballPropsList: MetaballProps[]) {
    return metaballPropsList.map((metaballProps) => {

        if (metaballProps.left > metaballProps.initialLeft + 10 || metaballProps.left < metaballProps.initialLeft - 10) {
            metaballProps.velocity = -1 * metaballProps.velocity; 
        }

        // Then update position 
        metaballProps.left += metaballProps.velocity * (1/50);

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
            <img src={props.spotFile} />
        </div>
    );
}

// Parent component to be rendered 
const Metaballs: React.FC<MetaballGeneratorProps> = (props) => {

    // Set up initial state for metaballs
    const [metaballPropsList, setMetaballPropsList] = useState<MetaballProps[]>(generateInitialMetaballs(props));

    // Then add the useEffect hook to set an interval to update everyone's properties 
    // This function is called when the component is mounted. 
    useEffect(() => {

        // I expect this to be ran once, when the component is mounted.
        console.log("Inside metaball generator!");
        console.log("Props: ", props.filenames);

        // Also display initial props in console
        console.log("Initial metaball props: ", metaballPropsList);

        const interval = setInterval(() => {
            setMetaballPropsList(
                updateMetaballs(metaballPropsList)
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

// Named export for the interface 
export type { MetaballGeneratorProps }; 