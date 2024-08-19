import Image from 'next/image'
import Metaballs, { MetaballGeneratorProps, MetaballProps } from './components/MetaBallsAttempt2';
import fs from 'fs'; 
import path from 'path'; 

const cowSpotsFolder = 'cowspots'; 

export function getCowSpotFiles(folder: string) {
  const directory = path.join(process.cwd(), 'public', folder)
  const filenames = fs.readdirSync(directory); 

  // Add '/cowspots/' to each filename 
  filenames.forEach((filename, index) => {
    filenames[index] = '/' + cowSpotsFolder + '/' + filename; 
  });
  
  // Filter out non-svg files if necessary 
  const svgFiles = filenames.filter((file) => file.endsWith('svg')); 

  // Then return files 
  return svgFiles;
}

// Define a function that generates initial metaball props
// This is called in the parent page to ensure that props are agreed upon 
// between server and client 
function createInitialMetaballs(props: MetaballGeneratorProps): MetaballProps[] {

  let metaballPropsList: MetaballProps[] = []; 

  // Decompose the props, generate a metaball for each. 
  for (let i = 0; i < props.numMetaballs; i++) { 
      
      // Generate a random index for the filenames 
      const randomIndex = Math.floor(Math.random() * props.filenames.length); 

      // Then generate a random left and top position 
      const randomLeft = Math.floor(Math.random() * 100 - 50); 
      const randomTop = Math.floor(Math.random() * 100 - 50); 

      // Then generate a random size 
      const randomSize = Math.random() * 700 + 400; 

      // Then generate a random velocity 
      const randomVelocityX = Math.random() * 3 + 0.1; 
      const randomVelocityY = Math.random() * 3 + 0.1;

      console.log("Generating random velocity x", randomVelocityX);
      console.log("Generating random velocity y", randomVelocityY);

      // Then generate the metaball props 
      const metaballProps: MetaballProps = {
          spotFile: props.filenames[randomIndex], 
          left: randomLeft, 
          top: randomTop, 
          size: randomSize, 
          initialLeft: randomLeft, 
          initialTop: randomTop, 
          velocityX: randomVelocityX, 
          velocityY: randomVelocityY, 
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


export default async function Home() {

  const metaballGeneratorProps: MetaballGeneratorProps = {
      filenames: getCowSpotFiles(cowSpotsFolder), 
      numMetaballs: 15, 
      generationOrder: 'random'
  }

  const metaballPropsList : MetaballProps[] = createInitialMetaballs(metaballGeneratorProps);

  return (
    <main className="relative w-full h-screen">
      <Metaballs initialMetaballPropsList={metaballPropsList} />
      <div className="overlay-content absolute inset-0 flex justify-center items-center text-center "> 
        <div className="max-w-full max-h-fullbg-opacity-100 bg-white">
          <h1 className="text-4xl font-bold">Welcome to Cow2k</h1>
          <h2 className="text-3xl font-bold">A one of a kind hobby rocket organization.</h2>
        </div>
      </div> 
    </main>
  )
}
