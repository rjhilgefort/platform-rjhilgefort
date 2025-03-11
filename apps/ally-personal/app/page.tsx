import { Metadata } from 'next'
// import postMetadata from '../utils/postMetadata'
import Hero from '../components/Hero'
import Bio from '../components/Bio'
import Gallery from '../components/Gallery'

export const metadata: Metadata = {
  title: 'Ally Hilgefort',
  description: 'EPRD Board Candidate',
  metadataBase: new URL('https://ally.hilgefort.me'),
  openGraph: {
    images: [{ url: '/opengraph-image.png' }],
  },
}

export default function Home() {
  // const metadata = postMetadata('content')

  return (
    <div className="w-full">
      <Hero />
      {/* <div className="px-5 xl:px-10"> */}
      <Bio />
      <Gallery />
      {/* <RecentBlogs posts={metadata} /> */}
      {/* <FeaturedPost posts={metadata} /> */}
      {/* <TopArticles posts={metadata} /> */}
      {/* <NewsletterCard /> */}
      {/* </div> */}
    </div>
  )
}
