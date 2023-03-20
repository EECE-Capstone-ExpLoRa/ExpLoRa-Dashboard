import { ReactElement } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ExpandableCard from '../Card';

const data = [
  {
    name: 'Data A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Data B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Data C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Data D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Data E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Data F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Data G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const PressureChart = (): ReactElement => {
  return (
    <ExpandableCard title="Pressure">
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

export default PressureChart