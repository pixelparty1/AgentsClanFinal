'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, CalendarDays, MapPin, Users, ExternalLink, Clock } from 'lucide-react';
import GradientHeading from '@/components/ui/GradientHeading';
import { GlowCard } from '@/components/ui/glow-card';
import { getEvents, createEvent, updateEvent, deleteEvent, type Event } from '@/lib/admin';

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'meetup' as Event['event_type'],
    location_type: 'online' as Event['location_type'],
    event_date: '',
    location: '',
    meeting_link: '',
    is_featured: false,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
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
        event_type: formData.event_type,
        location_type: formData.location_type,
        event_date: formData.event_date,
        location: formData.location || null,
        meeting_link: formData.meeting_link || null,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.$id, payload);
      } else {
        await createEvent(payload);
      }
      
      fetchEvents();
      closeModal();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }

  function openCreateModal() {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_type: 'meetup' as Event['event_type'],
      location_type: 'online' as Event['location_type'],
      event_date: '',
      location: '',
      meeting_link: '',
      is_featured: false,
    });
    setShowModal(true);
  }

  function openEditModal(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_type: event.event_type,
      location_type: event.location_type,
      event_date: event.event_date,
      location: event.location || '',
      meeting_link: event.meeting_link || '',
      is_featured: event.is_featured || false,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingEvent(null);
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).length;
  const pastEvents = events.filter(e => new Date(e.event_date) < new Date()).length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <GradientHeading as="h1" className="text-3xl mb-2">
            Events
          </GradientHeading>
          <p className="text-gray-400">Manage community events and workshops.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <p className="text-2xl font-bold">{events.length}</p>
            <p className="text-sm text-gray-400">Total Events</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-emerald-900/30 bg-emerald-950/20 text-center">
            <p className="text-2xl font-bold text-emerald-400">{upcomingEvents}</p>
            <p className="text-sm text-gray-400">Upcoming</p>
          </div>
        </GlowCard>
        <GlowCard>
          <div className="p-4 rounded-xl border border-gray-900/30 bg-gray-950/20 text-center">
            <p className="text-2xl font-bold text-gray-400">{pastEvents}</p>
            <p className="text-sm text-gray-400">Past</p>
          </div>
        </GlowCard>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No events found</div>
        ) : (
          filteredEvents.map((event) => (
            <motion.div
              key={event.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlowCard>
                <div className={`p-6 rounded-2xl border h-full ${
                  isUpcoming(event.event_date)
                    ? 'border-emerald-900/30 bg-emerald-950/20'
                    : 'border-gray-900/30 bg-gray-950/20 opacity-75'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        event.location_type === 'online' 
                          ? 'bg-blue-500/20' 
                          : 'bg-purple-500/20'
                      }`}>
                        <CalendarDays className={`w-6 h-6 ${
                          event.location_type === 'online' 
                            ? 'text-blue-400' 
                            : 'text-purple-400'
                        }`} />
                      </div>
                      <div>
                        <span className={`text-xs uppercase tracking-wider ${
                          event.location_type === 'online' 
                            ? 'text-blue-400' 
                            : 'text-purple-400'
                        }`}>
                          {event.event_type}
                        </span>
                      </div>
                    </div>
                    {!isUpcoming(event.event_date) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                        Past
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {event.registration_url && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Online Event</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {event.registration_url && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 mb-4"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Meeting Link
                    </a>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-emerald-900/20">
                    <button
                      onClick={() => openEditModal(event)}
                      className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.$id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
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
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-900/30 bg-[#0a0f0d] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-6">
              {editingEvent ? 'Edit Event' : 'Create Event'}
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
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Event Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value as Event['event_type'] })}
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="meetup">Meetup</option>
                  <option value="workshop">Workshop</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="ama">AMA</option>
                  <option value="webinar">Webinar</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date</label>
                  <input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Location Type</label>
                  <select
                    value={formData.location_type}
                    onChange={(e) => setFormData({ ...formData, location_type: e.target.value as Event['location_type'] })}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="online">Online</option>
                    <option value="offline">In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Venue, etc."
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Meeting Link (for online events)</label>
                <input
                  type="url"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
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
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
