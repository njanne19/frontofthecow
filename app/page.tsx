import Image from 'next/image'
import { Metaballs } from './components/ThreeDemo'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Metaballs count={10}/>
      <div className="overlay-content"> 
        <h1 className="text-4xl font-bold text-center">To the MOOOOOOOooon...🚀</h1>
      </div> 
    </main>
  )
}
