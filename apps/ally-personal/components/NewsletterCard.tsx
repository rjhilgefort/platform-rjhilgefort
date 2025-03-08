import Image from 'next/image'
import React from 'react'

const NewsletterCard = () => {
  return (
    <div className="flex items-center py-14">
      <div className="card image-full">
        <Image
          src="https://images.unsplash.com/photo-1637825891028-564f672aa42c?q=80&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          height={500}
          width={1900}
          alt="newsletter"
          className="object-cover h-56 md:h-72 lg:h-96 rounded-2xl"
        />

        <div className="card-body flex justify-center">
          <div className="flex md:justify-center md:items-center flex-col">
            <div className="card-title font-bold text-2xl md:text-3xl">
              <h1>Stay up to date</h1>
            </div>
            <p className="opacity-90 mt-2 text-sm md:text-lg">
              Get notified when I publish something new.
            </p>
          </div>
          <div className="md:mt-8 mt-5 flex items-center md:justify-center">
            <input
              type="text"
              placeholder="Email address"
              className="input input-bordered w-full max-w-sm text-base-content"
            />
            <button className="btn ml-3">Join</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsletterCard
