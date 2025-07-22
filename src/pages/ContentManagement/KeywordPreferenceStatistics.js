import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Select,
  DatePicker,
  Button,
  Statistic,
  Divider,
  Tabs,
  Table,
  Tag,
  Badge,
  Tooltip,
  Progress,
} from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  StarOutlined,
  StarFilled,
  RiseOutlined,
  EyeOutlined,
  DownloadOutlined,
  CalendarOutlined,
  FilterOutlined,
} from "@ant-design/icons";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const { Title: AntTitle, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const KeywordPreferenceStatistics = () => {
  const [selectedRating, setSelectedRating] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [statistics, setStatistics] = useState([]);

  // 샘플 데이터 - 실제로는 API에서 가져올 데이터
  useEffect(() => {
    const sampleData = [
      // 모든 키워드 통합 데이터
      {
        keyword: "스토리가 흥미로워요",
        usage: 1250,
        percentage: 8.5,
        trend: 12.3,
        rating: 5,
      },
      {
        keyword: "몰입감이 엄청나요",
        usage: 980,
        percentage: 6.7,
        trend: 8.7,
        rating: 5,
      },
      {
        keyword: "다시 읽고 싶어요",
        usage: 856,
        percentage: 5.8,
        trend: 15.2,
        rating: 5,
      },
      {
        keyword: "인사이트가 깊어요",
        usage: 743,
        percentage: 5.1,
        trend: -2.1,
        rating: 5,
      },
      {
        keyword: "감동적이에요",
        usage: 654,
        percentage: 4.5,
        trend: 5.8,
        rating: 5,
      },
      {
        keyword: "유쾌하고 재밌어요",
        usage: 892,
        percentage: 6.1,
        trend: 7.8,
        rating: 4,
      },
      {
        keyword: "전개가 반전이에요",
        usage: 756,
        percentage: 5.2,
        trend: 14.2,
        rating: 4,
      },
      {
        keyword: "문장이 매끄러워요",
        usage: 654,
        percentage: 4.5,
        trend: 3.1,
        rating: 4,
      },
      {
        keyword: "내용이 잘 정리되어 있어요",
        usage: 543,
        percentage: 3.7,
        trend: -1.2,
        rating: 4,
      },
      {
        keyword: "길이가 적당해요",
        usage: 432,
        percentage: 3.0,
        trend: 8.9,
        rating: 4,
      },
      {
        keyword: "입문자에게 좋아요",
        usage: 654,
        percentage: 4.5,
        trend: 5.4,
        rating: 3,
      },
      {
        keyword: "실무에 도움돼요",
        usage: 543,
        percentage: 3.7,
        trend: 8.9,
        rating: 3,
      },
      {
        keyword: "학생에게 추천해요",
        usage: 432,
        percentage: 3.0,
        trend: 12.1,
        rating: 3,
      },
      {
        keyword: "구성이 탄탄해요",
        usage: 387,
        percentage: 2.6,
        trend: -2.3,
        rating: 3,
      },
      {
        keyword: "정보가 유익해요",
        usage: 387,
        percentage: 2.6,
        trend: 12.4,
        rating: 4,
      },
      {
        keyword: "생각하게 만들어요",
        usage: 298,
        percentage: 2.0,
        trend: 6.7,
        rating: 4,
      },
      {
        keyword: "공감이 많이 돼요",
        usage: 245,
        percentage: 1.7,
        trend: 4.3,
        rating: 4,
      },
      {
        keyword: "짧은 시간에 읽기 좋아요",
        usage: 198,
        percentage: 1.4,
        trend: 9.8,
        rating: 4,
      },
      {
        keyword: "삽화/디자인이 예뻐요",
        usage: 156,
        percentage: 1.1,
        trend: 15.6,
        rating: 4,
      },
      {
        keyword: "토론용으로 좋아요",
        usage: 198,
        percentage: 1.4,
        trend: 9.2,
        rating: 3,
      },
      {
        keyword: "선물용으로도 좋을 듯해요",
        usage: 432,
        percentage: 3.0,
        trend: 22.1,
        rating: 5,
      },
      {
        keyword: "집중해서 읽어야 해요",
        usage: 432,
        percentage: 3.0,
        trend: -8.7,
        rating: 2,
      },
      {
        keyword: "조금 지루했어요",
        usage: 387,
        percentage: 2.6,
        trend: -12.3,
        rating: 2,
      },
      {
        keyword: "삽화/디자인이 예뻐요",
        usage: 198,
        percentage: 1.4,
        trend: 8.9,
        rating: 1,
      },
      {
        keyword: "길이가 적당해요",
        usage: 156,
        percentage: 1.1,
        trend: 2.3,
        rating: 1,
      },
      {
        keyword: "전개가 반전이에요",
        usage: 98,
        percentage: 0.7,
        trend: 12.4,
        rating: 1,
      },
      {
        keyword: "인사이트가 깊어요",
        usage: 76,
        percentage: 0.5,
        trend: -3.1,
        rating: 1,
      },
      {
        keyword: "토론용으로 좋아요",
        usage: 54,
        percentage: 0.4,
        trend: 4.7,
        rating: 1,
      },
      {
        keyword: "선물용으로도 좋을 듯해요",
        usage: 43,
        percentage: 0.3,
        trend: 8.9,
        rating: 1,
      },
      {
        keyword: "유쾌하고 재밌어요",
        usage: 32,
        percentage: 0.2,
        trend: 6.2,
        rating: 1,
      },
    ];

    setStatistics(sampleData);
  }, []);

  // 필터링된 데이터
  const getFilteredData = () => {
    if (selectedRating === "all") {
      return statistics;
    } else {
      return statistics.filter(
        (item) => item.rating === parseInt(selectedRating)
      );
    }
  };

  const filteredData = getFilteredData();

  // 점수별 색상 매핑
  const getRatingColor = (rating) => {
    const colors = {
      1: "#ff4d4f",
      2: "#ff7a45",
      3: "#ffa940",
      4: "#52c41a",
      5: "#1890ff",
    };
    return colors[rating] || "#d9d9d9";
  };

  // 점수별 별표 렌더링
  const renderStars = (rating) => {
    return (
      <Space>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarFilled style={{ color: getRatingColor(rating) }} />
            ) : (
              <StarOutlined style={{ color: "#d9d9d9" }} />
            )}
          </span>
        ))}
      </Space>
    );
  };

  // 전체 통계 계산
  const getOverallStats = () => {
    const totalUsage = statistics.reduce((sum, item) => sum + item.usage, 0);

    const ratingTotals = {};
    statistics.forEach((item) => {
      ratingTotals[item.rating] = (ratingTotals[item.rating] || 0) + item.usage;
    });

    return { totalUsage, ratingTotals };
  };

  const { totalUsage, ratingTotals } = getOverallStats();

  // 차트 데이터 준비
  const getChartData = () => {
    return filteredData.map((item) => ({
      keyword: item.keyword,
      usage: item.usage,
      percentage: item.percentage,
      trend: item.trend,
      rating: item.rating,
    }));
  };

  const chartData = getChartData();

  // Chart.js 데이터 형식으로 변환
  const getPieChartData = () => {
    const data = getChartData();
    return {
      labels: data.map((item) => item.keyword),
      datasets: [
        {
          data: data.map((item) => item.usage),
          backgroundColor: data.map((item) => getRatingColor(item.rating)),
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  };

  const getBarChartData = () => {
    const data = getChartData();
    return {
      labels: data.map((item) => item.keyword),
      datasets: [
        {
          label: "사용 횟수",
          data: data.map((item) => item.usage),
          backgroundColor: data.map((item) => getRatingColor(item.rating)),
          borderColor: data.map((item) => getRatingColor(item.rating)),
          borderWidth: 1,
        },
      ],
    };
  };

  const getLineChartData = () => {
    const data = getChartData();
    return {
      labels: data.map((item) => item.keyword),
      datasets: [
        {
          label: "증감률 (%)",
          data: data.map((item) => item.trend || 0),
          borderColor: "#1890ff",
          backgroundColor: "#1890ff20",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${
              context.parsed.y?.toLocaleString() ||
              context.parsed.toLocaleString()
            }회`;
          },
        },
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${
              context.label
            }: ${context.parsed.toLocaleString()}회 (${percentage}%)`;
          },
        },
      },
    },
  };

  // 테이블용 데이터 준비
  const getTableData = () => {
    return filteredData.map((item, index) => ({
      key: index,
      keyword: item.keyword,
      usage: item.usage,
      percentage: item.percentage,
      trend: item.trend,
      rating: item.rating,
    }));
  };

  const tableData = getTableData();

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "순위",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      render: (_, __, index) => {
        const rank = index + 1;
        const color = rank <= 10 ? "#1890ff" : "#666";

        return (
          <Text strong style={{ color }}>
            {rank}
          </Text>
        );
      },
    },
    {
      title: "키워드",
      dataIndex: "keyword",
      key: "keyword",
      render: (keyword) => <Text strong>{keyword}</Text>,
    },
    {
      title: "점수",
      dataIndex: "rating",
      key: "rating",
      width: 80,
      render: (rating) => <Space>{renderStars(rating)}</Space>,
    },
    {
      title: "사용 횟수",
      dataIndex: "usage",
      key: "usage",
      width: 120,
      render: (usage) => (
        <Text style={{ color: "#1890ff" }}>{usage.toLocaleString()}회</Text>
      ),
    },
    {
      title: "비율",
      dataIndex: "percentage",
      key: "percentage",
      width: 120,
      render: (percentage) => (
        <Progress
          percent={parseFloat(percentage)}
          size="small"
          strokeColor="#1890ff"
          showInfo={false}
        />
      ),
    },
    {
      title: "증감률",
      dataIndex: "trend",
      key: "trend",
      width: 120,
      render: (trend) => (
        <Space>
          <RiseOutlined
            style={{
              color: trend > 0 ? "#52c41a" : trend < 0 ? "#ff4d4f" : "#d9d9d9",
              transform: trend < 0 ? "rotate(180deg)" : "none",
            }}
          />
          <Text
            style={{
              color: trend > 0 ? "#52c41a" : trend < 0 ? "#ff4d4f" : "#d9d9d9",
            }}
          >
            {trend > 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </Text>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "24px" }}
        >
          <Col>
            <AntTitle level={2}>키워드별 선호도 통계</AntTitle>
            <Text type="secondary">
              각 점수별 키워드의 사용 빈도와 선호도를 분석합니다.
            </Text>
          </Col>
        </Row>

        {/* 필터 섹션 */}
        <Card size="small" style={{ marginBottom: "24px" }}>
          <Row gutter={16} align="middle">
            <Col>
              <Text strong>점수 선택:</Text>
            </Col>
            <Col>
              <Select
                value={selectedRating}
                onChange={setSelectedRating}
                style={{ width: 120 }}
              >
                <Option value="all">전체</Option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Option key={rating} value={rating}>
                    <Space>
                      {renderStars(rating)}
                      <span>{rating}점</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Text strong>기간:</Text>
            </Col>
            <Col>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder={["시작일", "종료일"]}
              />
            </Col>
            <Col>
              <Button type="primary" icon={<FilterOutlined />}>
                필터 적용
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 전체 통계 */}
        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="총 사용 횟수"
                value={totalUsage.toLocaleString()}
                suffix="회"
                prefix={<EyeOutlined />}
              />
            </Card>
          </Col>
          {Object.keys(ratingTotals).map((rating) => (
            <Col key={rating} span={3}>
              <Card size="small">
                <Statistic
                  title={`${rating}점`}
                  value={ratingTotals[rating].toLocaleString()}
                  suffix="회"
                  valueStyle={{ color: getRatingColor(parseInt(rating)) }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        {/* 차트 및 상세 통계 */}
        <Tabs
          defaultActiveKey="chart"
          items={[
            {
              key: "chart",
              label: "차트 보기",
              children: (
                <Row gutter={24}>
                  <Col span={12}>
                    <Card title="키워드별 사용량" size="small">
                      <div style={{ height: "300px" }}>
                        <Bar
                          data={getBarChartData()}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              x: {
                                ticks: {
                                  maxRotation: 45,
                                  minRotation: 45,
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="트렌드 분석" size="small">
                      <div style={{ height: "300px" }}>
                        <Line
                          data={getLineChartData()}
                          options={{
                            ...chartOptions,
                            plugins: {
                              ...chartOptions.plugins,
                              legend: {
                                display: false,
                              },
                            },
                            scales: {
                              x: {
                                ticks: {
                                  maxRotation: 45,
                                  minRotation: 45,
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: "table",
              label: "상세 통계",
              children: (
                <Card size="small">
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    size="small"
                  />
                </Card>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default KeywordPreferenceStatistics;
