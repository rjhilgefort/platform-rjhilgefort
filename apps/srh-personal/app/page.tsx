import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Timeline from '../components/Timeline'
import Skills from '../components/Skills'
import Education from '../components/Education'
import Volunteering from '../components/Volunteering'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Timeline />
        <Skills />
        <Education />
        <Volunteering />
      </main>
      <Footer />
    </div>
  )
}
