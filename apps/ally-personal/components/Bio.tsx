import Image from 'next/image'
import React from 'react'

const Bio = () => {
  return (
    <section className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8 text-center">About Ally</h2>

      <div
        className="w-2/5 float-left mr-6 mb-4 max-sm:w-1/2 tooltip tooltip-bottom"
        data-tip="📸 Raven's Nest Photography"
      >
        <Image
          src="/images/all-girls-closeup-ABOUT.jpg"
          alt="Ally Hilgefort"
          className="rounded-lg shadow-xl"
          width={600}
          height={600}
        />
      </div>

      <p className="mb-4">
        Ally Hilgefort is a mom who believes the EPRD Board of Directors will
        benefit from varied perspectives, especially those of parents with kids
        still at home. Her determined 3yo and adventurous 7yo take after Ally’s
        passion for serious fun.
      </p>
      <p className="mb-4">
        Since embracing her mom role in the last 8ish years, Ally frequents
        local events, knows play spots and enrolls in all kinds of activities.
        She intimately understands the extreme amount of work it takes not only
        to coordinate and commit to those plans, but to actually pack the bags
        and wagons or strollers or even &ldquo;simply&rdquo; load up the car to
        go to a swim lesson.
      </p>
      <p className="mb-4">
        Her day-to-day as a mom has led to spinoff gigs like: Room Parent, PTA
        Member, and Yearbook Editor at Bergen Elementary. Evergreen Fire &
        Rescue “Ambassador” to her neighborhood. Design Review Committee
        Chairperson for her HOA. EPRD Aquatics Stakeholder, to help pinpoint
        priorities for the Buchanan pool expansion.
      </p>

      <p className="mb-4">
        Before mom-life, her professional resume includes a blend of
        communications expertise, marketing program management, and event
        experience. She earned her Bachelor&apos;s degree in Integrated
        Strategic Communications from the University of Kentucky, with a minor
        in Philosophy.
      </p>

      <p className="mb-4">
        In college she met her husband, Rob, and they looked forward to finding
        where they would make a home together. Ally and Rob knew they wanted
        their kids to one day grow up in a community with access to amazing
        natural elements offering outdoor activities galore. They also
        prioritized riding bikes, playground picnics, and other forms of
        recreation.
      </p>

      <p className="mb-4">
        “Evergreen is a dream of a place in and of itself, with our natural
        surroundings seeming downright surreal on a daily basis. Anyone would
        fall in love with one scenic drive. But when we realized EPRD existed in
        this space, too, we knew it was solidified- We&apos;d found the most
        perfect little spot on earth,” Ally explained.
      </p>

      <p className="mb-4">
        Thanks to making home in Evergreen, the Hilgefort’s hobbies are many.
        They enjoy hiking, biking, skiing, snowshoeing, backpacking, camping,
        playing disc golf, and of course, watching the kids sharpen skills in
        swim, dance, gymnastics, soccer, lacrosse, basketball, etc., etc., etc!
        Ally also loves a good town festival, like Foothills Fourth, Chili
        Cookoff, Hops Drops, and any other excuse for some outside gathering and
        family fun.
      </p>

      <p className="mb-4">
        Ally does not take for granted how groups like EPRD help build and
        encourage a community environment alongside Evergreen’s physical
        environment. She feels deeply invested in EPRD and their offerings and
        projects, because they foster that continued sense of community.
      </p>

      <p className="mb-4">
        Ally recognizes that Evergreen is not only an amazing place to raise a
        family, it is also a wonderful home for retirement…and everything in
        between!
      </p>

      <div
        className="w-3/5 ml-6 max-sm:float-none max-sm:w-full float-right mb-4 tooltip tooltip-bottom max-sm:flex max-sm:justify-center"
        data-tip="📸 Raven's Nest Photography"
      >
        <Image
          src="/images/family-rocks.jpg"
          alt="Ally Hilgefort"
          className="rounded-lg shadow-xl"
          width={800}
          height={400}
        />
      </div>

      <p className="mb-4">As a board member, Ally will:</p>

      <ul className="list-disc list-inside mb-4">
        <li>
          Keep all Evergreen neighbors in mind when contemplating projects,
          classes, events, and other offerings
        </li>
        <li>Remain focused on the improvements and projects in the works</li>
        <li>Bring various perspectives to the decision-making table</li>
      </ul>

      <p className="mb-4">
        Ally says, “We can make improvements for everyone in our community, but
        it&apos;s not easy for everyone in our community to actively be a part
        of those conversations. Voting for me for the EPRD board ensures we can
        make things happen for every member of our Evergreen community.”
      </p>
    </section>
  )
}

export default Bio
