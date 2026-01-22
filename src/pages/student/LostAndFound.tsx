import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MapPin, Calendar, Package, Upload, X } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import TopNavbar from "@/components/layout/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  item: string;
  location: string;
  date: string;
  status: "Lost" | "Found" | "Claimed" | "Returned";
  description: string;
  reportedBy: string;
}

const initialItems: LostFoundItem[] = [
  { id: "LF001", type: "lost", item: "Blue Laptop Bag", location: "Library", date: "Jan 17, 2026", status: "Lost", description: "Dell laptop bag with charger inside", reportedBy: "John Doe" },
  { id: "LF002", type: "found", item: "iPhone 14 Pro", location: "Cafeteria", date: "Jan 16, 2026", status: "Found", description: "Black iPhone with broken screen protector", reportedBy: "Admin" },
  { id: "LF003", type: "lost", item: "Student ID Card", location: "Sports Complex", date: "Jan 15, 2026", status: "Found", description: "ID card with name John Doe", reportedBy: "Jane Smith" },
  { id: "LF004", type: "found", item: "Umbrella", location: "Main Building", date: "Jan 14, 2026", status: "Found", description: "Black automatic umbrella", reportedBy: "Security" },
  { id: "LF005", type: "found", item: "Wireless Earbuds", location: "Lecture Hall 3", date: "Jan 13, 2026", status: "Claimed", description: "White wireless earbuds in case", reportedBy: "Prof. Kumar" },
  { id: "LF006", type: "lost", item: "Calculator", location: "Exam Hall", date: "Jan 12, 2026", status: "Returned", description: "Scientific calculator Casio FX-991", reportedBy: "Mike Wilson" },
];

const LostFound = () => {
  const { theme } = useTheme();
  const [items, setItems] = useState<LostFoundItem[]>(initialItems);
  const [filter, setFilter] = useState<"all" | "lost" | "found" | "claimed" | "returned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [formData, setFormData] = useState({
    type: "lost",
    item: "",
    location: "",
    description: "",
    contact: "",
  });
  const [claimData, setClaimData] = useState({
    proofDescription: "",
    dateLost: "",
    contactNumber: "",
  });

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || 
      (filter === "lost" && item.status === "Lost") ||
      (filter === "found" && item.status === "Found") ||
      (filter === "claimed" && item.status === "Claimed") ||
      (filter === "returned" && item.status === "Returned");
    const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: LostFoundItem = {
      id: `LF${String(items.length + 1).padStart(3, '0')}`,
      type: formData.type as "lost" | "found",
      item: formData.item,
      location: formData.location,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: formData.type === "lost" ? "Lost" : "Found",
      description: formData.description,
      reportedBy: "John Doe",
    };
    setItems([newItem, ...items]);
    toast({
      title: formData.type === "lost" ? "Lost Item Reported!" : "Found Item Registered!",
      description: "Your report has been submitted successfully.",
    });
    setShowForm(false);
    setFormData({ type: "lost", item: "", location: "", description: "", contact: "" });
  };

  const handleClaim = (item: LostFoundItem) => {
    setSelectedItem(item);
    setShowClaimModal(true);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      setItems(items.map(item => 
        item.id === selectedItem.id ? { ...item, status: "Claimed" as const } : item
      ));
      toast({
        title: "Claim Request Submitted!",
        description: "Your claim request has been sent. You will be contacted for verification.",
      });
    }
    setShowClaimModal(false);
    setClaimData({ proofDescription: "", dateLost: "", contactNumber: "" });
    setSelectedItem(null);
  };

  const getCardClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-[#1a1a2e]";
      case "fancy":
        return "bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#4f6fdc]/20";
      default:
        return "bg-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lost": return { bg: "bg-red-100", text: "text-red-600" };
      case "Found": return { bg: "bg-green-100", text: "text-green-600" };
      case "Claimed": return { bg: "bg-blue-100", text: "text-blue-600" };
      case "Returned": return { bg: "bg-purple-100", text: "text-purple-600" };
      default: return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  return (
    <MainLayout>
      <TopNavbar title="Lost & Found" subtitle="Report lost items or find what you're looking for" />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowForm(true)}
          className={`px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 ${
            theme === "fancy" 
              ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
              : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
          }`}
        >
          <Plus className="w-5 h-5" />
          Report Item
        </button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`rounded-2xl p-4 shadow-card mb-6 flex flex-wrap items-center gap-4 ${getCardClasses()}`}
      >
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All Items" },
            { key: "lost", label: "Lost" },
            { key: "found", label: "Found" },
            { key: "claimed", label: "Claimed" },
            { key: "returned", label: "Returned" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? theme === "fancy"
                    ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
                    : "bg-[#4f6fdc] text-white"
                  : theme === "light" 
                    ? "bg-gray-100 text-[#6b7280] hover:bg-gray-200"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none ${
              theme === "light"
                ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]"
                : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
            }`}
          />
        </div>
      </motion.div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => {
          const statusColors = getStatusColor(item.status);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all ${getCardClasses()}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.type === "lost" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                }`}>
                  {item.type === "lost" ? "Lost" : "Found"}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors.bg} ${statusColors.text}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  theme === "light" ? "bg-gray-100" : "bg-white/10"
                }`}>
                  <Package className={`w-6 h-6 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`} />
                </div>
                <div>
                  <h3 className={`font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>{item.item}</h3>
                  <p className={`text-sm line-clamp-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>{item.description}</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 text-xs mb-4 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {item.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
              </div>
              {item.type === "found" && item.status === "Found" && (
                <button
                  onClick={() => handleClaim(item)}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    theme === "fancy"
                      ? "bg-gradient-to-r from-[#4f6fdc]/20 to-[#9333ea]/20 text-[#4f6fdc] hover:from-[#4f6fdc]/30 hover:to-[#9333ea]/30"
                      : "bg-[#4f6fdc]/10 text-[#4f6fdc] hover:bg-[#4f6fdc]/20"
                  }`}
                >
                  Claim Item
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Report Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`rounded-2xl shadow-xl max-w-md w-full p-6 ${getCardClasses()}`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>Report Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>Type</label>
                <div className="flex gap-4">
                  {["lost", "found"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formData.type === type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-4 h-4 text-[#4f6fdc]"
                      />
                      <span className={`text-sm capitalize ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>{type} Item</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>Item Name</label>
                <input
                  type="text"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  required
                  placeholder="e.g., Blue Laptop Bag"
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${
                    theme === "light"
                      ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]"
                      : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  placeholder="e.g., Library, Main Building"
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${
                    theme === "light"
                      ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]"
                      : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Describe the item..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${
                    theme === "light"
                      ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]"
                      : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
                  }`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`flex-1 py-3 rounded-xl border font-medium transition-colors ${
                    theme === "light"
                      ? "border-gray-200 text-[#6b7280] hover:bg-gray-50"
                      : "border-white/20 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    theme === "fancy"
                      ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
                      : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                  }`}
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Claim Modal */}
      {showClaimModal && selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowClaimModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`rounded-2xl shadow-xl max-w-md w-full p-6 ${getCardClasses()}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                Claim Item
              </h2>
              <button onClick={() => setShowClaimModal(false)} className="p-1">
                <X className={`w-5 h-5 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`} />
              </button>
            </div>
            
            <div className={`p-4 rounded-xl mb-4 ${theme === "light" ? "bg-gray-50" : "bg-white/5"}`}>
              <p className={`font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>{selectedItem.item}</p>
              <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>{selectedItem.description}</p>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  Proof Description
                </label>
                <textarea
                  value={claimData.proofDescription}
                  onChange={(e) => setClaimData({ ...claimData, proofDescription: e.target.value })}
                  required
                  rows={3}
                  placeholder="Describe how you can prove this item is yours..."
                  className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${
                    theme === "light"
                      ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]"
                      : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  Date Lost
                </label>
                <input
                  type="date"
                  value={claimData.dateLost}
                  onChange={(e) => setClaimData({ ...claimData, dateLost: e.target.value })}
                  required
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${
                    theme === "light"
                      ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]"
                      : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={claimData.contactNumber}
                  onChange={(e) => setClaimData({ ...claimData, contactNumber: e.target.value })}
                  required
                  placeholder="+91 XXXXX XXXXX"
                  className={`w-full px-4 py-3 rounded-xl border outline-none ${
                    theme === "light"
                      ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]"
                      : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  Upload Proof Image (Optional)
                </label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  theme === "light"
                    ? "border-gray-200 hover:border-[#4f6fdc]"
                    : "border-white/20 hover:border-[#4f6fdc]"
                }`}>
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`} />
                  <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                    Click to upload or drag and drop
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className={`flex-1 py-3 rounded-xl border font-medium transition-colors ${
                    theme === "light"
                      ? "border-gray-200 text-[#6b7280] hover:bg-gray-50"
                      : "border-white/20 text-white/70 hover:bg-white/10"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    theme === "fancy"
                      ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
                      : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                  }`}
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default LostFound;
