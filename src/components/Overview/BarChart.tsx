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

const data = [
  {
    name: 'Page A',
    tableSize: 4000,
    totalTableSize: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    tableSize: 3000,
    totalTableSize: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    tableSize: 2000,
    totalTableSize: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    tableSize: 2780,
    totalTableSize: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    tableSize: 1890,
    totalTableSize: 4800,
    amt: 2181,
  },
  {
    name: 'Page A',
    tableSize: 4000,
    totalTableSize: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    tableSize: 3000,
    totalTableSize: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    tableSize: 2000,
    totalTableSize: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    tableSize: 2780,
    totalTableSize: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    tableSize: 1890,
    totalTableSize: 4800,
    amt: 2181,
  },
];

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-gray-800 border-gray-300 p-2">
        <p className="label">{`${payload?.[0]?.name} : ${payload?.[0]?.value} kB`}</p>
      </div>
    );
  }

  return null;
};
const COLORS = ['#8884d8', '#82ca9d'];
const BarChart = ({
  barchartData = data,
  keys = ['tableSize', 'totalTableSize'],
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
        <Tooltip />
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
