import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function ClaimsChart({ data }){
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px' }}
          labelStyle={{ color: '#0f172a', fontWeight: 600 }}
          itemStyle={{ color: '#0f172a' }}
        />
        <Legend />
        <Bar dataKey="claims" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
