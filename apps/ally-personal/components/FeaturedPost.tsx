import React from 'react'
import Image from 'next/image'
import { Post } from '../types/Post'

const FeaturedPost = ({ posts }: { posts: Array<Post> }) => {
  const featuredPost = posts.find((post: Post) => post.featuredPost === true)

  // TODO: Add a default featured post if none are found
  if (!featuredPost) {
    return null
  }

  return (
    <div className="py-20">
      <div className="card lg:card-side p-7 ring-1 ring-neutral/20 bg-base-300/40 rounded-3xl">
        <Image
          src={featuredPost.image}
          alt={featuredPost.title}
          className="w-full lg:max-w-sm xl:max-w-2xl h-96 rounded-xl object-cover"
          width={90}
          height={90}
          unoptimized
        />

        <div className="card-body px-0 lg:ml-10">
          <div className="badge badge-outline">Featured Post</div>
          <h1 className="card-title text-2xl md:text-4xl font-black text-base-content py-4">
            {featuredPost.title}
          </h1>
          <p className="text-base-content font-light opacity-70 text-sm md:text-lg">
            {featuredPost.description}
          </p>

          <div className="mt-4">
            <a href={`/blog/${featuredPost.slug}`}>
              <button className="btn rounded-full btn-sm md:btn-md bg-primary/10 text-primary hover:bg-primary/15">
                Read Article
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  width="24"
                  height="24"
                >
                  <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"></path>
                </svg>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPost
