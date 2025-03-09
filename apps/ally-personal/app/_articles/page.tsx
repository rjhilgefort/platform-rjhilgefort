import postMetadata from '../../utils/postMetadata'
import Articles from '../../components/Articles'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Articles',
  description: 'All articles',
}

const ArticlesPage = () => {
  const metadata = postMetadata('content')

  return <Articles metadata={metadata} />
}

export default ArticlesPage
