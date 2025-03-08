import React from 'react'
import BlogCard from './BlogCard'
import { Post } from '../types/Post'

const TopArticles = ({ posts }: { posts: Array<Post> }) => {
  const topArticles = posts.filter((post: Post) => post.topArticle === true)
  const maxCardsToShow = 4
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold brightness-150">
          Top Articles
        </h1>
      </div>

      <BlogCard posts={topArticles} maxCardsToShow={maxCardsToShow} />
    </div>
  )
}

export default TopArticles
