import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import type { Theme } from "@/pages/Index";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "destructive" | "default";
  theme?: Theme;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Softer, ERP-style card colors (faint but still distinct)
const getCardColors = (variant: string, theme: Theme) => {
  if (theme === "light") {
    // Light theme: soft pastel backgrounds
    const lightColors = {
      primary: { bg: "#EEF2FF", iconBg: "#818CF8", text: "#3730A3" },
      warning: { bg: "#FEF9E7", iconBg: "#FBBF24", text: "#92400E" },
      success: { bg: "#ECFDF5", iconBg: "#34D399", text: "#065F46" },
      destructive: { bg: "#FEF2F2", iconBg: "#F87171", text: "#991B1B" },
      default: { bg: "#F3F4F6", iconBg: "#6366F1", text: "#374151" },
    };
    return lightColors[variant as keyof typeof lightColors] || lightColors.default;
  }

  // Dark and Fancy themes: soft dark backgrounds (reduced intensity)
  const darkColors = {
    primary: { bg: "#2E2A5A", iconBg: "#7C3AED", text: "#FFFFFF" },
    warning: { bg: "#433A1A", iconBg: "#D97706", text: "#FFFFFF" },
    success: { bg: "#1A3D2E", iconBg: "#10B981", text: "#FFFFFF" },
    destructive: { bg: "#3D1A1A", iconBg: "#DC2626", text: "#FFFFFF" },
    default: { bg: "#2E2A5A", iconBg: "#6366F1", text: "#FFFFFF" },
  };
  return darkColors[variant as keyof typeof darkColors] || darkColors.default;
};

const StatCard = ({ title, value, icon: Icon, variant = "default", theme = "dark", trend }: StatCardProps) => {
  const colors = getCardColors(variant, theme);

  return (
    <div 
      className="rounded-xl p-5 relative overflow-hidden transition-all duration-200 hover:brightness-110 border"
      style={{ 
        backgroundColor: colors.bg,
        borderColor: theme === "light" ? "#E5E7EB" : "rgba(255,255,255,0.1)"
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p 
            className="text-sm font-medium mb-1"
            style={{ color: theme === "light" ? "#6B7280" : "rgba(255,255,255,0.7)" }}
          >
            {title}
          </p>
          <p 
            className="text-2xl font-bold"
            style={{ color: colors.text }}
          >
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span 
                className="text-xs"
                style={{ color: trend.isPositive ? "#4ADE80" : "#F87171" }}
              >
                {trend.value}% from last month
              </span>
            </div>
          )}
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.iconBg }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;