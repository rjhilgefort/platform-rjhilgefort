import { Metadata } from 'next'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Programs from '../components/Programs'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

export const metadata: Metadata = {
  title: 'Bright Future Preschool | Erlanger, KY',
  description:
    'Bright Future Preschool in Erlanger, KY provides quality childcare and early childhood education in a loving environment.',
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
