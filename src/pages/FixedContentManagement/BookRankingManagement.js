import { Button, Card, Modal, Select, Switch, Table, Tabs, Typography } from 'antd';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Title as ChartTitle,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;
const { Option } = Select;

// 알고리즘 설명 컴포넌트
const AlgorithmExplanation = ({ visible, onClose }) => {
  return (
        <Modal
      title="도서 랭킹 알고리즘 설명"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          확인
        </Button>
      ]}
      width={800}
    >
            <div style={{ lineHeight: '1.6' }}>
        <Title level={4} style={{ marginTop: '0', marginBottom: '16px' }}>랭킹 산출 목표</Title>
        <p style={{ marginBottom: '32px' }}>도서의 실제 인기도와 품질을 객관적으로 평가하여 사용자에게 의미있는 랭킹을 제공합니다.</p>

        <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>가중치 기반 종합 점수</Title>
        <div style={{ background: '#f0f2f5', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
          <strong>최종 점수 = </strong>
          <br />• 다운로드 수 × 30% (가장 중요)
          <br />• 완독률 × 25% (품질 지표)
          <br />• 평균 읽은 시간 × 15% (몰입도)
          <br />• 리뷰 점수 × 15% (만족도)
          <br />• 포스트 수 × 10% (커뮤니티 반응)
          <br />• 좋아요 수 × 5% (보조 지표)
        </div>

        <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>베이지안 평균 보정 (신뢰성 향상)</Title>
        <p><strong>문제:</strong> 리뷰 1개만 있는 5점 도서가 과대평가되는 현상</p>
        <p style={{ marginBottom: '16px' }}><strong>해결:</strong> 베이지안 평균으로 공정한 평점 계산</p>

        <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '6px', margin: '16px 0' }}>
          <strong>보정 공식:</strong><br />
          보정 평점 = [(리뷰수 ÷ (리뷰수 + 100)) × 책 평점] + [(100 ÷ (리뷰수 + 100)) × 전체 평균 4.2점]
        </div>

        <div style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>
          <strong>효과:</strong>
          <br />• 리뷰가 적으면 → 전체 평균(4.2점)에 가까워짐
          <br />• 리뷰가 많으면 → 실제 평점에 가까워짐
          <br />• 신뢰할 수 있는 평점 기준 제공
        </div>

        <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>정규화 처리 (공정한 비교)</Title>
        <p style={{ marginBottom: '16px' }}>서로 다른 범위의 데이터를 0-100 스케일로 통일하여 공정하게 비교합니다.</p>

        <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '6px', marginBottom: '32px' }}>
          <strong>정규화 공식:</strong> (개별값 ÷ 전체 최대값) × 100
          <br />
          <br /><strong>적용 데이터:</strong>
          <br />• 다운로드 수, 평균 읽은 시간, 포스트 수, 좋아요 수
          <br />• 완독률은 이미 0-100% 범위이므로 제외
        </div>

        <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>실제 계산 예시</Title>
        <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '32px' }}>
          <strong>책 A의 경우:</strong>
          <br />• 다운로드 1,000개 (전체 최대 1,500개) → 정규화: 66.7점
          <br />• 완독률 70% → 70점
          <br />• 평균 읽은 시간 35분 (전체 최대 50분) → 정규화: 70점
          <br />• 리뷰 200개, 평점 4.5점 → 베이지안 보정: 4.43점 → 리뷰점수: 886점
          <br />• 포스트 50개, 좋아요 300개 → 정규화 후 적용
          <br />
          <br /><strong>최종 점수:</strong> (66.7×0.3) + (70×0.25) + (70×0.15) + (886×0.15) + (포스트×0.1) + (좋아요×0.05)
        </div>

        <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>랭킹의 의미</Title>
        <p style={{ color: '#52c41a', fontWeight: 'bold', marginBottom: '0' }}>
          이 알고리즘으로 산출된 랭킹은 단순 인기도가 아닌,
          <strong> 실제 독서 품질과 사용자 만족도를 종합적으로 반영한 객관적 순위</strong>입니다.
        </p>
      </div>
    </Modal>
  );
};

