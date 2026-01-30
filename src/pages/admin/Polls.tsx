import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Users, X } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { polls, Poll } from '@/data/admin/dummyData';

export function PollsPage() {
  const [pollList, setPollList] = useState<Poll[]>(polls);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '', '', ''],
    endDate: '',
  });

  const handleCreatePoll = () => {
    if (!newPoll.question || newPoll.options.filter(o => o.trim()).length < 2) return;
    
    const validOptions = newPoll.options.filter(o => o.trim());
    const poll: Poll = {
      id: `POL${Date.now()}`,
      question: newPoll.question,
      options: validOptions.map((text, i) => ({ id: `O${Date.now()}_${i}`, text, votes: 0 })),
      totalVotes: 0,
      createdBy: 'Admin',
      department: 'All',
      status: 'active',
      endDate: newPoll.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    
    setPollList((prev) => [poll, ...prev]);
    setShowAddModal(false);
    setNewPoll({ question: '', options: ['', '', '', ''], endDate: '' });
  };

  const handleClosePoll = (pollId: string) => {
    setPollList((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, status: 'closed' as const } : p))
    );
  };

  const handleReopenPoll = (pollId: string) => {
    setPollList((prev) =>
      prev.map((p) => (p.id === pollId ? { ...p, status: 'active' as const } : p))
    );
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({ ...newPoll, options: newOptions });
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
            Polls & Voting
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage campus polls
          </p>
        </div>
        <GlowButton 
          variant="gradient" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
        >
          Create Poll
        </GlowButton>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pollList.map((poll, i) => (
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <NeonCard glowColor={poll.status === 'active' ? 'cyan' : 'purple'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={poll.status} />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground">{poll.question}</h3>

                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                    const isWinning = option.votes === Math.max(...poll.options.map((o) => o.votes)) && option.votes > 0;
                    
                    return (
                      <div key={option.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className={isWinning ? 'text-neon-cyan font-medium' : 'text-foreground'}>
                            {option.text}
                          </span>
                          <span className="text-muted-foreground">{option.votes} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`absolute inset-y-0 left-0 rounded-full ${
                              isWinning
                                ? 'bg-gradient-to-r from-neon-cyan to-neon-green'
                                : 'bg-gradient-to-r from-neon-purple/50 to-neon-pink/50'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Created by {poll.createdBy}</p>
                    <p className="text-xs text-muted-foreground">Ends: {poll.endDate}</p>
                  </div>
                  {poll.status === 'active' ? (
                    <GlowButton 
                      variant="pink" 
                      size="sm"
                      onClick={() => handleClosePoll(poll.id)}
                    >
                      Close Poll
                    </GlowButton>
                  ) : (
                    <GlowButton 
                      variant="green" 
                      size="sm"
                      onClick={() => handleReopenPoll(poll.id)}
                    >
                      Reopen Poll
                    </GlowButton>
                  )}
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Create Poll Modal */}
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
              className="w-full max-w-md glass rounded-2xl neon-border-purple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Create New Poll</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Poll Question" 
                  placeholder="What do you want to ask?"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Options (2-4)</label>
                  {newPoll.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan"
                    />
                  ))}
                </div>
                <GlowInput 
                  label="End Date" 
                  type="date"
                  value={newPoll.endDate}
                  onChange={(e) => setNewPoll({...newPoll, endDate: e.target.value})}
                />
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleCreatePoll}>
                    Create Poll
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
    </div>
  );
}
