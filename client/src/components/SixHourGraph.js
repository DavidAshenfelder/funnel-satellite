import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import moment from 'moment';


const RenderLineChart = () => {
  const [history, setHistory] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        const mappedData = data.map((item) => {
          const newItem = {
            ...item,
            label: moment(item.label).format('LT'),
          }
          return newItem;
        });
        setHistory(mappedData)
    });
  }, []);

  return (
  <Card sx={{
    width: 600,
    margin: '1em',
    height: 400,
    display: 'flex',
    justifyContent: 'center',
    alightItems: 'center'
  }}>
    <CardContent>
      <LineChart
        width={550}
        height={350}
        data={history}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <Legend/>
        <Line type="monotone" dataKey="altitude" stroke="#f700ff" strokeWidth={3}/>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="label" />
        <YAxis type="number" domain={[150, 170]} />
        <Tooltip />
      </LineChart>
    </CardContent>
  </Card>
)};

export default RenderLineChart;
