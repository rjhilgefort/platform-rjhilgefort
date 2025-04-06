import { Metadata } from 'next'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Programs from '../components/Programs'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

export const metadata: Metadata = {
  title: 'Bright Future Child Enrichment | Florence, KY',
  description:
    'Bright Future Child Enrichment in Florence, KY provides quality childcare and early childhood education in a loving environment. Open Mon-Fri 6:30 AM - 6:00 PM.',
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
