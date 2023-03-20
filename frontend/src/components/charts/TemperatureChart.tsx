import { ReactElement } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ExpandableCard from '../Card';
import Card from '../Card';

const data = [
  {
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    uv: 2000,
    pv: 1200,
    amt: 2400,
  },
  {
    uv: 1800,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 1800,
    pv: 1800,
    amt: 2290,
  },
  {
    uv: 1800,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 1200,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 1300,
    pv: 4300,
    amt: 2100,
  },
  {
    uv: 2500,
    pv: 2400,
    amt: 2400,
  },
  {
    uv: 2600,
    pv: 1398,
    amt: 2210,
  },
  {
    uv: 2800,
    pv: 9800,
    amt: 2290,
  },
  {
    uv: 2900,
    pv: 3908,
    amt: 2000,
  },
  {
    uv: 3000,
    pv: 4800,
    amt: 2181,
  },
  {
    uv: 4000,
    pv: 3800,
    amt: 2500,
  },
  {
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const TemperatureChart = (): ReactElement => {
  return (
    <ExpandableCard title="Temperature">
    <ResponsiveContainer height={280}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="uv" stroke="#25386A" fill="#25386A" />
      </AreaChart>
    </ResponsiveContainer>
    </ExpandableCard>
  );
}

export default TemperatureChart;