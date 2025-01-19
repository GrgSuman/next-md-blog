// src/lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Directory where posts are stored
const postsDirectory = path.join(process.cwd(), 'posts');

// Get sorted post data with all metadata
export function getSortedPostsData() {
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

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Get specific post data (metdata + content)
export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const contentHtml = matterResult.content

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string; category: string })
  }
}

// Get all unique categories from posts
export function getAllCategories(): string[] {
  const posts = getSortedPostsData();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}

//get all posts from a category
export function getPostsByCategory(category: string) {
  const posts = getSortedPostsData();
  return posts.filter((post) => post.category === category);
}

// Save post to file
export const savePost = async (fileName: string, data: string): Promise<{ success: boolean; msg?: string }> => {
  const filePath = path.join(postsDirectory, fileName)
  try {
    // Check if the 'posts' directory exists, create it if it doesn't
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }
    // Write the file
    await fs.promises.writeFile(filePath, data, 'utf-8')
    return { 
      success: true
    }
  } catch (error) {
    console.error('Error saving post:', error)
    return { 
      success: false, msg: error instanceof Error ? error.message : String(error) 
    }
  }
  }
  