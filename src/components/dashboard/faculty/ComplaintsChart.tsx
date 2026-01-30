import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Theme } from "@/pages/Index";

// We define the structure of the data coming from our new backend
interface ChartDataPoint {
  name: string;  // Month name (e.g., "Jan")
  total: number; // Count of complaints
}

interface ComplaintsChartProps {
  theme?: Theme;
  data?: ChartDataPoint[]; // New prop for dynamic data
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-sm text-blue-600">
          {payload[0].value} complaints
        </p>
      </div>
    );
  }
  return null;
};

const ComplaintsChart = ({ theme = "dark", data = [] }: ComplaintsChartProps) => {
  const isDark = theme === "dark";
  const isFancy = theme === "fancy";
  
  // Dynamic Year Logic
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];

  const barColor = theme === "light" ? "#6366F1" : "#7C3AED";
  const bgColor = isDark || isFancy ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textColor = isDark || isFancy ? "text-gray-100" : "text-gray-800";

  return (
    <div className={`${bgColor} rounded-xl p-6 border shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${textColor}`}>Monthly Complaints Report</h3>
        <select className={`${isDark || isFancy ? "bg-gray-700 text-gray-200 border-gray-600" : "bg-gray-50 text-gray-700 border-gray-200"} rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 border`}>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div className="h-[280px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark || isFancy ? "#374151" : "#E5E7EB"} opacity={0.5} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark || isFancy ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isDark || isFancy ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
              <Bar 
                dataKey="total" 
                fill={barColor}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            No complaint data found for the last 6 months.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsChart;