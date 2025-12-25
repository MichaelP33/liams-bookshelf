import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Story, StoryPage, StoryMetadata } from './types';

const storiesDirectory = path.join(process.cwd(), 'Stories');

/**
 * Get all story slugs from the Stories directory
 */
export function getStorySlugs(): string[] {
  if (!fs.existsSync(storiesDirectory)) {
    return [];
  }

  const entries = fs.readdirSync(storiesDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/**
 * Get a story by slug
 */
export function getStoryBySlug(slug: string): Story | null {
  try {
    const storyPath = path.join(storiesDirectory, slug);
    
    // Find the markdown file in the directory
    const files = fs.readdirSync(storyPath);
    const mdFile = files.find((file) => file.endsWith('.md'));
    
    if (!mdFile) {
      return null;
    }

    const fullPath = path.join(storyPath, mdFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Extract title from markdown if not in frontmatter
    let title = data.title;
    let processedContent = content;
    if (!title) {
      // Try to match # Title at the start of content (first non-empty line)
      const lines = content.split('\n');
      const titleLine = lines.find((line) => line.trim().match(/^#+\s+/));
      if (titleLine) {
        const titleMatch = titleLine.match(/^#+\s+(.+)$/);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
          // Remove the title line from content
          processedContent = lines
            .filter((line) => line !== titleLine)
            .join('\n')
            .trim();
        }
      }
      
      // Fallback: use slug but capitalize it nicely
      if (!title || title === slug) {
        title = slug
          .split(/[\s\-_]+/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
    }

    // Auto-detect images in the images folder
    const imagesPath = path.join(storyPath, 'images');
    let availableImages: string[] = [];
    if (fs.existsSync(imagesPath)) {
      availableImages = fs
        .readdirSync(imagesPath)
        .filter((file) => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        .map((file) => `images/${file}`);
    }

    // Use coverImage from frontmatter or first available image
    const coverImage = data.coverImage || availableImages[0];

    const metadata: StoryMetadata = {
      title,
      author: data.author,
      coverImage,
      pages: data.pages || [],
    };

    // Split content by `---` on its own line to create pages
    // Handle both `---` alone and `---` with surrounding whitespace
    const contentPages = processedContent
      .split(/\n\s*---\s*\n/)
      .map((page) => page.trim())
      .filter((page) => page.length > 0);

    // Combine metadata pages with content pages, auto-assigning images if available
    const pages: StoryPage[] = contentPages.map((pageText, index) => {
      const pageMetadata = metadata.pages?.[index];
      // Use image from frontmatter, or auto-assign from available images
      const image = pageMetadata?.image || availableImages[index];
      
      // Extract text content - handle "Text:" format or use full page text
      let text = pageText.trim();
      
      // Try to extract **Text:** content - handles quoted text that may span multiple lines
      const textMatch = text.match(/\*\*Text:\*\*\s*"(.+?)"/s) || 
                        text.match(/\*\*Text:\*\*\s*"([^"]+)"/m) ||
                        text.match(/\*\*Text:\*\*\s*(.+?)(?=\n\n|\n\*\*|$)/s);
      if (textMatch) {
        text = textMatch[1].trim();
      } else {
        // Remove markdown headers and illustration notes for cleaner display
        text = text
          .replace(/^##\s+SPREAD\s+\d+[\-:]?\s*.+$/gm, '')
          .replace(/\*\*Illustration:\*\*.+$/gm, '')
          .replace(/\*\*Title:\*\*.+$/gm, '')
          .replace(/\*\*THE END\*\*/g, 'THE END')
          .trim();
        
        // If after cleanup the text is empty or only whitespace, 
        // it's likely a title/illustration-only page
        if (!text || text.length === 0) {
          text = ''; // Empty is OK for title pages with just images
        }
      }
      
      return {
        image,
        text,
      };
    });

    return {
      slug,
      metadata,
      content: processedContent,
      pages,
    };
  } catch (error) {
    console.error(`Error loading story ${slug}:`, error);
    return null;
  }
}

/**
 * Get all stories
 */
export function getAllStories(): Story[] {
  const slugs = getStorySlugs();
  return slugs
    .map((slug) => getStoryBySlug(slug))
    .filter((story): story is Story => story !== null);
}
