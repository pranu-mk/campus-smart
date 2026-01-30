import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, MapPin, Users, Edit, Trash2, X, Eye } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GlowInput } from '@/components/ui/GlowInput';
import { events, Event } from '@/data/admin/dummyData';

export function EventsPage() {
  const [eventList, setEventList] = useState<Event[]>(events);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event>>({});

  const filteredEvents = eventList.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGlowColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'cyan';
      case 'ongoing': return 'purple';
      case 'completed': return 'green';
      default: return 'pink';
    }
  };

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: `EVT${Date.now()}`,
      title: editingEvent.title || 'New Event',
      description: editingEvent.description || '',
      date: editingEvent.date || new Date().toISOString().split('T')[0],
      time: editingEvent.time || '09:00 AM',
      venue: editingEvent.venue || 'TBD',
      organizer: 'Admin',
      category: editingEvent.category || 'General',
      status: 'upcoming',
      registrations: 0,
      maxCapacity: parseInt(String(editingEvent.maxCapacity)) || 100,
    };
    setEventList((prev) => [newEvent, ...prev]);
    setShowAddModal(false);
    setEditingEvent({});
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedEvent) return;
    setEventList((prev) =>
      prev.map((e) => (e.id === selectedEvent.id ? { ...e, ...editingEvent } : e))
    );
    setShowEditModal(false);
    setEditingEvent({});
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEventList((prev) => prev.filter((e) => e.id !== id));
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">
            Events Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage {eventList.length} campus events
          </p>
        </div>
        <GlowButton variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Create Event
        </GlowButton>
      </motion.div>

      <NeonCard glowColor="purple" hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg 
                     text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:border-neon-purple"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <NeonCard glowColor={getGlowColor(event.status)}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <StatusBadge status={event.status} />
                  <span className="text-xs text-neon-cyan font-mono bg-neon-cyan/10 px-2 py-1 rounded">
                    {event.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-neon-purple" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-neon-pink" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-neon-green" />
                    <span>{event.registrations} / {event.maxCapacity} registered</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(event.registrations / event.maxCapacity) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                  />
                </div>

                <div className="flex gap-2">
                  <GlowButton 
                    variant="cyan" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditEvent(event)}
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </GlowButton>
                  <GlowButton 
                    variant="pink" 
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </GlowButton>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border-purple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Create Event</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Event Title" 
                  placeholder="Tech Fest 2024"
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                />
                <GlowInput 
                  label="Description" 
                  placeholder="Event description..."
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput 
                    label="Date" 
                    type="date"
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  />
                  <GlowInput 
                    label="Time" 
                    type="time"
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                  />
                </div>
                <GlowInput 
                  label="Venue" 
                  placeholder="Main Auditorium"
                  value={editingEvent.venue || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, venue: e.target.value})}
                />
                <GlowInput 
                  label="Max Capacity" 
                  type="number" 
                  placeholder="500"
                  value={String(editingEvent.maxCapacity || '')}
                  onChange={(e) => setEditingEvent({...editingEvent, maxCapacity: parseInt(e.target.value)})}
                />
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleAddEvent}>
                    Create Event
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Edit Event</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Event Title" 
                  placeholder="Tech Fest 2024"
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                />
                <GlowInput 
                  label="Description" 
                  placeholder="Event description..."
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput 
                    label="Date" 
                    type="date"
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                  />
                  <GlowInput 
                    label="Time" 
                    type="time"
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})}
                  />
                </div>
                <GlowInput 
                  label="Venue" 
                  placeholder="Main Auditorium"
                  value={editingEvent.venue || ''}
                  onChange={(e) => setEditingEvent({...editingEvent, venue: e.target.value})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <select 
                    value={editingEvent.status || 'upcoming'}
                    onChange={(e) => setEditingEvent({...editingEvent, status: e.target.value as Event['status']})}
                    className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleSaveEdit}>
                    Save Changes
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
