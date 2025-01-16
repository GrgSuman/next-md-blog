"use client"

import React, { useState } from "react"
import JoditRichEditor from "./forms/JoditRichEditor"

type BlogPost = {
  title: string
  slug: string
  category: string
  author: string
  isPublished: boolean
  isFeatured: boolean
  keywords: string
  metaDescription: string
  tags: string
  dateUpdated: string
  thumbnailImageLink: string
  content: string
}

const initialBlogPost: BlogPost = {
  title: "",
  slug: "",
  category: "",
  author: "",
  isPublished: false,
  isFeatured: false,
  keywords: "",
  metaDescription: "",
  tags: "",
  dateUpdated: new Date().toISOString().split('T')[0],
  thumbnailImageLink: "",
  content: ""
}

const predefinedCategories = ["Technology", "Travel", "Food", "Lifestyle", "Business"]

export function BlogPostForm() {
  const [blogPost, setBlogPost] = useState<BlogPost>(initialBlogPost)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [categories, setCategories] = useState(predefinedCategories)
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)

  const updateField = (field: keyof BlogPost, value: any) => {
    setBlogPost(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!blogPost.title.trim()) newErrors.title = "Title is required"
    if (!blogPost.slug.trim()) newErrors.slug = "Slug is required"
    if (!blogPost.category.trim()) newErrors.category = "Category is required"
    if (!blogPost.author.trim()) newErrors.author = "Author is required"
    if (!blogPost.keywords.trim()) newErrors.keywords = "At least one keyword is required"
    if (!blogPost.metaDescription.trim()) newErrors.metaDescription = "Meta description is required"
    if (!blogPost.tags.trim()) newErrors.tags = "At least one tag is required"
    if (!blogPost.thumbnailImageLink.trim()) newErrors.thumbnailImageLink = "Thumbnail image link is required"
    if (!blogPost.content.trim()) newErrors.content = "Content is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("Form submitted:", blogPost)
      setBlogPost(initialBlogPost)
    }
  }

  const handleAddNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()])
      setBlogPost(prev => ({ ...prev, category: newCategory.trim() }))
      setNewCategory("")
      setShowNewCategoryInput(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-4xl mx-auto font-sans">
      <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold">Blog Post Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={blogPost.title}
              onChange={(e) => {
                updateField("title", e.target.value)
                updateField("slug", slugify(e.target.value))
              }}
              className={`w-full px-3 py-2 border rounded-md ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                id="slug"
                value={blogPost.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.slug ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            <div className="w-1/2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                id="category"
                value={blogPost.category}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setShowNewCategoryInput(true)
                  } else {
                    updateField("category", e.target.value)
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md ${errors.category ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="new">Add new category</option>
              </select>
              {showNewCategoryInput && (
                <div className="flex space-x-2 mt-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow px-3 py-2 border rounded-md border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              )}
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input
                type="text"
                id="author"
                value={blogPost.author}
                onChange={(e) => updateField("author", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.author ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>

            <div className="w-1/2">
              <label htmlFor="dateUpdated" className="block text-sm font-medium text-gray-700 mb-2">Date Updated</label>
              <input
                type="date"
                id="dateUpdated"
                value={blogPost.dateUpdated}
                onChange={(e) => updateField("dateUpdated", e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
            <input
              type="text"
              id="keywords"
              value={blogPost.keywords}
              onChange={(e) => updateField("keywords", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.keywords ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.keywords && <p className="text-red-500 text-sm mt-1">{errors.keywords}</p>}
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <textarea
              id="metaDescription"
              value={blogPost.metaDescription}
              onChange={(e) => updateField("metaDescription", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.metaDescription ? "border-red-500" : "border-gray-300"}`}
              rows={3}
            />
            {errors.metaDescription && <p className="text-red-500 text-sm mt-1">{errors.metaDescription}</p>}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={blogPost.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.tags ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
          </div>

          <div>
            <label htmlFor="thumbnailImageLink" className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image Link</label>
            <input
              type="text"
              id="thumbnailImageLink"
              value={blogPost.thumbnailImageLink}
              onChange={(e) => updateField("thumbnailImageLink", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.thumbnailImageLink ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.thumbnailImageLink && <p className="text-red-500 text-sm mt-1">{errors.thumbnailImageLink}</p>}
          </div>

          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={blogPost.isPublished}
                onChange={(e) => updateField("isPublished", e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublished" className="ml-2 text-sm font-medium text-gray-700">Published</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                checked={blogPost.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700">Featured Post</label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold">Content</h2>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Blog Post Content</label>
          <JoditRichEditor content={blogPost.content} setContent={updateField} />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit Blog Post
      </button>
    </form>
  )
}

