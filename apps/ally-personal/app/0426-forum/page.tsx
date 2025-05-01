'use client'

import React, { useState } from 'react'
import Footer from '../../components/Footer'

interface Section {
  title: string
  content: string
}

const ForumPage = () => {
  const [activeTab, setActiveTab] = useState(0)

  const sections: Section[] = [
    {
      title: 'Introductory Statement',
      content: `As a committed member of our community, and as someone eager to share
her passion for EPRD, and explain why she believes she can better provide
perspective to the Board, Ally Hilgefort is so sorry she cannot be here with
you all this morning.
As a mom of a preschooler and second-grader, she unfortunately could not
cancel a long-awaited Mother-Daughter trip with her seven-year-old to the
'most magical place on Earth' - Although, to be honest, she would actually
argue that the most magical place is here in Evergreen.
While originally from the Cincinnati area, Ally and her husband always
dreamed of planting their own roots somewhere they could raise kids with
tons of outdoor natural activities, but with enough community to feel that
sense of belonging and contribution.
They moved into their home here four years ago, but Ally began dialing
herself in with EPRD nearly two years prior- that's how important
community-building groups are to her. She has long emailed feedback on
events and classes, taken their surveys, and generally rooted for their
success. Because their successes translate to our collective community's
benefit.
While the rec centers and spaces for activity and growth in a variety of
areas are incredibly valuable to have accessible here- the most important
thing EPRD does, is actually helping to build our community itself- bringing
people together for campouts on the fields, giving kids an after-school play
space together... Offering us communal environments to be together, here,
within our beautiful natural environment- letting us interact and grow
friendships, and partnerships.
We are so lucky to have a parks & rec group like EPRD, and Ally has loved
watching the evolution even over just the last few years- From event
cancellations coming out of Covid, with not enough registrations..
..To the actual addition of even more amazing events, like Frostival, and
giving back the community Fourth of July festival that had gone away.
..To seeing family and kids events sell out, with some expanding over
multiple date options- like this year's Haunted Glow experience.
.. To the announcement of consistently scheduled Parents Night Outssomething Ally suggested a few months ago. If families know there are
reliable options to schedule around, they'll take better advantage of all
EPRD attempts to provide. Parents Night Outs will now be every other
week, rotating between Buchanan and Wulf. It would still be great to see an
earlier time frame for those, but one thing at a time :)
Ally would also like to see playschool offered more, and advertised. Low
numbers led to the decrease in time that Playschool is actually available.
Leading up to those counts, though, parents had a hard time knowing if
they could rely on it. So they stopped considering it as an option, which is a
shame for the one thing available to kids 2 and under - a segment that
EPRD could be providing way more for, in the form of "baby and me" music
circles or similar classes for both caregivers & their young.
On the flip side of the youth spectrum, our teenagers need more indoor,
low-cost options in Evergreen. A member of the Youth Advisory Board
recently held a feedback session with classmates and presented findings to
the board- Which definitely deserves to be rewarded with more activities.
This could be as simple as an organized board game night as a designated
hangout. Or as involved as partnering with the Middle School to spruce up
their track and field space, creating more room for programming and play.
EPRD's recent partnership with "Seniors-for-Wellness" is a great example
of what can be done when we work together. They're helping to increase
socialization amongst our senior residents, which will do so much for their
lives. Ally believes similar collaborations can happen across the board for
our community.
Ally's running for the board because she's passionate about what they do
for our area- They provide opportunities of all kinds to the people here.
They build up our community, and she wants to see that go even further.
About a year ago, she and her family attended the "Walk-the-Park" event to
learn more about the Buchanan Plans, which motivated her to start
attending the monthly board meetings back in September.
In November, she encouraged the board to go back to offering a virtual
option for people to attend these meetings from home, and in March, she
further encouraged them to keep that virtual option going.
..That encouragement may have simply come from her silent head nods in
the audience, but she felt it was important to root for that service. Making
access to EPRD easier, makes it easier for residents to engage.
Experiencing these meetings as a member of the public inspired her to
strive for a position on the board, so she can more effectively advocate for
all of Evergreen.
The projects in the works are meaningful and will impact our region for
generations to come. Not just in what they'll offer physically- a pavilion,
courts, a playground and so on- but in the programming possibilities these
new spaces will allow for, and the opportunity to provide for even more
people.
While Ally has contributed to several areas of our community-
- PTA Member, Room Parent, and Yearbook Editor for Bergen Elementary..
- Fire Ambassador and Design Review Chair for her HOA..
- Co-founder of "The Trails Collective" - (working with champions of
Evergreen to keep her neighborhood in-the-know on potential Bergen
Meadow plans)..
… Ally is most excited to drive her energy even deeper into EPRD.
To be honest, she'll continue her involvement even if it's still from the
audience.
But she knows having an official voice at that table will bring perspective to
the board in all of the decision making that they have in the years ahead,
so that we can shape an even better Evergreen, for everyone.`,
    },
    {
      title: 'Closing Statement',
      content: `Ally Hilgefort is invested in EPRD, whether or not she's on the board. She
feels someone with her dedicated involvement can best serve the
community from the board itself, though. She wants to see Evergreen
continue to thrive, and EPRD can help achieve that goal.
The more EPRD can do for our community, to enhance our community, the
better it is for evergreen as a whole. The more people are out together, the
more likely they are to go visit our local businesses and be involved in other
ways, making Evergreen an even more likely place for families to grow, and
for their kids to want to do the same, when they're grown.
Ally is so appreciative of those who have worked for decades to shape the
Evergreen we have today. She has loved talking with who she feels are
some superheros of Evergreen- Commited community members who, over
the years, saved Noble Meadow, built us our Lake House, developed
Buchanan Rec Center, and contributed in countless ways we're all so
grateful for.
Ally aspires to continue those efforts and is already collaborating with some
of those town heroes. She would love the opportunity to work from the
Board of EPRD, learning even more and helping to shape an even better
Evergreen, for everyone.`,
    },
  ]

  const formatContent = (text: string) => {
    const paragraphs = text
      .split('\n')
      .reduce((acc: string[], line: string) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return [...acc, '']

        const lastItem = acc[acc.length - 1]
        if (
          !lastItem ||
          /[.!?]$/.test(lastItem) ||
          lastItem.trim() === '' ||
          lastItem.trim().startsWith('-') ||
          trimmedLine.startsWith('-')
        ) {
          return [...acc, trimmedLine]
        }
        return [...acc.slice(0, -1), `${lastItem} ${trimmedLine}`]
      }, [])
      .filter(Boolean)

    return paragraphs.map((paragraph: string, i: number) => (
      <p key={i} className={`${paragraph.startsWith('-') ? 'pl-4' : ''} mb-2`}>
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow max-w-4xl mx-auto px-4 py-8 w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Forum Updates</h1>
          <p className="text-center text-gray-600">
            Important community information and updates
          </p>
        </header>

        <div className="mb-6">
          <div className="flex border-b">
            {sections.map((section, index) => (
              <button
                key={index}
                className={`px-4 py-2 font-medium ${
                  activeTab === index
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            {sections[activeTab]?.title}
          </h2>
          <div className="prose max-w-none">
            {formatContent(sections[activeTab]?.content || '')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumPage
