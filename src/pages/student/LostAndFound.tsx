import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MapPin, Calendar, Package, X, Loader2, AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/student/MainLayout";
import TopNavbar from "@/components/layout/student/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { lostFoundAPI } from "@/modules/student/services/api";

interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  item: string;
  location: string;
  date: string;
  // Added 'Open' to satisfy the TypeScript comparison for the claim button
  status: "Lost" | "Found" | "Claimed" | "Returned" | "Open"; 
  description: string;
  reportedBy: string;
}

const LostFound = () => {
  const { theme } = useTheme();
  
  // --- STATE MANAGEMENT ---
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "lost" | "found" | "claimed" | "returned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals
  const [showForm, setShowForm] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    type: "lost",
    item: "",
    location: "",
    description: "",
    category: "General",
  });

  const [claimData, setClaimData] = useState({
    proofDescription: "",
    contactNumber: "",
  });

  // --- 1. FETCH ALL ITEMS ---
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await lostFoundAPI.getAll();
      if (response.success) {
        const mappedItems = response.posts.map((dbItem: any) => ({
          id: dbItem.id.toString(),
          type: dbItem.type.toLowerCase(),
          item: dbItem.title,
          location: dbItem.location || "Campus",
          date: new Date(dbItem.item_date || dbItem.created_at).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          }),
          status: dbItem.status,
          description: dbItem.description,
          reportedBy: dbItem.posted_by || "Student"
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      toast({ title: "Sync Error", description: "Failed to load board items", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- 2. SUBMIT NEW REPORT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await lostFoundAPI.create({
        type: formData.type === "lost" ? "Lost" : "Found",
        title: formData.item,
        description: formData.description,
        category: formData.category,
        item_date: new Date().toISOString().split('T')[0]
      });

      if (response.success) {
        toast({ title: "Reported!", description: "Your item is now on the board." });
        setShowForm(false);
        setFormData({ type: "lost", item: "", location: "", description: "", category: "General" });
        fetchItems();
      }
    } catch (error) {
      toast({ title: "Error", description: "Submission failed", variant: "destructive" });
    }
  };

  // --- 3. SUBMIT CLAIM ---
  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const response = await lostFoundAPI.claim(selectedItem.id);
      if (response.success) {
        toast({ 
          title: "Claim Submitted!", 
          description: "The finder has been notified via dashboard alert." 
        });
        setShowClaimModal(false);
        setSelectedItem(null);
        setClaimData({ proofDescription: "", contactNumber: "" });
        fetchItems(); 
      }
    } catch (error) {
      toast({ title: "Claim Error", description: "Action could not be completed", variant: "destructive" });
    }
  };

  // --- HELPERS ---
  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || 
      (filter === "lost" && item.type === "lost") ||
      (filter === "found" && item.type === "found") ||
      (filter === "claimed" && item.status === "Claimed") ||
      (filter === "returned" && item.status === "Returned");
    const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCardClasses = () => theme === "dark" ? "bg-[#1a1a2e] border-white/5" : "bg-white border-gray-100";
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lost": return "bg-red-100 text-red-600";
      case "Found": case "Open": return "bg-green-100 text-green-600";
      case "Claimed": return "bg-blue-100 text-blue-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <MainLayout>
      <TopNavbar title="Lost & Found" subtitle="Campus community notice board" />

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
          Recent Discoveries
        </h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="bg-[#4f6fdc] hover:bg-[#405bbd] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#4f6fdc]/20"
        >
          <Plus className="w-5 h-5" /> Report Item
        </button>
      </div>

      {/* Filter Bar */}
      <div className={`rounded-2xl p-4 border mb-6 flex flex-wrap items-center gap-4 ${getCardClasses()}`}>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["all", "lost", "found", "claimed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === tab ? "bg-[#4f6fdc] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by item name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 bg-transparent outline-none focus:border-[#4f6fdc] transition-colors"
          />
        </div>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 opacity-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#4f6fdc] mb-2" />
          <p>Scanning database...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className={`rounded-2xl p-5 border shadow-sm flex flex-col h-full ${getCardClasses()}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  item.type === 'lost' ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'
                }`}>
                  {item.type}
                </span>
                <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white leading-tight mb-1">{item.item}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {item.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                </div>
                
                {/* Fixed Visibility Logic */}
                {item.type.toLowerCase() === "found" && 
                 (item.status === "Found" || item.status === "Open") && (
                  <button 
                    onClick={() => { setSelectedItem(item); setShowClaimModal(true); }} 
                    className="w-full mt-2 py-2.5 bg-[#4f6fdc] text-white rounded-xl text-xs font-bold hover:bg-[#405bbd] transition-colors"
                  >
                    Claim This Item
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No items matching your search found.</p>
        </div>
      )}

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* Report Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-3xl p-8 max-w-md w-full shadow-2xl ${getCardClasses()}`} 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">New Entry</h2>
                <X className="cursor-pointer text-gray-400" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
                  {['lost', 'found'].map(t => (
                    <button 
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, type: t as any})}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                        formData.type === t ? "bg-white shadow-sm text-[#4f6fdc]" : "text-gray-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1">ITEM NAME</label>
                  <input placeholder="Ex: Blue Water Bottle" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none focus:border-[#4f6fdc]" value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1">LOCATION</label>
                  <input placeholder="Ex: Library 2nd Floor" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none focus:border-[#4f6fdc]" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1">DESCRIPTION</label>
                  <textarea placeholder="Any identifying marks?" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none focus:border-[#4f6fdc] resize-none" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                </div>
                <button type="submit" className="w-full py-4 bg-[#4f6fdc] text-white rounded-2xl font-bold shadow-lg shadow-[#4f6fdc]/30 hover:-translate-y-0.5 transition-all">
                  Post to Board
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Claim Modal */}
        {showClaimModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowClaimModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-3xl p-8 max-w-md w-full shadow-2xl ${getCardClasses()}`} 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Claim Item</h2>
                <X className="cursor-pointer text-gray-400" onClick={() => setShowClaimModal(false)} />
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                <p className="text-xs text-blue-600 font-medium leading-relaxed">
                  Provide proof of ownership to help the finder verify you.
                </p>
              </div>
              <form onSubmit={handleClaimSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1">PROOF DETAILS</label>
                  <textarea placeholder="How do you know it's yours?" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none focus:border-[#4f6fdc] resize-none" rows={3} value={claimData.proofDescription} onChange={e => setClaimData({...claimData, proofDescription: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1">CONTACT PHONE</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full p-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none focus:border-[#4f6fdc]" value={claimData.contactNumber} onChange={e => setClaimData({...claimData, contactNumber: e.target.value})} required />
                </div>
                <button type="submit" className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-500/30 hover:-translate-y-0.5 transition-all">
                  Confirm Ownership
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default LostFound;