import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts

const CampaignEffect = () => {
  // 예시 데이터
  const campaignData = [
    { campaignId: 'CP001', name: '여름 할인 프로모션 (SNS)', cost: 300000, impressions: 50000, clicks: 1200, conversions: 150, revenue: 1500000 },
    { campaignId: 'CP002', name: '신규가입 유도 (검색광고)', cost: 500000, impressions: 80000, clicks: 2500, conversions: 200, revenue: 0 }, // 가입만 측정
    { campaignId: 'CP003', name: '콘텐츠 구독 캠페인 (이메일)', cost: 100000, impressions: 20000, clicks: 800, conversions: 80, revenue: 400000 },
  ];

  // Recharts 사용 예시
  /*
  const chartData = campaignData.map(c => ({ name: c.name, 비용: c.cost, 수익: c.revenue, 전환수: c.conversions }));
  */

  // 간단한 계산 예시
  const calculateCPA = (cost, conversions) => conversions > 0 ? (cost / conversions).toFixed(0) : 'N/A';
  const calculateROAS = (revenue, cost) => cost > 0 ? ((revenue / cost) * 100).toFixed(1) + '%' : 'N/A';

  return (
    <div>
      <h1>캠페인 효과 분석</h1>

      {/* 캠페인별 주요 지표 비교 차트 */}
      <h2>캠페인별 주요 지표 비교</h2>
      <p style={{textAlign: 'center', margin: '2rem 0'}}>(차트 라이브러리 연동 시 여기에 바 차트 등으로 비용, 수익, 전환수 비교 표시)</p>
      {/*
      <div style={{ height: 300, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: '원', position: 'insideLeft', angle: -90 }}/>
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: '건', position: 'insideRight', angle: -90 }}/>
            <Tooltip formatter={(value, name) => name === '비용' || name === '수익' ? value.toLocaleString() + ' 원' : value + ' 건'}/>
            <Legend />
            <Bar yAxisId="left" dataKey="비용" fill="#8884d8" />
            <Bar yAxisId="left" dataKey="수익" fill="#82ca9d" />
            <Bar yAxisId="right" dataKey="전환수" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      */}

      {/* 캠페인 상세 데이터 테이블 */}
      <h2 style={{ marginTop: '2rem' }}>캠페인 상세 데이터</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>캠페인 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>캠페인명</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>비용</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>노출수</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>클릭수</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>전환수</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>수익</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>CPA</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>ROAS</th>
          </tr>
        </thead>
        <tbody>
          {campaignData.map((campaign) => (
            <tr key={campaign.campaignId} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{campaign.campaignId}</td>
              <td style={{ padding: '8px' }}>{campaign.name}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{campaign.cost.toLocaleString()} 원</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{campaign.impressions.toLocaleString()}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{campaign.clicks.toLocaleString()}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{campaign.conversions.toLocaleString()}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{campaign.revenue.toLocaleString()} 원</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{calculateCPA(campaign.cost, campaign.conversions)}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{calculateROAS(campaign.revenue, campaign.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignEffect; 