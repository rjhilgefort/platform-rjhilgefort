import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Q&A',
  description: 'Questions and Answers from Ally Hilgefort',
}

// Raw Q&A data
const qnaDataRaw = [
  {
    question:
      'Please tell us about yourself and why you are running for the Board?',
    answer:
      "Hi! I'm Ally Hilgefort, and I'm the mom of a second grader and preschooler at Bergen, where I'm a PTA member, Room Parent, and the Yearbook Editor this year. My husband Rob and I moved to Evergreen exactly 4 hours ago - yesterday was actually our 4 year anniversary of moving into our house here, and we absolutely love it.\n\nWe're originally from the Northern Kentucky / Cincinnati tri-state area, but we always dreamed of planting roots in our own place - somewhere we could raise our kids with tons of outdoor natural activities, but with enough community to feel that sense of belonging and contribution.\n\nI'm running for the EPRD board because I'm passionate about what they do for our area- They provide opportunities of all kinds to the people here- they build up our community and I want to see that go even further.\n\nAbout a year ago my family attended the Walk-the-Park to see the Buchanan Improvement Plans, which motivated me to start coming to the monthly board meetings in September.\n\nThese projects in the works are important- they're going to impact our region, for generations - Not just in what they'll offer physically- courts, a pavilion, and so on- but in the programming possibilities these new spaces will allow for, and the opportunity to provide for even more people.\n\nI want to have an official voice at the table to bring perspective to the board in all of the decision making that we have in the years ahead, so that we can shape an even better Evergreen for everyone.",
  },
  {
    question:
      'What do you feel are the most important aspects of what EPRD provides to the Community?',
    answer:
      "While the rec centers and spaces for activity and growth in a variety of areas are incredibly valuable to have accessible here-  the MOST important thing EPRD does is actually helping to build our community itself, bringing people together for celebrations on the fourth of July, giving kids an after school play space together..\n\nGenerally offering us communal environments to be together here within our beautiful natural environment, letting us interact and grow friendships, partnerships.. All things that are beneficial to us collectively living here.\n\nNow that EPRD is working with Seniors4Wellness, they're going to increase socialization amongst our senior residents which does so much for their lives. I would love to see EPRD facilitate the same sort of socialization for new moms or parents of young babies. We're constantly hearing from people either new to the area, or new to parenthood, who are looking for others in that same spot of their lives, reaching out in attempt to share that experience.\n\nThe more EPRD can do for our community, to enhance our community, the better it is for evergreen as a whole. The more people are out together, the more likely they are to go visit our local businesses and be involved in other ways, making Evergreen an even more likely place for families to grow and for their kids to want to do the same when they're grown.",
  },
  {
    question:
      'How do you define your budget priorities when tough decisions have to be Made?',
    answer:
      "I think the most important thing to consider is what the people in Evergreen need, as a whole. And when it comes down to what EPRD is providing, the first check is to make sure the foundation is solid.\n\nAre there fixes needed with the current day-to-day or the existing facilities? If so, which fixes serve the most users? If things are running smoothly across the board, what improvements or additions can offer the most functionality for the most people?\n\nWe need to evaluate the payoffs and trade offs involved when making decisions, like, could it be valuable to have a detached field house pretty basically built, but providing a tremendous service to sports leagues desperately needing indoor play space.\n\nThere would be added daily costs to operating a separate facility, but could it still make sense, given the money that a structure like that could bring in? Let's lay it all out to see.\n\nBudget decisions need to find that right balance- the most good for the least amount, wherever possible. And taking care of what we already have, before building up from that foundation.",
  },
  {
    question:
      'If elected, how do you plan to stay engaged and listen to the community throughout your term? What are your ideas to encourage and promote resident Engagement?',
    answer:
      "Clear communication can go a long way when it comes to how the community engages with EPRD. I'm always out there looking for information, and there are some really cool offerings that just not enough people are aware of. I've always done as much as I could to spread the word about upcoming events or fun classes, and I would own that even more as a member of the board.\n\nSocial media and websites known for having all of the event information for an area, like My Mountain Town or Macaroni Kids, are a great way to get on people's radars. But I remember when we first moved to Evergreen, we got mailers from EPRD.\n\nThat was convenient, to be able to see the variety of options laid out in front of me. I'm sure we've veered away from that because of costs, but it might be worth reconsidering. I think having that physical reminder, something you can throw on a fridge or add to a real to-do pile that you have to deal with… Can sometimes do a better job of getting people in the door.\n\n\nI think at bare minimum, when EPRD is sharing something to social media, we have to include direct links to register. So many times, I'm interested in something I see advertised… But I can't just click to register. There's maybe a link to the home site, or maybe I have to enter the site on my own. And then I have to find a way to search for the thing I was excited about. This is something I brought up during public comment at a board meeting a few months ago, and to EPRD's credit, they are now starting to include registration links with some posts.\n\nThe registration system itself could use some sprucing up, though, to make it easier to see anything available to a particular age group, or on a particular afternoon of the week. Sometimes I'm just looking for anything I could schedule for my youngest daughter, during a time when my older daughter is already at Wulf for an activity. All of these ideas make access to EPRD offerings easier, which makes it easier for residents to engage.\n\nAnother way of providing ease of access to residents, is to offer a virtual option for attending monthly board meetings. This another topic that I stressed at November's board meeting. There was some reluctance from the board to agree to trialling a virtual option, and I believe my presence as a member of the public helped. I believe my presence also helped last month in March, when they voted whether to keep the virtual option. Being engaged, even by just eagerly nodding yes (since you're typically not allowed to speak outside of public comment) can really go a long way for speaking up- But again, if I had an official voice at that table, I could really speak for our community.\n\nAs far as listening to the community goes, I'd love to continue and broaden creating summits of voices coming together, like I'm currently organizing for parents and youth leaders. I've been gathering interest in participating in something like this, and a lot of people are eager to join. The idea is to bring people together to sit down with EPRD and brainstorm how best they can be served in a particular area. I'd love to keep working on holding other summits in other areas of focus, too.",
  },
  {
    question:
      'If someone came to you with a proposal to build a new public infrastructure, how would you evaluate whether or not that project was worth implementing?',
    answer:
      "Some of my first questions are, What would it offer to evergreen? How many people need this sort of thing? Can it be used in multiple ways, or does it serve one sector of our residents? If its use IS more narrow, are its cost and effort appropriate for the size of that sector?\n\nWhat sort of daily operational costs are we looking at going forward? What do we expect the maintenance to involve?\n\nAnd how big of a physical footprint are we talking? Where do they propose it go, and how would that area be affected? What environmental concerns are there? How would the elk and other animals interact with it? Is that area well-connected enough to promote the use of this new infrastructure?\n\nAnd yet, does something new in that area cause any downfall for whatever currently exists there? Are we taking down trees or adding unwanted busy-ness to an otherwise quiet residential area? Or maybe it is a quieter area but they're looking for something to go in nearby?\n\nIt all comes back to community. How is this project going to enhance Evergreen? If it can revitalize an area needing that jump, 'area' meaning the physical spot it would go OR 'area' meaning the activity space needing the infrastructure, then it's at least worth looking at.\n\nIf it can fill multiple voids in the community at once, tying various members of the community together for various purposes, connecting to its surroundings and working with that existing area, then it is a win all around and hopefully we can find the funding to make it work.",
  },
  {
    question:
      "If elected as an EPRD Board Member what are some recreational items/facilities that you believe are missing from EPRD's current lineup?  What are some ideas that you might propose that will benefit the Evergreen Community?",
    answer:
      "I'm going to focus on some kid ideas here because I think that's the best way to develop future great generations of Evergreen.\n\nI would love to see more baby and toddler classes available to Evergreen, at an affordable rate. Baby and me music circles or movement classes… There is a ton of potential for activities that parents can do with their little ones, in a structured atmosphere that motivates them to get out and engage with others. EPRD could facilitate those meetups so easily. It could honestly be as simple as providing the space and 'schedule' of a playdate. Giving some conversation topics.  There are specialists in our area eager to partner with EPRD and that feels like one of those wins we can't pass up.\n\nWe could really use more guided outdoor adventuring sessions for younger kids. There are some options once they turn 8, but so many parents of younger kids love to enroll them in a weekly hiking or biking class, or even educational outdoors classes.\n\nA couple of months ago, our Youth Advisory Board pretty clearly laid out the need for more indoor, low-cost activities for Evergreen teenagers. I was so impressed with their push for feedback from classmates, and with the conclusions and ideas they presented. That effort definitely deserves some payback on offerings. Again, this could be as simple as facilitating board game nights, for starters, or hosting other lower key hangouts.\n\nI'm excited about how much room for activity there will be with the new projects, and I have enough ideas to go for a while.. But I do have to get in one very specific proposal that I promised my 7-year-old. She knows a splash pad is in the works - we are ALL very excited about that - But she has a grand idea for that splash pad to have an octopus feature, where its tentacles would move and spray water - but she wants to make sure that water doesn't come out too hard, because that wouldn't be fun for the little kids.. and it should be fun for everyone.",
  },
]

