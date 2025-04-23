import React, { useState } from 'react';

const ReportGeneration = () => {
  const [reportType, setReportType] = useState('user_summary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 예시 생성된 리포트 목록
  const [generatedReports, setGeneratedReports] = useState([
    { id: 'rep001', type: '사용자 통계 요약', period: '2024-07-01 ~ 2024-07-26', generatedDate: '2024-07-26 11:00', downloadLink: '/reports/user_summary_20240726.xlsx' },
    { id: 'rep002', type: '콘텐츠별 상세 분석', period: '2024-06-01 ~ 2024-06-30', generatedDate: '2024-07-01 09:30', downloadLink: '/reports/content_detail_202406.pdf' },
  ]);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('리포트 생성 기간을 선택해주세요.');
      return;
    }
    setIsGenerating(true);
    console.log('Generating report:', { reportType, startDate, endDate });

    // 실제 리포트 생성 로직 (비동기 처리 필요)
    // 예시: 2초 후 완료되었다고 가정하고 목록에 추가
    setTimeout(() => {
      const newReport = {
        id: `rep${(Math.random() * 1000).toFixed(0)}`,
        type: `${reportType} 리포트`,
        period: `${startDate} ~ ${endDate}`,
        generatedDate: new Date().toLocaleString(),
        downloadLink: `/reports/${reportType}_${startDate}_${endDate}.pdf` // 예시 링크
      };
      setGeneratedReports([newReport, ...generatedReports]);
      setIsGenerating(false);
      alert('리포트 생성이 완료되었습니다.');
    }, 2000);
  };

  return (
    <div>
      <h1>데이터 리포트 생성</h1>

      {/* 리포트 생성 폼 */}
      <form onSubmit={handleGenerateReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', marginBottom: '2rem', border: '1px solid #eee', padding: '1rem' }}>
        <h2>새 리포트 생성</h2>
        <div>
          <label htmlFor="reportType">리포트 종류:</label>
          <select id="reportType" value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ marginLeft: '8px', padding: '4px' }}>
            <option value="user_summary">사용자 통계 요약</option>
            <option value="content_detail">콘텐츠별 상세 분석</option>
            <option value="campaign_performance">캠페인 성과</option>
            {/* 다른 리포트 종류 추가 */}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div>
            <label htmlFor="startDate">시작일:</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              style={{ padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div>
            <label htmlFor="endDate">종료일:</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              style={{ padding: '8px', marginTop: '4px' }}
            />
          </div>
        </div>
        <button type="submit" disabled={isGenerating} style={{ padding: '10px', cursor: 'pointer' }}>
          {isGenerating ? '리포트 생성 중...' : '리포트 생성 요청'}
        </button>
      </form>

      {/* 생성된 리포트 목록 */}
      <h2>생성된 리포트 목록</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>리포트 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>종류</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>기간</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>생성일시</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {generatedReports.map((report) => (
            <tr key={report.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{report.id}</td>
              <td style={{ padding: '8px' }}>{report.type}</td>
              <td style={{ padding: '8px' }}>{report.period}</td>
              <td style={{ padding: '8px' }}>{report.generatedDate}</td>
              <td style={{ padding: '8px' }}>
                <a href={report.downloadLink} download target="_blank" rel="noopener noreferrer">
                  <button>다운로드</button>
                </a>
                {/* 삭제 버튼 등 추가 가능 */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportGeneration; 