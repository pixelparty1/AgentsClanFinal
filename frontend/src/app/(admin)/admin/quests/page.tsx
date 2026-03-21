'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Target, CheckCircle, XCircle, Clock, Eye, Download } from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { 
  getQuests, 
  createQuest, 
  updateQuest, 
  deleteQuest,
  reviewQuestSubmission,
  type Quest, 
  type QuestSubmission 
} from '@/lib/admin';

export default function QuestsAdmin() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [submissions, setSubmissions] = useState<QuestSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'quests' | 'submissions'>('quests');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: '',
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const questsData = await getQuests();
      setQuests(questsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        points: parseInt(formData.points),
        active: formData.active,
      };

      if (editingQuest) {
        await updateQuest(editingQuest.$id, payload);
      } else {
        await createQuest(payload);
      }
      
      fetchData();
      closeModal();
    } catch (error) {
      console.error('Failed to save quest:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this quest?')) return;
    
    try {
      await deleteQuest(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete quest:', error);
    }
  }

  async function handleApprove(submissionId: string) {
    try {
      await reviewQuestSubmission(submissionId, 'approved', 100);
      fetchData();
    } catch (error) {
      console.error('Failed to approve submission:', error);
    }
  }

  async function handleReject(submissionId: string) {
    try {
      await reviewQuestSubmission(submissionId, 'rejected', 0);
      fetchData();
    } catch (error) {
      console.error('Failed to reject submission:', error);
    }
  }

  function openCreateModal() {
    setEditingQuest(null);
    setFormData({
      title: '',
      description: '',
      points: '',
      active: true,
    });
    setShowModal(true);
  }

  function openEditModal(quest: Quest) {
    setEditingQuest(quest);
    setFormData({
      title: quest.title,
      description: quest.description || '',
      points: String(quest.points),
      active: quest.active,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingQuest(null);
  }

  function viewSubmissions(quest: Quest) {
    setSelectedQuest(quest);
    setShowSubmissionsModal(true);
  }

  const filteredQuests = quests.filter(quest =>
    quest.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const questSubmissions = selectedQuest 
    ? submissions.filter(s => s.quest_id === selectedQuest.$id)
    : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <GradientHeading as="h1" className="text-3xl mb-2">
            Quests
          </GradientHeading>
          <p className="text-gray-400">Manage community quests and review submissions.</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingSubmissions.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm">
              {pendingSubmissions.length} pending
            </span>
          )}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Quest
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-emerald-900/30">
        <button
          onClick={() => setActiveTab('quests')}
          className={`pb-3 px-2 font-medium transition-colors ${
            activeTab === 'quests' 
              ? 'text-emerald-400 border-b-2 border-emerald-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          All Quests
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 px-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'submissions' 
              ? 'text-emerald-400 border-b-2 border-emerald-400' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Submissions
          {pendingSubmissions.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-500 text-black">
              {pendingSubmissions.length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={activeTab === 'quests' ? 'Search quests...' : 'Search submissions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {activeTab === 'quests' ? (
        /* Quests Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
          ) : filteredQuests.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">No quests found</div>
          ) : (
            filteredQuests.map((quest) => (
              <motion.div
                key={quest.$id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlowCard>
                  <div className="p-6 rounded-2xl border border-emerald-900/30 bg-emerald-950/20 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{quest.title}</h3>
                        </div>
                      </div>
                      {!quest.active && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {quest.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400">
                        {quest.points} XP
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-emerald-900/20">
                      <button
                        onClick={() => viewSubmissions(quest)}
                        className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View submissions
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(quest)}
                          className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                        >
                          <Pencil className="w-4 h-4 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(quest.$id)}
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
      ) : (
        /* Submissions Table */
        <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">User</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Quest</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Proof</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Date</th>
                <th className="px-6 py-4 text-right text-sm text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20">
              {submissions
                .filter(s => 
                  s.user_wallet?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.quest_id?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((submission) => {
                const quest = quests.find(q => q.$id === submission.quest_id);
                return (
                  <tr key={submission.$id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-xs text-gray-500 font-mono">
                          {submission.user_wallet?.slice(0, 6)}...{submission.user_wallet?.slice(-4)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{quest?.title || 'Unknown Quest'}</td>
                    <td className="px-6 py-4">
                      {(submission.proof_link || submission.file_url) && (
                        <a
                          href={submission.proof_link || submission.file_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          View Proof
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.status)}
                        <span className={`text-sm capitalize ${
                          submission.status === 'approved' ? 'text-emerald-400' :
                          submission.status === 'rejected' ? 'text-red-400' :
                          'text-amber-400'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(submission.$createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {submission.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(submission.$id)}
                            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => handleReject(submission.$id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {submissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">No submissions yet</div>
          )}
        </div>
      )}

      {/* Create/Edit Quest Modal */}
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
            className="w-full max-w-xl rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">
              {editingQuest ? 'Edit Quest' : 'Add Quest'}
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
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Points</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded bg-emerald-950/30 border-emerald-900/30 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-400">Active (visible to users)</span>
              </label>
              
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
                  {editingQuest ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Quest Submissions Modal */}
      {showSubmissionsModal && selectedQuest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowSubmissionsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">{selectedQuest.title}</h2>
            <p className="text-gray-400 mb-6">Submissions for this quest</p>
            
            {questSubmissions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No submissions yet</p>
            ) : (
              <div className="space-y-4">
                {questSubmissions.map((submission) => (
                  <div
                    key={submission.$id}
                    className="p-4 rounded-xl border border-emerald-900/20 bg-emerald-950/20 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs text-gray-500 font-mono">
                        {submission.user_wallet?.slice(0, 6)}...{submission.user_wallet?.slice(-4)}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(submission.$createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.status)}
                        <span className="capitalize">{submission.status}</span>
                      </div>
                      {submission.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(submission.$id)}
                            className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </button>
                          <button
                            onClick={() => handleReject(submission.$id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                          >
                            <XCircle className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSubmissionsModal(false)}
                className="px-6 py-2 rounded-xl border border-emerald-900/30 text-gray-400 hover:text-white hover:border-emerald-500/30 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
