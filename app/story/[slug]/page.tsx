import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoryBySlug, getStorySlugs } from '@/app/lib/stories';
import Container from '@/app/components/Container';
import Button from '@/app/components/Button';
import StoryReader from '@/app/components/StoryReader';

interface StoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getStorySlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default function StoryPage({ params }: StoryPageProps) {
  // Decode the slug in case it's URL-encoded
  const decodedSlug = decodeURIComponent(params.slug);
  const story = getStoryBySlug(decodedSlug);

  if (!story) {
    notFound();
  }

  return (
    <main className="min-h-screen paper-texture">
      <Container className="py-4 sm:py-6 md:py-8">
        <header className="mb-4 sm:mb-6 md:mb-8">
          <Link href="/" className="inline-block mb-2 sm:mb-4">
            <Button variant="ghost" className="text-sm sm:text-base py-1.5 px-3 sm:py-2 sm:px-4">
              ← Back to Bookshelf
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display text-text-primary mb-1 sm:mb-2">
            {story.metadata.title}
          </h1>
          {story.metadata.author && (
            <p className="text-text-secondary text-sm sm:text-base md:text-lg">
              {story.metadata.author}
            </p>
          )}
        </header>

        <StoryReader 
          pages={story.pages} 
          slug={decodedSlug}
          title={story.metadata.title}
        />
      </Container>
    </main>
  );
}
