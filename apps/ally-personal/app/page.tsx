import { Metadata } from 'next'
// import postMetadata from '../utils/postMetadata'
import Hero from '../components/Hero'
import Bio from '../components/Bio'

export const metadata: Metadata = {
  title: 'Ally Hilgefort',
  description: 'Welcome To My Site!',
}

export default function Home() {
  // const metadata = postMetadata('content')

  return (
    <div className="w-full">
      <Hero />
      <div className="px-5 xl:px-10">
        <Bio />
        {/* <RecentBlogs posts={metadata} /> */}
        {/* <FeaturedPost posts={metadata} /> */}
        {/* <TopArticles posts={metadata} /> */}
        {/* <NewsletterCard /> */}
      </div>
    </div>
  )
}
