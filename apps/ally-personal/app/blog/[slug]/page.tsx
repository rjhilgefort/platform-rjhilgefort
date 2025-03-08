import React from 'react'
import fs from 'fs'
import matter from 'gray-matter'
import Image from 'next/image'
import Markdown from 'markdown-to-jsx'
import { Metadata } from 'next'

type Params = Promise<{ slug: string }>

function getPostContent(slug: string) {
  const folder = 'content/'
  const file = folder + `${slug.replace(/%20/g, ' ')}.mdx`
  const content = fs.readFileSync(file, 'utf8')
  const matterResult = matter(content)
  return matterResult
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const resolvedParams = await params
  const post = getPostContent(resolvedParams.slug)

  return {
    title: post.data.title || 'Blog Post',
    description: post.data.description || 'Blog Description',
  }
}

interface PageProps {
  params: Params
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BlogPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = getPostContent(resolvedParams.slug)

  return (
    <article className="w-full flex flex-col items-center px-5 xl:px-10">
      <header className="max-w-2xl mt-5">
        <div className="badge badge-outline italic">{post.data.category}</div>
        <h1 className="md:text-4xl text-2xl font-extrabold mb-4">
          {post.data.title}
        </h1>
        <section className="flex mb-10">
          <Image
            src={post.data.authorImage}
            alt={post.data.author}
            className="w-10 h-10 rounded-full object-cover"
            width={10}
            height={10}
            unoptimized
          />
          <div className="flex flex-col ml-3">
            <h2 className="text-md font-semibold">{post.data.author}</h2>
            <time className="text-xs opacity-70">{post.data.date}</time>
          </div>
        </section>
      </header>
      <Image
        src={post.data.image}
        alt={post.data.title}
        className="rounded-xl md:max-w-2xl mb-6 w-full h-96 object-cover"
        width={50}
        height={40}
        unoptimized
      />

      <section className="prose md:prose-md mb-20">
        <Markdown>{post.content}</Markdown>
      </section>
    </article>
  )
}
