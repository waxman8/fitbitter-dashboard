"use client";

import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RestingHeartRateData {
  date: string;
  restingHeartRate: number;
}

export default function RestingHeartRateChart({ data }: { data: RestingHeartRateData[] }) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: new Date(item.date).getTime(),
      restingHeartRate: item.restingHeartRate,
    }));
  }, [data]);

  if (!chartData.length) {
    return <p>No resting heart rate data available to display chart.</p>;
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString();
      const restingHeartRate = payload.find((p: any) => p.dataKey === 'restingHeartRate')?.value;

      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 text-gray-100 p-3 border border-gray-600 rounded-lg shadow-2xl backdrop-blur-sm"
        >
          <p className="font-semibold text-sm">{`${date}`}</p>
          {restingHeartRate && <p className="text-orange-400 text-xs mt-1">{`Resting Heart Rate: ${Math.round(restingHeartRate)} bpm`}</p>}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-gradient-to-br from-gray-900 to-black p-6 rounded-lg"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Resting Heart Rate History</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff7f0e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff7f0e" stopOpacity={0.5}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="date"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
            scale="time"
            stroke="#666"
          />
          <YAxis
            stroke="#ff7f0e"
            label={{ value: 'Heart Rate (bpm)', angle: -90, position: 'insideLeft' }}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickFormatter={(value) => String(Math.round(value))}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="restingHeartRate"
            stroke="url(#heartRateGradient)"
            strokeWidth={3.0}
            dot={false}
            name="Resting Heart Rate"
            isAnimationActive={true}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}