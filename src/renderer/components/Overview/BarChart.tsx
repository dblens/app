/* eslint-disable react/prop-types */
import React from 'react';

import {
  BarChart as BC,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { CustomTooltipProps } from './types';

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-gray-900 border border-gray-400 p-2">
        <pre className="label">
          {JSON.stringify(payload?.[0]?.payload, null, 2)}
        </pre>
      </div>
    );
  }

  return null;
};
const COLORS = ['#0088FE', '#00C49F'];
const BarChart = ({
  barchartData = [],
  keys = ['totalTableSize', 'tableSize'],
}) => (
  <div className="w-full" style={{ height: '33vh' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BC
        width={500}
        height={300}
        data={barchartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        {/* <YAxis /> */}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {keys.map((i, ix) => (
          <Bar key={i} dataKey={i} fill={COLORS[ix % 2]} />
        ))}
        {/* <Bar dataKey="totalTableSize" fill="#82ca9d" /> */}
      </BC>
    </ResponsiveContainer>
  </div>
);

export default BarChart;
