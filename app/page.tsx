import Container from './components/Container';
import BookshelfHeader from './components/BookshelfHeader';
import BookGrid from './components/BookGrid';
import { getAllStories } from './lib/stories';

export default function Home() {
  const stories = getAllStories();

  return (
    <main className="min-h-screen paper-texture">
      <Container className="py-6 sm:py-8 md:py-12">
        <BookshelfHeader />
        <BookGrid stories={stories} />
      </Container>
    </main>
  );
}
