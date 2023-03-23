import { ReactElement, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment'
import io from 'socket.io-client'

const socket = io('http://localhost:8080/socket/timestream', {
  transports: ['websocket', 'polling']
})

const CpuUsageChart = () => {
  const [cpuData, setCpuData] = useState<number[]>([])

  useEffect(() => {
    socket.on('cpu', (cpuPercent) => {
      setCpuData(oldData => [...oldData, cpuPercent])
    });
  }, [])

  return (
    <ResponsiveContainer width={'99%'} height={900}>
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
  );
}

export default CpuUsageChart