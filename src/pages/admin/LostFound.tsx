import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Package, MapPin, Calendar, X, User, Check } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { lostItems, LostItem } from '@/data/admin/dummyData';

export function LostFoundPage() {
  const [items, setItems] = useState<LostItem[]>(lostItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found' | 'claimed'>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [newItem, setNewItem] = useState<{
    itemName: string;
    description: string;
    category: string;
    location: string;
    status: 'lost' | 'found';
  }>({
    itemName: '',
    description: '',
    category: 'Electronics',
    location: '',
    status: 'lost',
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const viewDetails = (item: LostItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleReportItem = () => {
    if (!newItem.itemName || !newItem.location) return;
    
    const item: LostItem = {
      id: `LI${Date.now()}`,
      itemName: newItem.itemName,
      description: newItem.description,
      category: newItem.category,
      location: newItem.location,
      reportedBy: 'Admin',
      reportedDate: new Date().toISOString().split('T')[0],
      status: newItem.status,
      image: newItem.category === 'Electronics' ? '💻' : newItem.category === 'Documents' ? '🪪' : '📦',
    };
    
    setItems((prev) => [item, ...prev]);
    setShowReportModal(false);
    setNewItem({ itemName: '', description: '', category: 'Electronics', location: '', status: 'lost' });
  };

  const markAsClaimed = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'claimed' as const } : item))
    );
    setShowDetailModal(false);
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
            Lost & Found
          </h1>
          <p className="text-muted-foreground mt-1">
            Track lost and found items on campus
          </p>
        </div>
        <GlowButton 
          variant="gradient" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowReportModal(true)}
        >
          Report Item
        </GlowButton>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'lost', 'found', 'claimed'] as const).map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              filter === status
                ? 'bg-neon-cyan text-background glow-cyan'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      <NeonCard glowColor="purple" hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <NeonCard
              glowColor={item.status === 'lost' ? 'pink' : item.status === 'found' ? 'green' : 'cyan'}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl">{item.image}</span>
                  <StatusBadge status={item.status} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.itemName}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-neon-pink" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-neon-cyan" />
                    <span>{item.reportedDate}</span>
                  </div>
                </div>
                <GlowButton 
                  variant="cyan" 
                  size="sm" 
                  className="w-full"
                  onClick={() => viewDetails(item)}
                >
                  View Details
                </GlowButton>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl neon-border overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Item Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{selectedItem.image}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedItem.itemName}</h3>
                    <StatusBadge status={selectedItem.status} className="mt-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Description</p>
                    <p className="text-sm text-foreground mt-1">{selectedItem.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
                      <p className="text-sm text-foreground mt-1">{selectedItem.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                      <p className="text-sm text-foreground mt-1">{selectedItem.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Reported By</p>
                      <p className="text-sm text-foreground mt-1">{selectedItem.reportedBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                      <p className="text-sm text-foreground mt-1">{selectedItem.reportedDate}</p>
                    </div>
                  </div>
                </div>

                {selectedItem.status !== 'claimed' && (
                  <div className="flex gap-3">
                    <GlowButton 
                      variant="green" 
                      className="flex-1"
                      icon={<Check className="w-4 h-4" />}
                      onClick={() => markAsClaimed(selectedItem.id)}
                    >
                      Mark as Claimed
                    </GlowButton>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Item Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl neon-border-purple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Report Item</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Item Name" 
                  placeholder="What is the item?"
                  value={newItem.itemName}
                  onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                />
                <GlowInput 
                  label="Description" 
                  placeholder="Describe the item..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <select 
                      value={newItem.category}
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan"
                    >
                      <option>Electronics</option>
                      <option>Documents</option>
                      <option>Books</option>
                      <option>Accessories</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <select 
                      value={newItem.status}
                      onChange={(e) => setNewItem({...newItem, status: e.target.value as 'lost' | 'found'})}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan"
                    >
                      <option value="lost">Lost</option>
                      <option value="found">Found</option>
                    </select>
                  </div>
                </div>
                <GlowInput 
                  label="Location" 
                  placeholder="Where was it lost/found?"
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                />
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleReportItem}>
                    Report Item
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowReportModal(false)}>
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
