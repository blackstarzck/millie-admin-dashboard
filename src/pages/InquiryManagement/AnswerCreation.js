import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // If using dynamic routes like /inquiries/answer/:inquiryId

const AnswerCreation = () => {
  // 예시: 특정 문의 ID를 기반으로 문의 내용을 불러왔다고 가정
  // const { inquiryId } = useParams(); // 라우터 파라미터 사용 시
  const inquiryId = 'inq001'; // 임시 ID

  const [inquiryDetails, setInquiryDetails] = useState(null);
  const [answerContent, setAnswerContent] = useState('');
  const [status, setStatus] = useState('답변대기'); // 답변대기, 답변완료

  // 실제로는 inquiryId를 이용해 API 호출하여 문의 상세 정보 로드
  useEffect(() => {
    console.log(`Fetching details for inquiry ID: ${inquiryId}`);
    // 가상 데이터 로드
    setInquiryDetails({
      id: 'inq001',
      category: '결제',
      title: '결제가 제대로 안됩니다.',
      user: 'user001',
      date: '2024-07-26',
      content: '어제부터 상품 결제를 시도하는데 계속 오류가 발생합니다. 확인 부탁드립니다.',
      status: '답변대기'
    });
    setStatus('답변대기'); // 초기 상태 설정
    setAnswerContent(''); // 초기 답변 내용 클리어

  }, [inquiryId]); // inquiryId가 변경될 때마다 실행

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제 답변 저장 및 상태 변경 로직 구현
    console.log(`Submitting answer for inquiry ${inquiryId}:`, { answerContent, newStatus: status });
    alert('답변이 저장되었습니다. (콘솔 확인)');
    // 저장 후 목록 페이지로 이동하거나 상태 업데이트
  };

  if (!inquiryDetails) {
    return <div>문의 내용을 불러오는 중입니다...</div>;
  }

  return (
    <div>
      <h1>문의 답변 작성/수정</h1>
      <div style={{ border: '1px solid #eee', padding: '1rem', marginBottom: '1rem', backgroundColor: '#f9f9f9' }}>
        <h2>문의 내용</h2>
        <p><strong>ID:</strong> {inquiryDetails.id}</p>
        <p><strong>카테고리:</strong> {inquiryDetails.category}</p>
        <p><strong>문의자:</strong> {inquiryDetails.user}</p>
        <p><strong>문의일:</strong> {inquiryDetails.date}</p>
        <p><strong>제목:</strong> {inquiryDetails.title}</p>
        <p><strong>내용:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{inquiryDetails.content}</p>
        <p><strong>현재 상태:</strong> {inquiryDetails.status}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
        <div>
          <label htmlFor="answerContent">답변 내용:</label>
          <textarea
            id="answerContent"
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            required
            rows={10}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div>
          <label htmlFor="status">답변 상태 변경:</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginLeft: '8px', padding: '4px' }}>
            <option value="답변대기">답변 대기</option>
            <option value="답변완료">답변 완료</option>
            {/* 다른 상태 추가 가능 (예: 처리중) */}
          </select>
        </div>
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>답변 저장</button>
      </form>
    </div>
  );
};

export default AnswerCreation; 