import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  GraduationCap, 
  Users, 
  Building2, 
  Search, 
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  Upload,
  Send,
  X,
  FileText, // Add this
  Loader2   // Add this
} from "lucide-react";
import MainLayout from "@/components/layout/student/MainLayout";
import { toast } from "@/hooks/use-toast";
import { complaintAPI } from "@/modules/student/services/api";

const categories = [
  { id: "hostel", title: "Hostel Complaint", description: "Room, maintenance, facilities issues", icon: Home, color: "#4f6fdc" },
  { id: "exam", title: "Exam Issue", description: "Hall ticket, seating, results", icon: GraduationCap, color: "#f39c3d" },
  { id: "faculty", title: "Faculty Complaint", description: "Teaching, attendance, grading", icon: Users, color: "#49b675" },
  { id: "campus", title: "Campus Issue", description: "Infrastructure, safety, parking", icon: Building2, color: "#f6c453" },
  { id: "lost", title: "Lost & Found", description: "Report lost or found items", icon: Search, color: "#9333ea" },
  { id: "helpdesk", title: "Helpdesk", description: "General queries and support", icon: HelpCircle, color: "#0ea5e9" },
];

const subCategories: Record<string, string[]> = {
  hostel: ["Room Maintenance", "Water Supply", "Electricity", "Cleaning", "Security", "Other"],
  exam: ["Hall Ticket", "Seating Issue", "Result Discrepancy", "Re-evaluation", "Other"],
  faculty: ["Attendance Issue", "Grading Problem", "Teaching Quality", "Behavior", "Other"],
  campus: ["Parking", "Lighting", "Cafeteria", "Wi-Fi", "Transport", "Other"],
  lost: ["Lost Item", "Found Item"],
  helpdesk: ["Fee Related", "Certificate", "ID Card", "General Query", "Other"],
};

const RaiseComplaint = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ref to trigger the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    subCategory: "",
    subject: "",
    description: "",
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !formData.subCategory || !formData.subject || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData to handle both text and files
      const data = new FormData();
      data.append("category", selectedCategory);
      data.append("subCategory", formData.subCategory);
      data.append("subject", formData.subject);
      data.append("description", formData.description);
      
      // If a file exists, append it using the key 'file' (matching backend)
      if (formData.file) {
        data.append("file", formData.file);
      }

      const response = await complaintAPI.create(data);

      toast({
        title: "Complaint Submitted Successfully!",
        description: `Your complaint ID is ${response.complaintId}.`,
      });

      // Reset form
      setSelectedCategory(null);
      setFormData({ subCategory: "", subject: "", description: "", file: null });

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1f2937]">Raise Complaint</h1>
        <p className="text-[#6b7280]">Select a category to submit your complaint</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer border border-gray-100 group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: category.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-1">{category.title}</h3>
                  <p className="text-sm text-[#6b7280]">{category.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-card p-6 max-w-2xl"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-[#4f6fdc] mb-6 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </button>

            <h2 className="text-xl font-semibold text-[#1f2937] mb-6">
              {categories.find(c => c.id === selectedCategory)?.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Sub-Category
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4f6fdc] focus:ring-2 focus:ring-[#4f6fdc]/20 outline-none transition-all bg-white text-[#1f2937]"
                >
                  <option value="">Select sub-category</option>
                  {subCategories[selectedCategory]?.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="Brief subject of your complaint"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4f6fdc] focus:ring-2 focus:ring-[#4f6fdc]/20 outline-none transition-all text-[#1f2937]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1f2937] mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4f6fdc] focus:ring-2 focus:ring-[#4f6fdc]/20 outline-none transition-all resize-none text-[#1f2937]"
                />
              </div>

             <div>
  <label className="block text-sm font-medium text-[#1f2937] mb-2">
    Attachment (Optional)
  </label>
  <div 
    onClick={() => fileInputRef.current?.click()}
    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
      formData.file 
        ? "border-green-500 bg-green-50" 
        : "border-gray-200 hover:border-[#4f6fdc]"
    }`}
  >
    {formData.file ? (
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm font-medium text-green-800">File Selected!</p>
        <p className="text-xs text-green-600 mt-1 truncate max-w-[200px]">
          {formData.file.name}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevents opening the file window again
            setFormData({ ...formData, file: null });
          }}
          className="mt-3 text-xs font-bold text-red-500 hover:underline"
        >
          Remove and change
        </button>
      </div>
    ) : (
      <>
        <Upload className="w-8 h-8 mx-auto mb-2 text-[#6b7280]" />
        <p className="text-sm text-[#6b7280]">
          Drag & drop or <span className="text-[#4f6fdc] font-semibold">click to upload</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-1">Max 5MB (JPG, PNG, PDF)</p>
      </>
    )}
    
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept=".jpg,.jpeg,.png,.pdf"
      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
    />
  </div>
</div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#4f6fdc] hover:bg-[#4560c7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#4f6fdc]/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Complaint
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default RaiseComplaint;