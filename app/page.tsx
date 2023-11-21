import Image from 'next/image'
import { RenderStaticOrbs } from './components/AnimatedOrbs'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <RenderStaticOrbs />
      <h1 className="text-4xl font-bold text-center">To the MOOOOOOOooon...🚀</h1>
    </main>
  )
}
