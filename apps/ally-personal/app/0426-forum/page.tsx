'use client'

import React, { useState, useEffect } from 'react'

const qnaDataRaw = [
  {
    question:
      'Please tell us about yourself and why you are running for the Board?',
    answer:
      "Hi! I'm Ally Hilgefort, and I'm the mom of a second grader and preschooler at Bergen, where I'm a PTA member, Room Parent, and the Yearbook Editor this year. My husband Rob and I moved to Evergreen exactly 4 years ago - yesterday was actually our 4 year anniversary of moving into our house here, and we absolutely love it.\n\nWe're originally from the Northern Kentucky / Cincinnati tri-state area, but we always dreamed of planting roots in our own place - somewhere we could raise our kids with tons of outdoor natural activities, but with enough community to feel that sense of belonging and contribution.\n\nI'm running for the EPRD board because I'm passionate about what they do for our area- They provide opportunities of all kinds to the people here- they build up our community and I want to see that go even further.\n\nAbout a year ago my family attended the Walk-the-Park to see the Buchanan Improvement Plans, which motivated me to start coming to the monthly board meetings in September.\n\nThese projects in the works are important- they're going to impact our region, for generations - Not just in what they'll offer physically- courts, a pavilion, and so on- but in the programming possibilities these new spaces will allow for, and the opportunity to provide for even more people.\n\nI want to have an official voice at the table to bring perspective to the board in all of the decision making that we have in the years ahead, so that we can shape an even better Evergreen for everyone.",
  },
  {
    question:
      'What do you feel are the most important aspects of what EPRD provides to the Community?',
    answer:
      "While the rec centers and spaces for activity and growth in a variety of areas are incredibly valuable to have accessible here-  the MOST important thing EPRD does is actually helping to build our community itself, bringing people together for celebrations on the fourth of July, giving kids an after school play space together..\n\nGenerally offering us communal environments to be together here within our beautiful natural environment, letting us interact and grow friendships, partnerships.. All things that are beneficial to us collectively living here.\n\nNow that EPRD is working with Seniors4Wellness, they're going to increase socialization amongst our senior residents which does so much for their lives. I would love to see EPRD facilitate the same sort of socialization for new moms or parents of young babies. We're constantly hearing from people either new to the area, or new to parenthood, who are looking for others in that same spot of their lives, reaching out in attempt to share that experience.\n\nThe more EPRD can do for our community, to enhance our community, the better it is for evergreen as a whole. The more people are out together, the more likely they are to go visit our local businesses and be involved in other ways, making Evergreen an even more likely place for families to grow and for their kids to want to do the same when they're grown.",
  },
]

const formatAnswerToHtml = (answerText: string): string => {
  const textWithNewlines = answerText.replace(/\n/g, '\n')
  return textWithNewlines
    .trim()
    .split(/\n\s*\n/) // Split by one or more escaped newlines (representing paragraphs)
    .map((paragraph) => `<p class="mb-4">${paragraph.trim()}</p>`) // Wrap each paragraph in <p> with margin-bottom
    .join('')
}

const Qa = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const processedQnaData = qnaDataRaw.map((item, index) => ({
    id: `qa-${index}`,
    question: item.question,
    answerHtml: formatAnswerToHtml(item.answer),
  }))

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        04/26 Forum
      </h1>
      <div className="space-y-3 max-w-4xl mx-auto">
        {processedQnaData.map((item) => (
          <div
            key={item.id}
            className="collapse collapse-arrow bg-base-200 rounded-lg shadow"
          >
            <input
              type="checkbox"
              name="qa-accordion"
              id={item.id}
              className="peer"
            />
            <label
              htmlFor={item.id}
              className="collapse-title text-lg md:text-xl font-semibold peer-checked:bg-primary peer-checked:text-primary-content cursor-pointer transition-colors duration-300 ease-in-out" // Added transition
            >
              {item.question}
            </label>
            <div className="collapse-content bg-base-100 text-base-content peer-checked:border peer-checked:border-t-0 peer-checked:border-base-300">
              <div
                className="pt-4 pb-2 px-2 md:px-4"
                dangerouslySetInnerHTML={{ __html: item.answerHtml }}
              />
            </div>
          </div>
        ))}
      </div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 p-3 bg-primary text-primary-content rounded-full shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-opacity duration-300 ease-in-out z-50" // Added z-index
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Qa
