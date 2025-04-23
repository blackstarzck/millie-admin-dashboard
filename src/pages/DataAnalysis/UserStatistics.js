import React from 'react';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts

const UserStatistics = () => {
  // 예시 데이터
  const dailySignupData = [
    { date: '07-20', count: 15 }, { date: '07-21', count: 22 }, { date: '07-22', count: 18 },
    { date: '07-23', count: 25 }, { date: '07-24', count: 30 }, { date: '07-25', count: 28 },
    { date: '07-26', count: 35 },
  ];

  const userStatusData = [
    { name: '활성 사용자', value: 1234 },
    { name: '휴면 사용자', value: 345 },
    { name: '탈퇴 사용자', value: 123 },
  ];

  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h1>사용자 통계 분석</h1>

      {/* 일별 신규 가입자 추이 */}
      <h2>일별 신규 가입자 추이</h2>
      <p style={{textAlign: 'center', margin: '2rem 0'}}>(차트 라이브러리 연동 시 여기에 라인 차트 표시)</p>
      {/*
      <div style={{ height: 300, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailySignupData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" name="신규 가입자 수" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      */}

      {/* 사용자 상태 분포 */}
      <h2 style={{ marginTop: '2rem' }}>사용자 상태 분포</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '1rem' }}>
          <div style={{width: '50%'}}>
            <p style={{textAlign: 'center'}}>(차트 라이브러리 연동 시 여기에 파이 차트 표시)</p>
            {/*
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
                    data={userStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {userStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            */}
          </div>
          <div style={{width: '40%'}}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>상태</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>사용자 수</th>
                </tr>
                </thead>
                <tbody>
                {userStatusData.map((entry, index) => (
                    <tr key={`row-${index}`} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length], marginRight: '5px' }}></span>
                        {entry.name}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{entry.value.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
      </div>

      {/* 추가적인 사용자 통계 (지역별, 연령별 등) 표시 영역 */}

    </div>
  );
};

export default UserStatistics; 