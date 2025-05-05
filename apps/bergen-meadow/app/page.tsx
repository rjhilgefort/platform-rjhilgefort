import { Metadata } from 'next'
import Image from 'next/image'
import { FaMapPin, FaMountain, FaRegClock } from 'react-icons/fa'

export const metadata: Metadata = {
  title: "Bergen Meadow's Best Plan",
  description: 'Help shape the future of the Bergen Meadow site.',
}

export default function Home() {
  // const youtubeVideoId = 'cyybOFx4lkY' // first, rough video
  const youtubeVideoId = '5TqQko71DF0' // second, more polished

  return (
    <div className="bg-base-100">
      <div className="hero min-h-[50vh] bg-[url('/google-maps.jpeg')] bg-cover bg-center">
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-lg">
            <h1 className="mb-5 text-6xl font-bold [text-shadow:-3px_-3px_0_#000,3px_-3px_0_#000,-3px_3px_0_#000,3px_3px_0_#000,0px_-3px_0_#000,0px_3px_0_#000,-3px_0px_0_#000,3px_0px_0_#000]">
              The Future of Bergen Meadow
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="stats shadow stats-vertical lg:stats-horizontal w-full mb-12">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaMapPin className="text-3xl" />
            </div>
            <div className="stat-title">The Land</div>
            <div className="stat-value">13 Acres</div>
            <div className="stat-desc">Former elementary school site</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaMountain className="text-3xl" />
            </div>
            <div className="stat-title">Our Goal</div>
            <div className="stat-value">Keep It Community</div>
            <div className="stat-desc">Recreation, nature, gathering</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <FaRegClock className="text-3xl" />
            </div>
            <div className="stat-title">Current Phase</div>
            <div className="stat-value">Planning</div>
            <div className="stat-desc">Awaiting Municipal Decision</div>
          </div>
        </div>

        <div className="card lg:card-side bg-base-200 shadow-xl mb-12">
          <div className="card-body">
            <h2 className="card-title text-3xl">
              What's Happening with Bergen Meadow?
            </h2>
            <div className="prose max-w-none">
              <p>
                As homeowners in the Trails at Hiwan neighborhood, this is a
                question we have wondered and worried about for a couple of
                years now. Many of us have backyards that flow into the Bergen
                Meadow property, and many of us look over to that area from
                various windows or spots of our yards. More importantly, many
                love the open space and community use provided by the fields and
                playground at Bergen Meadow.
              </p>
              <p>
                This spot is also so incredibly centrally located- convenient to
                the fire department, middle school, restaurants, grocery and
                recreational activities- that we hope its future use serves as
                an asset to our community, as the elementary school previously
                had.
              </p>
              <p>
                Trails neighbors{' '}
                <a
                  href="https://eprdally.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ally Hilgefort
                </a>{' '}
                and Jenny Touhey recently heard an exciting potential plan for
                the Bergen Meadow Property, and they're eager to spread the
                word.
              </p>
              <p>
                From attending a board meeting of the Evergreen Park and
                Recreation District (EPRD), Ally discovered that a group was
                meeting on the disposition of the Bergen Meadow Elementary
                School. This coalition of Evergreen groups sounded promising and
                uplifting, that so many entrenched residents of our community
                had already been working toward a common goal.
              </p>
              <p>
                Jenny and Ally met personally with a representative of the group
                on 3/31/25, and subsequently invited her to speak to the The
                Trails HOA board. The following outlines that conversation and
                what The Trails Collective believes to be Bergen Meadow's Best
                Plan.
              </p>
            </div>
          </div>
        </div>

        <div
          className="mb-12 tooltip tooltip-bottom flex justify-center"
          data-tip={
            "📸 Jenny, Linda, and Ally chat from Jenny's backyard about the Bergen Meadow property, shown immediately behind them."
          }
        >
          <Image
            src="/people-1.jpg"
            alt="Community members discussing plans"
            className="rounded-box shadow-lg w-full h-auto object-contain max-w-3xl"
            width={4032}
            height={3024}
          />
        </div>

        <div className="card lg:card-side bg-base-200 shadow-xl mb-12">
          <div className="card-body">
            <div className="prose max-w-none">
              <h2 className="card-title text-3xl">
                Project Background & Status
              </h2>
              <p>
                Here's a summary of what Coordinator Linda Kirkpatrick,
                Executive Director of the Evergreen Legacy Fund, presented to
                The Trails HOA board on 4/9/25:
              </p>
              <ul>
                <li>
                  In April of 2024, the Board of Education (BOE) announced
                  Bergen Meadow was 1 of 19 properties to be disposed of. Their
                  process started offering to municipalities first, then to the
                  general marketplace otherwise. Their plan to dispose of 4
                  properties at a time took longer than anticipated.
                </li>
                <li>
                  Foothills Regional Housing (considered a special district with
                  a 45-year presence in Evergreen) had been formulating plans to
                  apply for acquisition of Bergen Meadow's 13 acres. EPRD pulled
                  together other special districts (Evergreen Fire and Evergreen
                  Metro), hoping to qualify as a quasi-municipality. The group
                  invited Foothills Regional Housing to the table, building a
                  cohesive approach rather than a competitive one, as no one
                  group needed 13 acres. Initially, the process did not allow
                  for sub-dividing.
                </li>
                <li>
                  The group of 4 special districts, 6 nonprofit entities, and 1
                  architectural firm learned the existing building would likely
                  need to be razed due to environmental concerns.
                </li>
                <li>
                  Members of the group lobbied independently: to urge the BOE to
                  move Bergen Meadow up on the list and to allow for Foothills
                  Regional Housing and EPRD to co-present, each bidding for a
                  portion of the land to familiarize Jeffco Commissioners of
                  Evergreen's desire to have this for community use
                </li>
                <li>
                  On March 13, 2025, the BOE announced:
                  <ul>
                    <li>
                      Bergen Meadow would be on the second set of 4 properties
                      to be sold as "surplus"
                    </li>
                    <li>
                      They would recognize Jefferson County as the municipal
                      entity with first right of refusal
                    </li>
                    <li>They would allow the land to be subdivided</li>
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
              <p>The Trails HOA Board seemed very receptive.</p>

              <h2 className="card-title text-3xl mt-6">
                Thoughts from The Trails Collective
              </h2>
              <p>
                We Trails neighbors love this notion- A multi-generational
                community space, where seniors have access to trails nearby and
                entertainment in the form of kids' sports happening on the
                fields. Where middle schoolers and neighbors could volunteer to
                help seniors with their gardens, or even just spend time
                socializing. Where children can still play, and where neighbors
                can still look out onto the fields.
              </p>
              <p>
                We love that the community would not lose the fields and open
                space, and that the new structure(s) would aim to remain on the
                current building's footprint, and just about one level higher
                than the old school. We love that the new structure would offer
                a more feasible living option for more senior residents of
                Evergreen, to keep those valuable members of our community right
                here at home.
              </p>
              <p>
                The Trails Collective - friends and neighbors in support of
                Bergen Meadow's best plan - hopes this vision comes to life, as
                this collaboration would keep the property community, generally,
                and also create a wonderful new senior community for Evergreen.
              </p>
              <p>We hope this potential plan excites you, too!</p>
              <p>Thanks,</p>
              <p>
                Trails Collective Founders, Jenny Touhey &{' '}
                <a
                  href="https://eprdally.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ally Hilgefort
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            See the Vision
          </h2>
          <div className="rounded-box overflow-hidden shadow-lg bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
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

        {/* <div className="card lg:card-side bg-base-200 shadow-xl mb-12">
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
        </div> */}
      </div>

      <footer className="footer footer-center p-6 bg-base-300 text-base-content">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - The Trails Collective -
            Friends & Neighbors in Support of Bergen Meadow's Best Plan.
          </p>
        </aside>
      </footer>
    </div>
  )
}
