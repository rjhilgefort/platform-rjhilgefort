import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bergen Meadow: A Community Vision',
  description: 'Help shape the future of the Bergen Meadow site.',
}

export default function Home() {
  const youtubeVideoId = 'YOUR_YOUTUBE_VIDEO_ID'

  return (
    <div className="bg-base-100">
      <div
        className="hero min-h-[50vh]"
        style={{
          backgroundImage:
            'url(https://via.placeholder.com/1500x500.png?text=Mountain+Meadow+View)',
        }}
      >
        <div className="hero-overlay bg-black bg-opacity-50"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-6xl font-bold">
              The Future of Bergen Meadow
            </h1>
            <p className="mb-5 text-xl">
              Envisioning a vibrant community space in harmony with nature.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="stats shadow stats-vertical lg:stats-horizontal w-full mb-12">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
            </div>
            <div className="stat-title">The Land</div>
            <div className="stat-value">XX Acres</div>
            <div className="stat-desc">Former elementary school site</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Our Goal</div>
            <div className="stat-value">Community Hub</div>
            <div className="stat-desc">Recreation, nature, gathering</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Current Phase</div>
            <div className="stat-value">Planning</div>
            <div className="stat-desc">Gathering community input</div>
          </div>
        </div>

        <div className="card lg:card-side bg-base-200 shadow-xl mb-12">
          <div className="card-body">
            <h2 className="card-title text-3xl">A Unique Opportunity</h2>
            <div className="prose max-w-none">
              <p>
                The closure of the Bergen Meadow Elementary School left a
                significant plot of land idle. Our community group sees this as
                a chance to create something truly special – a space that
                reflects our mountain values, provides needed recreational
                opportunities, and serves as a central gathering point. Imagine
                walking trails, picnic areas, a community garden, and spaces for
                outdoor events, all while preserving the natural character of
                the meadow and respecting the surrounding environment, including
                the local elk population.
              </p>
              <p>
                Replace this with more detailed text about the project's vision
                and background.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            See the Vision
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-box overflow-hidden shadow-lg bg-black">
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

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Concept Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img
              src="https://via.placeholder.com/600x400.png?text=Trail+Concept"
              alt="Concept Image 1"
              className="rounded-box shadow-md w-full h-auto"
            />
            <img
              src="https://via.placeholder.com/600x400.png?text=Gathering+Area"
              alt="Concept Image 2"
              className="rounded-box shadow-md w-full h-auto"
            />
          </div>
        </div>

        <div className="card lg:card-side bg-base-200 shadow-xl mb-12">
          <div className="card-body">
            <h2 className="card-title text-3xl">How You Can Help</h2>
            <div className="prose max-w-none">
              <p>
                This project is driven by the community, for the community. We
                are currently in the planning phase and actively seeking input,
                ideas, and support from residents like you. Your voice is
                crucial in shaping Bergen Meadow's future.
              </p>
              <ul>
                <li>Attend upcoming community meetings (Dates TBD).</li>
                <li>
                  Share your ideas and feedback via our contact form [Link/Info
                  Needed].
                </li>
                <li>Spread the word to your neighbors.</li>
                <li>Volunteer for planning committees [Link/Info Needed].</li>
              </ul>
              <p>
                Add more specific calls to action, contact details, or links to
                surveys/forms.
              </p>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">Share Your Ideas</button>
              <button className="btn btn-ghost">Learn More</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer footer-center p-6 bg-base-300 text-base-content">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - Bergen Meadow Community
            Group - Preserving our space, together.
          </p>
        </aside>
      </footer>
    </div>
  )
}
