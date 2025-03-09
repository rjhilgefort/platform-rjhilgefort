import Image from 'next/image'
import React from 'react'

const Bio = () => {
  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-center">About Ally</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex-shrink-0">
          <Image
            src="/images/ally-bio-pick.png"
            alt="Ally Hilgefort"
            className="rounded-lg shadow-md w-full aspect-square object-cover"
            width={300}
            height={300}
          />
        </div>

        <div className="md:w-2/3">
          <p className="mb-4">
            Ally Hilgefort is a mom who believes the EPRD Board of Directors
            will benefit from varied perspectives, especially those of parents
            with kids still at home. Since embracing her mom role in the last 8
            years with her 7yo and 3yo, Ally frequents local events, knows play
            spots, enrolls in activities, and understands the tricky logistics
            and planning often required to make all that fun happen.
          </p>

          <p className="mb-4">
            Her day-to-day as a mom has led to spinoff gigs like Room Parent,
            PTA Member, Bergen Elementary Yearbook Editor, Evergreen Fire &
            Rescue "Ambassador" to her neighborhood, Design Review Committee
            Chairperson for her HOA, and EPRD Aquatics Stakeholder, to help
            pinpoint priorities for the Buchanan pool expansion.
          </p>

          <p className="mb-4">
            Before mom-life, her professional resume includes a blend of
            communications expertise, marketing program management, event
            experience, and a Bachelor&apos;s degree in Integrated Strategic
            Communications from the University of Kentucky, with a minor in
            Philosophy.
          </p>

          <p className="mb-4">
            With dedicated groups like EPRD existing in Evergreen, encouraging a
            community environment alongside a surreal natural environment, Ally
            and her husband know this is the perfect place to grow their family.
            The Hilgeforts love to camp with their teardrop, hike, ski, bike,
            backpack, play disc golf, and of course take advantage of town
            festivals and other fun local opportunities.
          </p>

          <p className="mb-4">
            Ally is excited to join the EPRD board to enhance and increase those
            opportunities for everyone in Evergreen by keeping all community
            members in mind when contemplating projects, programming, events,
            and other offerings. Bringing various perspectives to the
            decision-making table creates the best versions of the current
            Improvement Projects and Plans, which are important and impactful
            additions to Evergreen for years to come.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Bio
