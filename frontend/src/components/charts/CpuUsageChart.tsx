import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client'
import ExpandableCard from '../ExpandableCard';

const socket = io('http://localhost:8080/socket/timestream', {
  transports: ['websocket', 'polling']
})

const CpuUsageChart = () => {
  const [cpuData, setCpuData] = useState<number[]>([])

  useEffect(() => {
    socket.on('cpu', (cpuPercent) => {
      setCpuData(oldData => {
        const allData = [...oldData, cpuPercent]
        const recentData = allData.slice(-50)

        return recentData;
      })
    });
  }, [])

  return (
    <ExpandableCard title="CPU Usage">
      <ResponsiveContainer width={'99%'} height={280}>
        <LineChart
          data={cpuData}
          margin={{
            top: 5,
            right: 20,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#25386A" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </ExpandableCard>
  );
}

export default CpuUsageChart