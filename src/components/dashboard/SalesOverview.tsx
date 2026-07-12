import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Menu } from 'lucide-react';

// Mock data representing the 8 days of sales/activity
const data = [
  { date: '16/08', ample: 350, pixel: 270 },
  { date: '17/08', ample: 380, pixel: 240 },
  { date: '18/08', ample: 290, pixel: 320 },
  { date: '19/08', ample: 340, pixel: 210 },
  { date: '20/08', ample: 380, pixel: 240 },
  { date: '21/08', ample: 300, pixel: 170 },
  { date: '22/08', ample: 350, pixel: 270 },
  { date: '23/08', ample: 380, pixel: 240 },
];

export default function SalesOverview() {
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg flex flex-col w-full h-full">
      
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
          <p className="text-xs text-gray-400 mt-1">Ample vs Pixel performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select className="bg-zinc-800 text-gray-200 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
            <option>March 2025</option>
            <option>April 2025</option>
          </select>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* --- Recharts Bar Chart Section --- */}
      <div className="h-[350px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Horizontal background grid lines */}
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#333333"
            />
            
            {/* X-Axis (Dates) */}
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            
            {/* Y-Axis (Values 0 - 400) */}
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
            />
            
            {/* Hover Tooltip customized for Dark Mode */}
            <Tooltip
              cursor={{ fill: '#27272a' }}
              contentStyle={{
                backgroundColor: '#1e1e1e',
                borderColor: '#333333',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#fff', fontWeight: 500 }}
            />
            
            {/* Bar 1: Ample */}
            <Bar
              dataKey="ample"
              fill="#3b82f6"
              barSize={8}
              radius={[4, 4, 0, 0]}
              name="Ample"
            />
            
            {/* Bar 2: Pixel */}
            <Bar
              dataKey="pixel"
              fill="#60a5fa"
              barSize={8}
              radius={[4, 4, 0, 0]}
              name="Pixel"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* --- Bottom Legend Indicators --- */}
      <div className="flex items-center gap-6 mt-6 justify-center text-sm">
         <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-blue-500"></span>
             <span className="text-gray-400">Ample Earnings</span>
         </div>
         <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-blue-400"></span>
             <span className="text-gray-400">Pixel Projects</span>
         </div>
      </div>

    </div>
  );
}
