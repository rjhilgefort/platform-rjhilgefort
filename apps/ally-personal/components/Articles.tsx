'use client'

import React, { useState } from 'react'
import BlogCard from './BlogCard'
import Pagination from './Pagination'
import { Post } from '../types/Post'

const Articles = ({ metadata }: { metadata: Array<Post> }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const postsPerPage = 6
  const totalPages = Math.ceil(metadata.length / postsPerPage)

  const startIndex = (currentPage - 1) * postsPerPage
  const selectedPosts = metadata.slice(startIndex, startIndex + postsPerPage)

  return (
    <div className="px-5 xl:px-10">
      <div className="mt-16 flex justify-center items-center">
        <h1 className="text-3xl md:text-5xl font-semibold text-center max-w-2xl">
          Articles on digital marketing, brand building, and design.
        </h1>
      </div>
      <div className="mb-20 mt-16">
        <BlogCard posts={selectedPosts} />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default Articles
