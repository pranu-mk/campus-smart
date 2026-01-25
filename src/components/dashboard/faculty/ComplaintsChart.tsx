import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Theme } from "@/pages/Index";

const data = [
  { month: "Jan", complaints: 45 },
  { month: "Feb", complaints: 52 },
  { month: "Mar", complaints: 38 },
  { month: "Apr", complaints: 65 },
  { month: "May", complaints: 48 },
  { month: "Jun", complaints: 55 },
  { month: "Jul", complaints: 42 },
  { month: "Aug", complaints: 58 },
  { month: "Sep", complaints: 63 },
  { month: "Oct", complaints: 51 },
  { month: "Nov", complaints: 47 },
  { month: "Dec", complaints: 39 },
];

interface ComplaintsChartProps {
  theme?: Theme;
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

const ComplaintsChart = ({ theme = "dark" }: ComplaintsChartProps) => {
  // Softer chart colors based on theme
  const barColor = theme === "light" ? "#6366F1" : "#7C3AED";

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Monthly Complaints Report</h3>
        <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500">
          <option>2024</option>
          <option>2023</option>
        </select>
      </div>
      
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
            <Bar 
              dataKey="complaints" 
              fill={barColor}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplaintsChart;