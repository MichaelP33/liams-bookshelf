export interface StoryPage {
  image?: string;
  text: string;
}

export interface StoryMetadata {
  title: string;
  author?: string;
  coverImage?: string;
  pages?: Array<{ image?: string }>;
}

export interface Story {
  slug: string;
  metadata: StoryMetadata;
  content: string;
  pages: StoryPage[];
}
