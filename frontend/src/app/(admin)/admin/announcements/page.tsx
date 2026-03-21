'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Bell, 
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

interface Announcement {
  $id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  is_active: boolean;
  priority: number;
  start_date?: string;
  end_date?: string;
  target_audience: 'all' | 'members' | 'bronze' | 'silver' | 'gold' | 'platinum';
  created_at: string;
  updated_at?: string;
}

const announcementTypes = [
  { value: 'info', label: 'Info', icon: Info, color: 'blue' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'amber' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'emerald' },
  { value: 'alert', label: 'Alert', icon: Bell, color: 'red' },
] as const;

const audienceOptions = [
  { value: 'all', label: 'Everyone' },
  { value: 'members', label: 'All Members' },
  { value: 'bronze', label: 'Bronze+' },
  { value: 'silver', label: 'Silver+' },
  { value: 'gold', label: 'Gold+' },
  { value: 'platinum', label: 'Platinum Only' },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const queries = [Query.orderDesc('priority'), Query.orderDesc('$createdAt')];
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ANNOUNCEMENTS,
        queries
      );

      setAnnouncements(response.documents as unknown as Announcement[]);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: Partial<Announcement>) => {
    // Remove Appwrite document keys from data
    const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, $permissions, ...cleanData } = data as Record<string, unknown>;
    
    try {
      if (editingAnnouncement) {
        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.ANNOUNCEMENTS,
          editingAnnouncement.$id,
          {
            ...cleanData,
            updated_at: new Date().toISOString(),
          }
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.ANNOUNCEMENTS,
          ID.unique(),
          {
            ...cleanData,
            created_at: new Date().toISOString(),
          }
        );
      }
      setShowModal(false);
      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ANNOUNCEMENTS, id);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const toggleActive = async (announcement: Announcement) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ANNOUNCEMENTS,
        announcement.$id,
        {
          is_active: !announcement.is_active,
          updated_at: new Date().toISOString(),
        }
      );
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to toggle announcement:', error);
    }
  };

  const getTypeConfig = (type: Announcement['type']) => {
    return announcementTypes.find((t) => t.value === type) || announcementTypes[0];
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterActive === null || a.is_active === filterActive;
    return matchesSearch && matchesFilter;
  });

  const activeCount = announcements.filter((a) => a.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-emerald-400" />
            Announcements
          </h1>
          <p className="text-gray-400 mt-1">
            {activeCount} active announcement{activeCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAnnouncement(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors h-fit"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive(null)}
            className={`px-4 py-2 rounded-xl border transition-colors ${
              filterActive === null
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-emerald-900/30 hover:bg-emerald-950/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActive(true)}
            className={`px-4 py-2 rounded-xl border transition-colors ${
              filterActive === true
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-emerald-900/30 hover:bg-emerald-950/20'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterActive(false)}
            className={`px-4 py-2 rounded-xl border transition-colors ${
              filterActive === false
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-emerald-900/30 hover:bg-emerald-950/20'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No announcements found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement, index) => {
            const typeConfig = getTypeConfig(announcement.type);
            const TypeIcon = typeConfig.icon;

            return (
              <motion.div
                key={announcement.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 rounded-2xl border bg-gradient-to-br transition-all ${
                  announcement.is_active
                    ? `border-${typeConfig.color}-900/30 from-${typeConfig.color}-950/20 to-transparent`
                    : 'border-gray-800 from-gray-950/20 to-transparent opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-3 rounded-xl ${
                        announcement.is_active
                          ? `bg-${typeConfig.color}-500/10 text-${typeConfig.color}-400`
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            announcement.is_active
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {announcement.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-400">
                          {audienceOptions.find((o) => o.value === announcement.target_audience)?.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-300">
                          Priority: {announcement.priority}
                        </span>
                      </div>
                      <p className="text-gray-400 mt-2 line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </span>
                        {announcement.start_date && announcement.end_date && (
                          <span>
                            {new Date(announcement.start_date).toLocaleDateString()} -{' '}
                            {new Date(announcement.end_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(announcement)}
                      className={`p-2 rounded-lg transition-colors ${
                        announcement.is_active
                          ? 'hover:bg-gray-800 text-emerald-400'
                          : 'hover:bg-gray-800 text-gray-500'
                      }`}
                      title={announcement.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {announcement.is_active ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingAnnouncement(announcement);
                        setShowModal(true);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.$id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <AnnouncementModal
            announcement={editingAnnouncement}
            onClose={() => {
              setShowModal(false);
              setEditingAnnouncement(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface AnnouncementModalProps {
  announcement: Announcement | null;
  onClose: () => void;
  onSave: (data: Partial<Announcement>) => void;
}

function AnnouncementModal({ announcement, onClose, onSave }: AnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: announcement?.title || '',
    content: announcement?.content || '',
    type: announcement?.type || 'info',
    is_active: announcement?.is_active ?? true,
    priority: announcement?.priority || 1,
    start_date: announcement?.start_date || '',
    end_date: announcement?.end_date || '',
    target_audience: announcement?.target_audience || 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {announcement ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as Announcement['type'] })
                }
                className="w-full px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none"
              >
                {announcementTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <select
                value={formData.target_audience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    target_audience: e.target.value as Announcement['target_audience'],
                  })
                }
                className="w-full px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none"
              >
                {audienceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority (1-10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })
                }
                className="w-full px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Start Date (optional)</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date (optional)</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-emerald-900/30 bg-emerald-950/20"
            />
            <label htmlFor="is_active" className="text-sm">
              Active (visible to users)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-emerald-900/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              {announcement ? 'Save Changes' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