// Helper function to format answer text into HTML paragraphs
const formatAnswerToHtml = (answerText: string): string => {
  // Replace literal \n with actual newlines before splitting
  const textWithNewlines = answerText.replace(/\n/g, '\n')
  return textWithNewlines
    .trim()
    .split(/\n\s*\n/) // Split by one or more escaped newlines (representing paragraphs)
    .map((paragraph) => `<p class="mb-4">${paragraph.trim()}</p>`) // Wrap each paragraph in <p> with margin-bottom
    .join('')
}

const Qa = () => {
  const processedQnaData = qnaDataRaw.map((item, index) => ({
    id: `qa-${index}`,
    question: item.question,
    answerHtml: formatAnswerToHtml(item.answer),
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      {' '}
      {/* Added more padding */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Q&A
      </h1>{' '}
      {/* Responsive title size, more margin */}
      <div className="space-y-3 max-w-4xl mx-auto">
        {' '}
        {/* Increased max-width, adjusted spacing */}
        {processedQnaData.map((item, index) => (
          <div
            key={item.id}
            className="collapse collapse-arrow bg-base-200 rounded-lg shadow"
          >
            {' '}
            {/* Adjusted rounding/shadow */}
            <input
              type="radio"
              name="qa-accordion"
              id={item.id}
              className="peer"
              defaultChecked={index === 0}
            />
            <label
              htmlFor={item.id}
              className="collapse-title text-lg md:text-xl font-semibold peer-checked:bg-primary peer-checked:text-primary-content cursor-pointer transition-colors duration-300 ease-in-out" // Added transition
            >
              {item.question}
            </label>
            {/* Apply transition to content visibility/height if possible with Tailwind/DaisyUI, otherwise use basic classes */}
            <div className="collapse-content bg-base-100 text-base-content peer-checked:border peer-checked:border-t-0 peer-checked:border-base-300">
              {' '}
              {/* Removed top border when open */}
              <div
                className="pt-4 pb-2 px-2 md:px-4"
                dangerouslySetInnerHTML={{ __html: item.answerHtml }}
              />{' '}
              {/* Added padding to content */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Qa
