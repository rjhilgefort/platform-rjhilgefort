import React from 'react'
import Image from 'next/image'
import { Post } from '../types/Post'

const BlogCard = ({
  posts,
  maxCardsToShow = 6,
}: {
  posts: Array<Post>
  maxCardsToShow?: number
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {posts.slice(0, maxCardsToShow).map((post, index) => (
        <article
          key={index}
          className="card lg:card-side ring-1 ring-base-content/10 bg-base-300/20 p-7 rounded-3xl"
        >
          <a className="w-full" href={`/blog/${post.slug}`}>
            <Image
              src={post.image}
              className="w-full h-52 rounded-xl object-cover"
              alt={post.title}
              width={50}
              height={50}
              unoptimized
            />
          </a>

          <div className="card-body p-0 lg:ml-7">
            <h2 className="text-xs lg:text-sm text-base-content/70">
              <span>{post.category}</span>
              <span className="text-xl font-bold text-primary">.</span>
              <time className="text-xs lg:text-sm text-base-content/70">
                {post.date}
              </time>
            </h2>
            <a href={`/blog/${post.slug}`}>
              <h1 className="font-semibold text-lg lg:text-xl">{post.title}</h1>
            </a>

            <div>
              <p className="text-sm lg:text-base opacity-70 line-clamp-2 xl:line-clamp-3">
                {post.description}
              </p>
            </div>

            <a
              href={`/blog/${post.slug}`}
              className="mt-auto flex items-center"
            >
              <h2 className="text-sm font-semibold text-primary">
                Read article
              </h2>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="ml-1 h-4 w-4 stroke-current text-primary"
              >
                <path
                  d="M6.75 5.75 9.25 8l-2.5 2.25"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

export default BlogCard
