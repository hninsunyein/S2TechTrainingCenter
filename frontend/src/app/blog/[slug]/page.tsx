import BlogDetail from './BlogDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetail slug={slug} />;
}
