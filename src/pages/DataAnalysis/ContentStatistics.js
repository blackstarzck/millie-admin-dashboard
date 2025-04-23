import React from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts

const ContentStatistics = () => {
  // 예시 데이터
  const topContentViews = [
    { contentId: 'book001', title: 'React 마스터하기', views: 15200, likes: 350 },
    { contentId: 'book005', title: '실용 데이터 분석', views: 12800, likes: 420 },
    { contentId: 'course002', title: 'Node.js 백엔드 개발', views: 11500, likes: 280 },
    { contentId: 'book003', title: 'UI/UX 디자인 원칙', views: 9800, likes: 150 },
  ];

  const categoryDistribution = [
    { name: 'IT/기술', value: 450 },
    { name: '문학', value: 250 },
    { name: '자기계발', value: 300 },
    { name: '기타', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h1>콘텐츠 통계 분석</h1>

      {/* 인기 콘텐츠 (조회수 기준) */}
      <h2>인기 콘텐츠 (조회수 기준)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>콘텐츠 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>제목</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>조회수</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>좋아요 수</th>
          </tr>
        </thead>
        <tbody>
          {topContentViews.map((content) => (
            <tr key={content.contentId} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{content.contentId}</td>
              <td style={{ padding: '8px' }}>{content.title}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{content.views.toLocaleString()}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{content.likes.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 카테고리별 콘텐츠 분포 */}
      <h2 style={{ marginTop: '2rem' }}>카테고리별 콘텐츠 분포</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '1rem' }}>
        <div style={{width: '50%'}}>
          <p style={{textAlign: 'center'}}>(차트 라이브러리 연동 시 여기에 파이 차트 표시)</p>
          {/*
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          */}
        </div>
        <div style={{width: '40%'}}>
           {/* 카테고리별 통계 테이블 등 추가 가능 */}
           <p>카테고리별 상세 통계 테이블 영역</p>
        </div>
      </div>

      {/* 추가적인 콘텐츠 통계 (유형별, 등록 추이 등) 표시 영역 */}

    </div>
  );
};

export default ContentStatistics; 