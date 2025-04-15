import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bergen Meadow Community Project',
  description: 'Learn about the future plans for the Bergen Meadow site.',
}

export default function Home() {
  const youtubeVideoId = 'YOUR_YOUTUBE_VIDEO_ID'

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="hero min-h-[40vh] bg-base-200 rounded-box mb-8"
        style={{
          backgroundImage:
            'url(https://via.placeholder.com/1200x400.png?text=Bergen+Meadow+Concept)',
        }}
      >
        <div className="hero-overlay bg-opacity-60 rounded-box"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Revitalize Bergen Meadow
            </h1>
            <p className="mb-5">
              Join us in transforming the former elementary school site into a
              vibrant community space.
            </p>
          </div>
        </div>
      </div>

      <div className="prose lg:prose-xl max-w-none mb-8">
        <h2>Our Vision</h2>
        <p>
          The Bergen Meadow site, once home to our beloved elementary school,
          presents a unique opportunity for our community. We envision a space
          that brings people together, promotes recreation, and preserves the
          natural beauty of the area. Insert your introductory text here,
          explaining the background and the goals of the project.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Project Overview Video
        </h2>
        <div className="aspect-w-16 aspect-h-9 rounded-box overflow-hidden shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card bg-base-100 shadow-xl image-full">
          <figure>
            <img
              src="https://via.placeholder.com/600x400.png?text=Proposed+Feature+1"
              alt="Concept Image 1"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Proposed Feature 1</h2>
            <p>Description of the first proposed feature or area.</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl image-full">
          <figure>
            <img
              src="https://via.placeholder.com/600x400.png?text=Proposed+Feature+2"
              alt="Concept Image 2"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Proposed Feature 2</h2>
            <p>Description of the second proposed feature or area.</p>
          </div>
        </div>
      </div>

      <div className="prose lg:prose-xl max-w-none mb-8">
        <h2>Get Involved</h2>
        <p>
          We need your support to make this vision a reality. Learn more about
          the specific proposals, upcoming community meetings, and how you can
          contribute. Add more details about the plan, next steps, or how people
          can contact the group or show support.
        </p>
      </div>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content rounded-box">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            Bergen Meadow Community Group
          </p>
        </aside>
      </footer>
    </div>
  )
}