// 도서 카테고리
const bookCategories = [
  '전체', '도슨트북', '오브제북', '오디오북', '챗북', '밀리 오리지널',
  '독립출판', '디즈니', '빨간펜 동화', '매거진', '만화', '소설',
  '세계문학전집', '경제경영', '자기계발', 'IT', '외국어', '에세이/시',
  '여행', '라이프스타일', '부모', '어린이', '청소년', '인문', '철학',
  '사회', '과학', '역사', '종교', '로맨스/BL', '판타지/무협'
];

// 베이지안 평균 보정 함수
const calculateBayesianAverage = (bookRating, bookReviewCount, globalAverage = 4.2, minReviews = 100) => {
  const n = bookReviewCount;
  const m = minReviews;
  const bookAvg = parseFloat(bookRating);

  return ((n / (n + m)) * bookAvg) + ((m / (n + m)) * globalAverage);
};

// 정규화 함수 (0-100 스케일)
const normalize = (value, maxValue) => {
  return maxValue > 0 ? (value / maxValue) * 100 : 0;
};

// 랭킹 점수 계산 함수 (베이지안 평균 및 정규화 적용)
const calculateRankingScore = (book, allBooks) => {
  // 전체 데이터에서 최대값 계산
  const maxDownloads = Math.max(...allBooks.map(b => b.downloadCount));
  const maxAvgReadingTime = Math.max(...allBooks.map(b => b.avgReadingTime));
  const maxPosts = Math.max(...allBooks.map(b => b.postCount));
  const maxLikes = Math.max(...allBooks.map(b => b.likeCount));

  // 베이지안 평균 보정 적용
  const bayesianRating = calculateBayesianAverage(book.reviewRating, book.reviewCount);

  // 정규화 적용
  const normalizedDownloads = normalize(book.downloadCount, maxDownloads);
  const normalizedCompletionRate = book.completionRate; // 이미 0-100 범위
  const normalizedAvgReadingTime = normalize(book.avgReadingTime, maxAvgReadingTime);
  const reviewScore = bayesianRating * book.reviewCount; // 베이지안 보정 평점 × 리뷰 수
  const normalizedPosts = normalize(book.postCount, maxPosts);
  const normalizedLikes = normalize(book.likeCount, maxLikes);

  const score = (normalizedDownloads * 0.30) +
                (normalizedCompletionRate * 0.25) +
                (normalizedAvgReadingTime * 0.15) +
                (reviewScore * 0.15) +
                (normalizedPosts * 0.10) +
                (normalizedLikes * 0.05);

  return Math.round(score);
};

// 더미 데이터 생성
const generateMockData = (contentType) => {
  const books = [];
  for (let i = 1; i <= 50; i++) {
    const category = bookCategories[Math.floor(Math.random() * (bookCategories.length - 1)) + 1];
    const book = {
      key: `${contentType}-${i}`,
      rank: i,
      title: `${category} ${contentType === 'ebook' ? '전자책' : '오디오북'} ${i}`,
      author: `작가 ${i}`,
      category: category,
      contentType: contentType,
      downloadCount: Math.floor(Math.random() * 10000) + 1000,
      completionRate: Math.floor(Math.random() * 100) + 1,
      avgReadingTime: Math.floor(Math.random() * 300) + 30,
      reviewRating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 500) + 10,
      postCount: Math.floor(Math.random() * 100) + 5,
      likeCount: Math.floor(Math.random() * 1000) + 50,
      isVisible: Math.random() > 0.3, // 70% 확률로 노출
    };

    books.push(book);
  }

  // 모든 도서의 종합점수 계산 (정규화를 위해 전체 데이터 필요)
  books.forEach(book => {
    book.rankingScore = calculateRankingScore(book, books);
  });

  // 종합점수로 정렬
  return books.sort((a, b) => b.rankingScore - a.rankingScore);
};

