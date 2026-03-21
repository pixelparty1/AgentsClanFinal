'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Mail, Phone, Download, MessageSquare, Eye } from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { getJobApplications, updateApplicationStatus, type JobApplication } from '@/lib/admin';

type ApplicationStatus = JobApplication['status'];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  shortlisted: 'bg-purple-500/20 text-purple-400',
  interview: 'bg-cyan-500/20 text-cyan-400',
  hired: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400',
};

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const data = await getJobApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(appId: string, newStatus: ApplicationStatus) {
    setUpdatingStatus(appId);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications(applications.map(app => 
        app.$id === appId ? { ...app, status: newStatus } as JobApplication : app
      ));
    } catch (error) {
      console.error('Failed to update application status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  }

  function viewDetails(app: JobApplication) {
    setSelectedApp(app);
    setShowDetailsModal(true);
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview: applications.filter(a => a.status === 'interview').length,
    hired: applications.filter(a => a.status === 'hired').length,
  };

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
      <div className="mb-8">
        <GradientHeading as="h1" className="text-3xl mb-2">
          Job Applications
        </GradientHeading>
        <p className="text-gray-400">Review and manage career applications.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/20 text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-blue-900/30 bg-blue-950/20 text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.shortlisted}</p>
            <p className="text-sm text-gray-400">Shortlisted</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-cyan-900/30 bg-cyan-950/20 text-center">
            <p className="text-2xl font-bold text-cyan-400">{stats.interview}</p>
            <p className="text-sm text-gray-400">Interview</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/10 text-center">
            <p className="text-2xl font-bold text-emerald-400">{stats.hired}</p>
            <p className="text-sm text-gray-400">Hired</p>
          </div>
        </GlowCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'shortlisted', 'interview', 'hired', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as ApplicationStatus | 'all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-emerald-500 text-black'
                  : 'bg-emerald-950/30 text-gray-400 hover:text-white border border-emerald-900/30'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Applicant</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Job</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-sm text-gray-400 font-medium">Applied</th>
                <th className="px-6 py-4 text-right text-sm text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <motion.tr 
                    key={app.$id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-emerald-950/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{app.full_name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <a 
                            href={`mailto:${app.email}`}
                            className="text-xs text-gray-500 hover:text-emerald-400 flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            {app.email}
                          </a>
                          {app.phone && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {app.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span>{app.job_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.$id, e.target.value as ApplicationStatus)}
                        disabled={updatingStatus === app.$id}
                        className={`appearance-none px-3 py-1.5 rounded-full text-sm font-medium ${
                          STATUS_COLORS[app.status as ApplicationStatus] || STATUS_COLORS.pending
                        } bg-opacity-20 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer disabled:opacity-50`}
                      >
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(app.$createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewDetails(app)}
                          className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-emerald-400" />
                        </button>
                        {app.resume_url && (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                            title="Download Resume"
                          >
                            <Download className="w-4 h-4 text-emerald-400" />
                          </a>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowDetailsModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedApp.full_name}</h2>
                <p className="text-sm text-gray-400">{selectedApp.job_id}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                STATUS_COLORS[selectedApp.status as ApplicationStatus] || STATUS_COLORS.pending
              }`}>
                {selectedApp.status}
              </span>
            </div>

            {/* Contact Info */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
              <h3 className="font-medium mb-3">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a href={`mailto:${selectedApp.email}`} className="text-emerald-400 hover:text-emerald-300">
                    {selectedApp.email}
                  </a>
                </div>
                {selectedApp.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedApp.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Application Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                <p className="text-sm text-gray-400 mb-1">Job ID</p>
                <p className="font-medium">{selectedApp.job_id}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                <p className="text-sm text-gray-400 mb-1">Applied On</p>
                <p className="font-medium">{formatDate(selectedApp.$createdAt)}</p>
              </div>
            </div>

            {/* Portfolio & Links */}
            {(selectedApp.portfolio_url || selectedApp.linkedin_url || selectedApp.github_url) && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                <h3 className="font-medium mb-3">Links</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedApp.portfolio_url && (
                    <a
                      href={selectedApp.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Portfolio
                    </a>
                  )}
                  {selectedApp.linkedin_url && (
                    <a
                      href={selectedApp.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      LinkedIn
                    </a>
                  )}
                  {selectedApp.github_url && (
                    <a
                      href={selectedApp.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {selectedApp.cover_letter && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Cover Letter
                </h3>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {selectedApp.cover_letter}
                </p>
              </div>
            )}

            {/* Resume */}
            {selectedApp.resume_url && (
              <a
                href={selectedApp.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors mb-6"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            )}

            {/* Status Update */}
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/20">
              <h3 className="font-medium mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {(['pending', 'shortlisted', 'interview', 'hired', 'rejected'] as ApplicationStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusChange(selectedApp.$id, status);
                      setSelectedApp({ ...selectedApp, status } as JobApplication);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedApp.status === status
                        ? STATUS_COLORS[status]
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
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
