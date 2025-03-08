import { format } from 'date-fns'
import fs from 'fs'
import matter from 'gray-matter'
import { Post } from '../types/Post'

const postMetadata = (
  basePath: string,
): Array<Omit<Post, 'author' | 'authorImage'>> => {
  const folder = basePath + '/'
  const files = fs.readdirSync(folder)
  const markdownPosts = files.filter((file) => file.endsWith('.mdx'))

  const posts = markdownPosts.map((filename) => {
    const fileContents = fs.readFileSync(`content/${filename}`, 'utf8')
    const matterResult = matter(fileContents)
    return {
      title: matterResult.data.title as string,
      description: matterResult.data.description as string,
      slug: filename.replace('.mdx', '') as string,
      featuredPost: matterResult.data.featuredPost as boolean,
      topArticle: matterResult.data.topArticle as boolean,
      category: matterResult.data.category as string,
      image: matterResult.data.image as string,
      date: format(new Date(matterResult.data.date), 'MMMM d, yyyy'),
    }
  })

  return posts
}

export default postMetadata
