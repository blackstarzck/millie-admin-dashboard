import React, { useState, useEffect, useRef } from 'react';
import {
    Row,
    Col,
    Card,
    Statistic,
    DatePicker,
    Table,
    Typography,
    Space,
    Tag,
    Progress,
    Tabs,
    List,
    Radio,
    Button,
} from 'antd';
import {
    SearchOutlined,
    GlobalOutlined,
    ShareAltOutlined,
    MobileOutlined,
    DesktopOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const { Title: AntTitle, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 샘플 데이터 생성
const generateSampleData = () => {
    return {
        search: {
            google: { visits: 3500, device: { pc: 65, mobile: 35 } },
            naver: { visits: 2500, device: { pc: 45, mobile: 55 } },
            daum: { visits: 1200, device: { pc: 55, mobile: 45 } },
            zoom: { visits: 800, device: { pc: 70, mobile: 30 } },
            bing: { visits: 500, device: { pc: 60, mobile: 40 } },
            other: { visits: 300, device: { pc: 50, mobile: 50 } },
        },
        social: {
            kakao: { visits: 2000, device: { pc: 30, mobile: 70 } },
            facebook: { visits: 1500, device: { pc: 40, mobile: 60 } },
            instagram: { visits: 1800, device: { pc: 25, mobile: 75 } },
            twitter: { visits: 900, device: { pc: 45, mobile: 55 } },
            youtube: { visits: 1200, device: { pc: 35, mobile: 65 } },
            other: { visits: 400, device: { pc: 40, mobile: 60 } },
        },
        other: {
            direct: { visits: 3000, device: { pc: 55, mobile: 45 } },
            ai: { visits: 800, device: { pc: 75, mobile: 25 } },
        }
    };
};

const ReferrerPath = () => {
    const [period, setPeriod] = useState('daily');
    const [data, setData] = useState(generateSampleData());

    // 기간별 데이터 생성 함수
    const generatePeriodData = (period) => {
        const now = moment();
        let labels = [];
        let searchData = [];
        let socialData = [];
        let otherData = [];
        let prevSearchData = [];
        let prevSocialData = [];
        let prevOtherData = [];

        switch (period) {
            case 'daily':
                for (let i = 14; i >= 0; i--) {
                    labels.push(now.clone().subtract(i, 'days').format('MM/DD'));
                    searchData.push(Math.floor(Math.random() * 1000) + 500);
                    socialData.push(Math.floor(Math.random() * 800) + 300);
                    otherData.push(Math.floor(Math.random() * 600) + 200);
                    prevSearchData.push(Math.floor(Math.random() * 1000) + 500);
                    prevSocialData.push(Math.floor(Math.random() * 800) + 300);
                    prevOtherData.push(Math.floor(Math.random() * 600) + 200);
                }
                break;
            case 'weekly':
                for (let i = 14; i >= 0; i--) {
                    const startDate = now.clone().subtract(i, 'weeks');
                    const endDate = startDate.clone().add(6, 'days');
                    labels.push(`${startDate.format('MM/DD')}~${endDate.format('MM/DD')}`);
                    searchData.push(Math.floor(Math.random() * 5000) + 2000);
                    socialData.push(Math.floor(Math.random() * 4000) + 1500);
                    otherData.push(Math.floor(Math.random() * 3000) + 1000);
                    prevSearchData.push(Math.floor(Math.random() * 5000) + 2000);
                    prevSocialData.push(Math.floor(Math.random() * 4000) + 1500);
                    prevOtherData.push(Math.floor(Math.random() * 3000) + 1000);
                }
                break;
            case 'monthly':
                for (let i = 14; i >= 0; i--) {
                    labels.push(now.clone().subtract(i, 'months').format('YYYY/MM'));
                    searchData.push(Math.floor(Math.random() * 20000) + 10000);
                    socialData.push(Math.floor(Math.random() * 15000) + 8000);
                    otherData.push(Math.floor(Math.random() * 10000) + 5000);
                    prevSearchData.push(Math.floor(Math.random() * 20000) + 10000);
                    prevSocialData.push(Math.floor(Math.random() * 15000) + 8000);
                    prevOtherData.push(Math.floor(Math.random() * 10000) + 5000);
                }
                break;
        }

        return { 
            labels, 
            searchData, 
            socialData, 
            otherData,
            prevSearchData,
            prevSocialData,
            prevOtherData
        };
    };

    const periodData = generatePeriodData(period);

    const chartData = {
        labels: periodData.labels,
        datasets: [
            {
                label: '현재',
                data: periodData.labels.map((_, index) => 
                    periodData.searchData[index] + 
                    periodData.socialData[index] + 
                    periodData.otherData[index]
                ),
                backgroundColor: '#1890ff',
            },
            {
                label: '이전',
                data: periodData.labels.map((_, index) => 
                    periodData.prevSearchData[index] + 
                    periodData.prevSocialData[index] + 
                    periodData.prevOtherData[index]
                ),
                backgroundColor: 'rgba(24, 144, 255, 0.3)',
            }
        ],
    };

    const getOrCreateTooltip = (chart) => {
        let tooltipEl = chart.canvas.parentNode.querySelector('div');
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
            tooltipEl.style.borderRadius = '3px';
            tooltipEl.style.color = 'white';
            tooltipEl.style.opacity = 1;
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.transform = 'translate(-50%, 0)';
            tooltipEl.style.transition = 'all .1s ease';
            const table = document.createElement('table');
            table.style.margin = '0px';
            tooltipEl.appendChild(table);
            chart.canvas.parentNode.appendChild(tooltipEl);
        }
        return tooltipEl;
    };

    const externalTooltipHandler = (context) => {
        const {chart, tooltip} = context;
        const tooltipEl = getOrCreateTooltip(chart);

        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        if (tooltip.body) {
            const titleLines = tooltip.title || [];
            const bodyLines = tooltip.body.map(b => b.lines);

            const tableHead = document.createElement('thead');
            titleLines.forEach(title => {
                const tr = document.createElement('tr');
                tr.style.borderWidth = 0;
                const th = document.createElement('th');
                th.style.borderWidth = 0;
                const text = document.createTextNode(title);
                th.appendChild(text);
                tr.appendChild(th);
                tableHead.appendChild(tr);
            });

            const tableBody = document.createElement('tbody');
            bodyLines.forEach((body, i) => {
                const colors = tooltip.labelColors[i];
                const span = document.createElement('span');
                span.style.background = colors.backgroundColor;
                span.style.borderColor = colors.borderColor;
                span.style.borderWidth = '2px';
                span.style.marginRight = '10px';
                span.style.height = '10px';
                span.style.width = '10px';
                span.style.display = 'inline-block';

                const tr = document.createElement('tr');
                tr.style.backgroundColor = 'inherit';
                tr.style.borderWidth = 0;

                const td = document.createElement('td');
                td.style.borderWidth = 0;
                td.style.color = body[0].includes('증감') ? 
                    (body[0].includes('▲') ? '#ff4d4f' : '#1890ff') : 'white';
                
                const text = document.createTextNode(body);
                td.appendChild(span);
                td.appendChild(text);
                tr.appendChild(td);
                tableBody.appendChild(tr);
            });

            const tableRoot = tooltipEl.querySelector('table');
            while (tableRoot.firstChild) {
                tableRoot.firstChild.remove();
            }
            tableRoot.appendChild(tableHead);
            tableRoot.appendChild(tableBody);
        }

        const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 12,
                    padding: 15
                }
            },
            title: {
                display: false,
                text: '유입 경로별 방문자 수 추이',
            },
            tooltip: {
                callbacks: {
                    title: function(context) {
                        const isPrev = context[0].datasetIndex === 1;
                        const periodText = period === 'daily' ? '어제' : 
                                         period === 'weekly' ? '저번주' : '저번달';
                        return isPrev ? periodText : '현재';
                    },
                    label: function(context) {
                        const dataset = context.dataset;
                        const isPrev = context.datasetIndex === 1;
                        const value = context.raw;
                        
                        if (isPrev) {
                            return `${value.toLocaleString()}명`;
                        } else {
                            const prevValue = context.chart.data.datasets[1].data[context.dataIndex];
                            const diff = value - prevValue;
                            const diffPercentage = Math.round((diff / prevValue) * 100);
                            
                            const isIncrease = diff >= 0;
                            const diffIcon = isIncrease ? '▲' : '▼';
                            
                            return [
                                `${value.toLocaleString()}명`,
                                `${diffIcon} ${Math.abs(diff).toLocaleString()}명 (${diffPercentage}%)`
                            ];
                        }
                    }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: function(context) {
                    if (!context || !context[0]) return '#fff';
                    
                    const tooltipItem = context[0];
                    if (tooltipItem.datasetIndex === 1) return '#fff';
                    
                    const currentValue = tooltipItem.raw;
                    const prevValue = tooltipItem.chart.data.datasets[1].data[tooltipItem.dataIndex];
                    const diff = currentValue - prevValue;
                    
                    return diff >= 0 ? '#ff4d4f' : '#1890ff';
                },
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                usePointStyle: true
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '방문자 수',
                },
            },
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        interaction: {
            mode: 'index',
            intersect: false,
            axis: 'x'
        }
    };

    // 데이터 변환 함수
    const transformData = (data, type) => {
        const totalVisits = Object.values(data[type]).reduce((sum, item) => sum + item.visits, 0);
        return Object.entries(data[type]).map(([key, value]) => ({
            key,
            name: key === 'direct' ? '직접유입' : 
                  key === 'ai' ? '기타유입' : 
                  key.charAt(0).toUpperCase() + key.slice(1),
            visits: value.visits,
            percentage: Math.round((value.visits / totalVisits) * 100),
            device: value.device,
        }));
    };

    // 디바이스 데이터 변환 함수
    const transformDeviceData = (data) => {
        const allData = {
            ...data.search,
            ...data.social,
            ...data.other
        };

        const totalVisits = Object.values(allData).reduce((sum, item) => sum + item.visits, 0);
        const pcVisits = Object.values(allData).reduce((sum, item) => sum + (item.visits * item.device.pc / 100), 0);
        const mobileVisits = Object.values(allData).reduce((sum, item) => sum + (item.visits * item.device.mobile / 100), 0);

        return [
            {
                key: 'pc',
                name: 'PC',
                visits: Math.round(pcVisits),
                percentage: Math.round((pcVisits / totalVisits) * 100)
            },
            {
                key: 'mobile',
                name: '모바일',
                visits: Math.round(mobileVisits),
                percentage: Math.round((mobileVisits / totalVisits) * 100)
            }
        ];
    };

    const renderListItem = (item) => (
        <List.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text>{item.name}</Text>
                <Space>
                    <Text>{item.visits.toLocaleString()}명</Text>
                    <Text type="secondary">({item.percentage}%)</Text>
                </Space>
            </Space>
        </List.Item>
    );

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <AntTitle level={2}><SearchOutlined /> 유입 경로 분석</AntTitle>

             <Card size="small">
                <Space>
                    <Radio.Group value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <Radio.Button value="daily">일간</Radio.Button>
                        <Radio.Button value="weekly">주간</Radio.Button>
                        <Radio.Button value="monthly">월간</Radio.Button>
                    </Radio.Group>
                </Space>
            </Card>

            <Card size="small">
                <div style={{ height: '300px' }}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card 
                        title="검색 엔진 유입" 
                        size="small"
                        style={{ height: '100%' }}
                    >
                        <List
                            size="small"
                            dataSource={transformData(data, 'search')}
                            renderItem={renderListItem}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card 
                        title="SNS 유입" 
                        size="small"
                        style={{ height: '100%' }}
                    >
                        <List
                            size="small"
                            dataSource={transformData(data, 'social')}
                            renderItem={renderListItem}
                        />
                     </Card>
                 </Col>
                <Col span={6}>
                    <Card 
                        title="기타 유입" 
                        size="small"
                        style={{ height: '100%' }}
                    >
                        <List
                            size="small"
                            dataSource={transformData(data, 'other')}
                            renderItem={renderListItem}
                        />
                     </Card>
                 </Col>
                <Col span={6}>
                    <Card 
                        title="디바이스별 유입" 
                        size="small"
                        style={{ height: '100%' }}
                    >
                        <List
                    size="small"
                            dataSource={transformDeviceData(data)}
                            renderItem={renderListItem}
                 />
            </Card>
                </Col>
            </Row>
        </Space>
    );
};

export default ReferrerPath; 