// 랭킹 테이블 컴포넌트
const RankingTable = ({ contentType, data, onVisibilityChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isAlgorithmModalVisible, setIsAlgorithmModalVisible] = useState(false);

  // 카테고리별 필터링
  const filteredData = selectedCategory === '전체'
    ? data
    : data.filter(book => book.category === selectedCategory);

  // 순위 재계산
  const dataWithRank = filteredData.map((book, index) => ({
    ...book,
    rank: index + 1
  }));

  const columns = [
    {
      title: '순위',
      dataIndex: 'rank',
      key: 'rank',
      width: 70,
    },
    {
      title: '도서명',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: '작가',
      dataIndex: 'author',
      key: 'author',
      width: 120,
    },
    {
      title: '카테고리',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: '종합점수',
      dataIndex: 'rankingScore',
      key: 'rankingScore',
      width: 120,
      sorter: (a, b) => a.rankingScore - b.rankingScore,
      render: (score) => score ? score.toLocaleString() : '0',
    },
    {
      title: '다운로드',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      width: 120,
      sorter: (a, b) => a.downloadCount - b.downloadCount,
      render: (count) => count ? count.toLocaleString() : '0',
    },
    {
      title: '완독률 (%)',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: 100,
      sorter: (a, b) => a.completionRate - b.completionRate,
    },
    {
      title: '평균 읽은 시간 (분)',
      dataIndex: 'avgReadingTime',
      key: 'avgReadingTime',
      width: 150,
      sorter: (a, b) => a.avgReadingTime - b.avgReadingTime,
      render: (time) => time ? time.toLocaleString() : '0',
    },
    {
      title: '리뷰 평점',
      dataIndex: 'reviewRating',
      key: 'reviewRating',
      width: 100,
      sorter: (a, b) => parseFloat(a.reviewRating) - parseFloat(b.reviewRating),
    },
    {
      title: '보정 평점',
      key: 'bayesianRating',
      width: 150,
      sorter: (a, b) => {
        const bayesianA = calculateBayesianAverage(a.reviewRating, a.reviewCount);
        const bayesianB = calculateBayesianAverage(b.reviewRating, b.reviewCount);
        return bayesianA - bayesianB;
      },
      render: (_, record) => {
        const bayesianRating = calculateBayesianAverage(record.reviewRating, record.reviewCount);
        return bayesianRating.toFixed(2);
      },
    },
    {
      title: '리뷰 개수',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
      width: 100,
      sorter: (a, b) => a.reviewCount - b.reviewCount,
      render: (count) => count ? count.toLocaleString() : '0',
    },
    {
      title: '포스트 수',
      dataIndex: 'postCount',
      key: 'postCount',
      width: 100,
      sorter: (a, b) => a.postCount - b.postCount,
      render: (count) => count ? count.toLocaleString() : '0',
    },
    {
      title: '좋아요',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 110,
      sorter: (a, b) => a.likeCount - b.likeCount,
      render: (count) => count ? count.toLocaleString() : '0',
    },
    {
      title: '노출 상태',
      key: 'visibility',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Switch
          checked={record.isVisible}
          onChange={(checked) => onVisibilityChange(record.key, checked)}
          checkedChildren="노출"
          unCheckedChildren="숨김"
        />
      ),
    },
  ];

  return (
    <>
      <TopRankingChart data={dataWithRank} contentType={contentType} />

      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ marginRight: '10px', fontWeight: 'bold' }}>카테고리 필터:</span>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
            >
              {bookCategories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </div>
                    <Button
            type="default"
            onClick={() => setIsAlgorithmModalVisible(true)}
            style={{ background: '#f0f2f5' }}
          >
            랭킹 알고리즘 설명
          </Button>
        </div>

        <div style={{ color: '#666', fontSize: '14px' }}>
          총 {dataWithRank.length}개의 {contentType === 'ebook' ? '전자책' : '오디오북'}이 검색되었습니다.
        </div>
      </Card>

      <Table
        columns={columns}
        dataSource={dataWithRank}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 1600 }}
        size="middle"
      />

      <AlgorithmExplanation
        visible={isAlgorithmModalVisible}
        onClose={() => setIsAlgorithmModalVisible(false)}
      />
    </>
  );
};

