import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bergen Meadow: A Community Vision',
  description: 'Help shape the future of the Bergen Meadow site.',
}

export default function Home() {
  const youtubeVideoId = 'CuVthbu_ehI'

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
            <h2 className="card-title text-3xl">Project Background & Status</h2>
            <div className="prose max-w-none">
              <p>
                I discovered from attending a board meeting of the Evergreen
                Park and Recreation District that a group was meeting on the
                disposition of Bergen Meadow Elementary School. Jenny Touhey and
                I met personally with a representative of the group on 3/31/25,
                and I invited her to speak to the The Trails HOA board.
              </p>
              <p>
                Here's a summary of what Coordinator Linda Kirkpatrick,
                Executive Director of the Evergreen Legacy Fund, presented to
                The Trails HOA board on 4/9/25:
              </p>
              <ul>
                <li>
                  In April of 2024, the Board of Education announced Bergen
                  Meadow was 1 of 19 properties to be disposed of. Their process
                  stated offering to municipalities first, then to the general
                  marketplace otherwise. Their plan to dispose of 4 properties
                  at a time took longer than anticipated.
                </li>
                <li>
                  Foothills Regional Housing (considered a special district with
                  a 45-year presence in Evergreen) had been formulating plans to
                  apply for acquisition of the 13 acres. EPRD pulled together
                  other special districts (Evergreen Fire and Evergreen Metro),
                  hoping to qualify as a quasi-municipality. The group invited
                  Foothills Regional Housing to the table, building a cohesive
                  approach rather than a competitive one, as no one group needed
                  13 acres. Initially, the process did not allow for
                  sub-dividing.
                </li>
                <li>
                  The group of 4 special districts, 6 nonprofit entities, and 1
                  architectural firm learned the existing building would likely
                  need to be razed due to environmental concerns.
                </li>
                <li>
                  Members of the group lobbied independently:
                  <ul>
                    <li>
                      to urge the BOE to move Bergen Meadow up on the list. and
                      to allow for Foothills Regional Housing and EPRD to
                      co-present, each bidding for a portion of the land
                    </li>
                    <li>
                      to familiarize Jeffco Commissioners of Evergreen's desire
                      to have this for community use
                    </li>
                  </ul>
                </li>
                <li>
                  On March 13, 2025, the BOE announced
                  <ul>
                    <li>
                      Bergen Meadow would be on the second set of 4 properties
                      to be sold as "surplus"
                    </li>
                    <li>
                      they would recognize Jefferson County as the municipal
                      entity with first right of refusal
                    </li>
                    <li>they would allow the land to be subdivided</li>
                  </ul>
                </li>
                <li>
                  On March 31, 2025, the Deputy County Manager asked to sit in
                  on the meeting of the Evergreen group to gather information on
                  how the community would use the 13 acres vs. how the county
                  might use it. The Evergreen group put together a case for
                  community use as follows:
                  <ul>
                    <li>
                      Senior Housing / Athletic Fields / Senior Services
                      <ul>
                        <li>
                          Foothills Regional Housing would acquire a portion of
                          the property on which to construct two 3-story
                          buildings, roughly on the same footprint as the
                          school. These buildings would be for senior housing
                          (rentals) to help fill a deficit of housing for the
                          senior population.
                        </li>
                        <li>
                          EPRD would acquire the rest of the property to include
                          the athletic fields, playground equipment, and
                          additional open space sufficient to construct a
                          community center or senior center in the future (the
                          building not necessarily owned and operated by EPRD).
                          This would include access roads and parking for
                          fields.
                        </li>
                        <li>
                          A place for senior services to help fill the
                          tremendous void created by the pullout of the Seniors
                          Resource Center in 2019.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  On April 14, 2025, the County Manager and representatives of
                  the BOE were to meet to discuss options. The Evergreen group
                  is optimistic that the county would suggest a way to broker
                  this on their behalf.
                </li>
                <li>
                  Everything depends on price tags that BOE puts on the
                  property....
                  <ul>
                    <li>
                      Foothills Regional Housing would need to acquire financing
                    </li>
                    <li>
                      EPRD board would need to approve the expenditure in the
                      midst of the expansion of Buchanan Park facilities
                    </li>
                  </ul>
                </li>
              </ul>
              <p>The BOD of The Trails seemed very receptive.</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            See the Vision
          </h2>
          <div className="rounded-box overflow-hidden shadow-lg bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full block"
              style={{ aspectRatio: '16 / 9' }}
            ></iframe>
          </div>
        </div>

        {/* <div className="mb-12">
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
        </div> */}

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
