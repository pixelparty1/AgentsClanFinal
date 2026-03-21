'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, FileText, Eye, EyeOff, Clock, Sparkles } from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { getPosts, createPost, updatePost, deletePost, type Post } from '@/lib/admin';

export default function PostsAdmin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    is_published: false,
    is_pinned: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || null,
        category: formData.category,
        is_published: formData.is_published,
        is_pinned: formData.is_pinned,
      };

      if (editingPost) {
        await updatePost(editingPost.$id, payload);
      } else {
        await createPost(payload);
      }
      
      fetchPosts();
      closeModal();
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(id);
      fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }

  async function togglePublished(post: Post) {
    try {
      await updatePost(post.$id, { 
        is_published: !post.is_published,
      });
      fetchPosts();
    } catch (error) {
      console.error('Failed to toggle post status:', error);
    }
  }

  function openCreateModal() {
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      is_published: false,
      is_pinned: false,
    });
    setShowModal(true);
  }

  function openEditModal(post: Post) {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || 'general',
      is_published: post.is_published,
      is_pinned: post.is_pinned || false,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingPost(null);
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = posts.filter(p => p.is_published).length;
  const draftCount = posts.filter(p => !p.is_published).length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <GradientHeading as="h1" className="text-3xl mb-2">
            Posts
          </GradientHeading>
          <p className="text-gray-400">Manage blog posts and announcements.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <p className="text-2xl font-bold">{posts.length}</p>
            <p className="text-sm text-gray-400">Total Posts</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">{publishedCount}</p>
            <p className="text-sm text-gray-400">Published</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/20 text-center">
            <p className="text-2xl font-bold text-amber-400">{draftCount}</p>
            <p className="text-sm text-gray-400">Drafts</p>
          </div>
        </GlowCard>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No posts found</div>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post.$id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlowCard>
                <div className="p-5 rounded-2xl border border-emerald-900/30 bg-emerald-950/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                          {post.is_pinned && (
                            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {post.excerpt || post.content?.slice(0, 150)}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDate(post.$createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublished(post)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.is_published
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                            : 'bg-gray-500/10 hover:bg-gray-500/20'
                        }`}
                        title={post.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {post.is_published ? (
                          <Eye className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(post)}
                        className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.$id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">
              {editingPost ? 'Edit Post' : 'New Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Brief summary for previews..."
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                  placeholder="Write your post content here... (Markdown supported)"
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none font-mono text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="general">General</option>
                  <option value="announcement">Announcement</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="news">News</option>
                  <option value="guide">Guide</option>
                </select>
              </div>
              
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded bg-emerald-950/30 border-emerald-900/30 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-400">Publish immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_pinned}
                    onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                    className="w-4 h-4 rounded bg-emerald-950/30 border-emerald-900/30 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-400">Pinned</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 rounded-xl border border-emerald-900/30 text-gray-400 hover:text-white hover:border-emerald-500/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
                >
                  {editingPost ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
