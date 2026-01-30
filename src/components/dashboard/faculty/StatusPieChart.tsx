import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Theme } from "@/pages/Index";

// Define the shape of our dynamic data
interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

interface StatusPieChartProps {
  theme?: Theme;
  data?: PieDataPoint[]; // Data passed from FacultyDashboard
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.total_count || 100; // Fallback to avoid division by zero
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-800">{payload[0].name}</p>
        <p className="text-sm" style={{ color: payload[0].payload.color }}>
          {payload[0].value} complaints
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload, isDark }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const StatusPieChart = ({ theme = "dark", data = [] }: StatusPieChartProps) => {
  const isDark = theme === "dark";
  const isFancy = theme === "fancy";

  const bgColor = isDark || isFancy ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textColor = isDark || isFancy ? "text-gray-100" : "text-gray-800";

  // Check if we actually have data to show
  const hasData = data.some(item => item.value > 0);

  return (
    <div className={`${bgColor} rounded-xl p-6 border shadow-sm h-full`}>
      <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Complaint Status Distribution</h3>
      
      <div className="h-[280px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend isDark={isDark || isFancy} />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
            No status data available
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPieChart;