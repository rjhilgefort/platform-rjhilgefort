import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <div className="hero p-0 overflow-x-hidden">
      <div className="w-full p-0 gap-0 flex flex-col justify-center items-center relative">
        <div className="text-center pt-10">
          <div className="badge badge-outline badge-lg mb-2">Hello!</div>
          <h1 className="text-4xl md:text-5xl xl:text-7xl font-semibold leading-normal">
            I&apos;m <span className="text-primary">Ally,</span>
            <br />
            EPRD Board Candidate
          </h1>
        </div>

        <Image
          src="/images/family-pic-sitting-outline.png"
          alt="Ally Family"
          className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl absolute z-30 bottom-18 max-sm:bottom-25 overflow-hidden"
          height={2500}
          width={2700}
        />

        <Image
          src="/images/bg-yellow.png"
          alt="bg"
          className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl object-cover object-top"
          height={2500}
          width={2700}
        />

        <div className="w-full bg-base-200 py-5 flex flex-col justify-center items-center z-40">
          <p className="text-xl text-center">
            Vote on Tuesday,{' '}
            <span className="text-secondary text-2xl">May 6th</span>!
            <br className="sm:hidden" />
            <span className="text-accent">
              {' '}
              7am-7pm @{' '}
              <a
                href="https://maps.google.com/?q=32003+Ellingwood+Trail,+Evergreen,+CO+80439"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-accent-focus hover:cursor-pointer hover:text-secondary"
              >
                Buchanan
              </a>
              .
            </span>
          </p>
          {/* <h1 className="text-xl font-light">follow me on</h1> */}
          {/* <div className="flex justify-center lg:justify-start space-x-4 mt-4">
            <a
              className="btn btn-circle btn-md"
              href="https://www.x.com"
              aria-label="twitter"
            >
              <FaXTwitter />
            </a>
            <a
              className="btn btn-circle btn-md"
              href="https://www.facebook.com"
              aria-label="facebook"
            >
              <FaFacebook />
            </a>
            <a
              className="btn btn-circle btn-md"
              href="https://www.instagram.com"
              aria-label="instagram"
            >
              <FaInstagram />
            </a>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Hero