// 차트 컴포넌트
const TopRankingChart = ({ data, contentType }) => {
  // 상위 12위 데이터 추출
  const topBooks = data.slice(0, 12);

  const chartData = {
    labels: topBooks.map(book => book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title),
    datasets: [
      {
        label: '종합점수',
        data: topBooks.map(book => book.rankingScore),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hidden: false, // 기본적으로 표시
      },
      {
        label: '다운로드',
        data: topBooks.map(book => book.downloadCount / 100), // 스케일 조정
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hidden: true, // 기본적으로 숨김
      },
      {
        label: '완독률 (%)',
        data: topBooks.map(book => book.completionRate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hidden: true, // 기본적으로 숨김
      },
      {
        label: '평균 읽은 시간',
        data: topBooks.map(book => book.avgReadingTime),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        hidden: true, // 기본적으로 숨김
      },
      {
        label: '리뷰 점수',
        data: topBooks.map(book => parseFloat(book.reviewRating) * 100), // 스케일 조정
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        hidden: true, // 기본적으로 숨김
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
        onClick: function(e, legendItem, legend) {
          const index = legendItem.datasetIndex;
          const chart = legend.chart;

          // 모든 데이터셋을 숨김
          chart.data.datasets.forEach((dataset, i) => {
            chart.setDatasetVisibility(i, false);
          });

          // 클릭한 데이터셋만 표시
          chart.setDatasetVisibility(index, true);
          chart.update();
        },
      },
      title: {
        display: true,
        text: `상위 12위 ${contentType === 'ebook' ? '전자책' : '오디오북'} 랭킹`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const book = topBooks[context.dataIndex];
            const datasetLabel = context.dataset.label;
            let value = context.parsed.x;

            if (datasetLabel === '다운로드') {
              value = book.downloadCount;
              return `${datasetLabel}: ${value.toLocaleString()}`;
            } else if (datasetLabel === '리뷰 점수') {
              value = book.reviewRating;
              return `${datasetLabel}: ${value}점 (${book.reviewCount}개 리뷰)`;
            } else if (datasetLabel === '완독률 (%)') {
              return `${datasetLabel}: ${value}%`;
            } else if (datasetLabel === '평균 읽은 시간') {
              return `${datasetLabel}: ${value}분`;
            } else {
              return `${datasetLabel}: ${value.toLocaleString()}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: false,
        },
      },
      y: {
        title: {
          display: false,
        },
      },
    },
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
};

const BookRankingManagement = () => {
  const [ebookData, setEbookData] = useState(() => generateMockData('ebook'));
  const [audiobookData, setAudiobookData] = useState(() => generateMockData('audiobook'));

  // 스위치 변경 핸들러
  const handleVisibilityChange = (key, checked) => {
    const contentType = key.split('-')[0];

    if (contentType === 'ebook') {
      setEbookData(prevData =>
        prevData.map(book =>
          book.key === key ? { ...book, isVisible: checked } : book
        )
      );
    } else {
      setAudiobookData(prevData =>
        prevData.map(book =>
          book.key === key ? { ...book, isVisible: checked } : book
        )
      );
    }
  };

  const tabItems = [
    {
      key: 'ebook',
      label: '전자책 랭킹',
      children: (
        <RankingTable
          contentType="ebook"
          data={ebookData}
          onVisibilityChange={handleVisibilityChange}
        />
      ),
    },
    {
      key: 'audiobook',
      label: '오디오북 랭킹',
      children: (
        <RankingTable
          contentType="audiobook"
          data={audiobookData}
          onVisibilityChange={handleVisibilityChange}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={4}>랭킹 관리</Title>

      <Tabs
        defaultActiveKey="ebook"
        items={tabItems}
        size="large"
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default BookRankingManagement;
