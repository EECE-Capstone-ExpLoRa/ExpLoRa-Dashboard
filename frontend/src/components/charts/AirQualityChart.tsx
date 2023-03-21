import { ReactElement } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ExpandableCard from '../Card';
import moment from 'moment'

const chartData = [
  { ax: 14, ay: 20, az: 9, time: 1503617297689 },
  { ax: 15, ay: 10, az: 11, time: 1503616962277 },
  { ax: 15, ay: 12, az: 2, time: 1503616882654 },
  { ax: 20, ay: 30, az: 7, time: 1503613184594 },
  { ax: 15, ay: 40, az: 50, time: 1503611308914 },
]

const AirQualityChart = (): ReactElement => {
  return (
    <ExpandableCard title="Air Quality">
      <ResponsiveContainer width={'99%'} height={225}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" domain={['auto', 'auto']} name="Time" tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')} type="number" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ax" stroke="#25386A" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="ay" stroke="#70A8B7" />
          <Line type="monotone" dataKey="az" stroke="#25386A" />
        </LineChart>
      </ResponsiveContainer>
    </ExpandableCard>
  );
}

export default AirQualityChart