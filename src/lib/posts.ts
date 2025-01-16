// src/lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// Define types for the post metadata
interface PostData {
  id: string;
  date: string;
  title: string;
  category: string;
}

// Get sorted post data with metadata
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName:string) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { date: string; title: string; category: string })
    };
  });

  return allPostsData.sort((a: PostData, b: PostData) => (a.date < b.date ? 1 : -1));
}

// Get specific post data (content + metadata)
export async function getPostData(id: string): Promise<{ id: string; contentHtml: string; date: string; title: string; category: string }> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string; category: string })
  };
}

// Get all unique categories from posts
export function getAllCategories(): string[] {
  const posts = getSortedPostsData();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}
