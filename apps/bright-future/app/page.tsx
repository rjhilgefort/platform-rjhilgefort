import { Metadata } from 'next'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Programs from '../components/Programs'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

export const metadata: Metadata = {
  title: 'Bright Future Early Learning Center',
  description:
    'Providing quality early childhood education in a safe, nurturing environment where every child can thrive.',
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Programs />
      <Testimonials />
      <CTA />
    </>
  )
}
