import Image from 'next/image'
import Metaballs from './components/MetaBallsAttempt2'
import { MetaballGeneratorProps } from './components/MetaBallsAttempt2';
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


export default async function Home() {

  // Before we call the Metaballs component below, we need 
  // to generate some props for it. 
  const propsForMetaballs: MetaballGeneratorProps = {
    filenames: getCowSpotFiles(cowSpotsFolder), 
    numMetaballs: 1, 
    generationOrder: 'random'
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Metaballs {...propsForMetaballs}/>
      <div className="overlay-content"> 
        <h1 className="text-4xl font-bold text-center">Test🚀</h1>
      </div> 
    </main>
  )
}
