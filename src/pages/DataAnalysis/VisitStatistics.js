import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Row,
    Col,
    Card,
    Statistic,
    DatePicker,
    Table,
    Typography,
    Space,
    Button,
    Select,
    List,
    Tag,
    Modal,
    Descriptions,
    Image,
    Checkbox,
    Radio,
} from 'antd';
import {
    LineChartOutlined,
    AreaChartOutlined,
    UserOutlined,
    EyeOutlined,
    BookOutlined,
    CalendarOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import moment from 'moment';
// Chart.js 및 react-chartjs-2 임포트
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartJsTitle,
  Tooltip as ChartJsTooltip,
  Legend as ChartJsLegend,
  Filler, // 그라데이션 채우기를 위한 Filler 플러그인
  BarElement, // 시간대별 통계를 위한 BarElement 추가
  ArcElement // 도넛 차트를 위한 ArcElement 추가
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2'; // Doughnut 컴포넌트 추가

// --- Chart.js 플러그인: 도넛 중앙 텍스트 --- (컴포넌트 외부 또는 최상단에 정의)
const centerTextPlugin = {
    id: 'centerTextPlugin',
    afterDraw: (chart) => {
        if (chart.config.type === 'doughnut' && chart.options.plugins.centerTextPlugin && chart.options.plugins.centerTextPlugin.display) {
            const ctx = chart.ctx;
            const { width, height } = chart.chartArea;
            const pluginOptions = chart.options.plugins.centerTextPlugin;
            const { textLines, textColor } = pluginOptions;
            let fontStyle = pluginOptions.fontStyle || '16px Arial';
            const fontWeight = pluginOptions.fontWeight || ''; // fontWeight 옵션 가져오기

            ctx.save();
            // fontWeight와 fontStyle을 조합하여 ctx.font 설정
            ctx.font = `${fontWeight} ${fontStyle}`.trim(); 
            ctx.fillStyle = textColor || '#666';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const centerX = width / 2;
            const centerY = height / 2;
            
            // lineHeight 계산 시 폰트 크기 부분만 정확히 추출 시도
            const fontSizeMatch = fontStyle.match(/(\d+)px/); // "16px Arial"에서 "16" 추출
            const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1], 10) : 16; // 기본값 16px
            const lineHeight = fontSize * 1.2;

            if (textLines && textLines.length > 0) {
                if (textLines.length === 1) {
                    ctx.fillText(textLines[0], centerX, centerY);
                } else if (textLines.length > 1) {
                    ctx.fillText(textLines[0], centerX, centerY - lineHeight / 2);
                    ctx.fillText(textLines[1], centerX, centerY + lineHeight / 2);
                }
            }
            ctx.restore();
        }
    }
};
ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, ChartJsTitle, ChartJsTooltip, ChartJsLegend, Filler, BarElement, ArcElement,
    centerTextPlugin // 플러그인 등록
);

const { Title, Text, Link: AntLink } = Typography; // Ant Design의 Link와 구분하기 위해 AntLink로 변경
const { RangePicker } = DatePicker;
const { Option } = Select;

// 샘플 데이터 생성 함수 추가
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

// --- Top-level Constants & Utility functions ---
const AGE_GROUPS_KEYS = ['10s', '20s', '30s', '40s', '50+'];
const AGE_LABELS = { '10s': '10대', '20s': '20대', '30s': '30대', '40s': '40대', '50+': '50대 이상' };
const GENDER_BASE_COLORS_HSL = { Male: { h: 210, s: 70, labelPrefix: '남성' }, Female: { h: 340, s: 80, labelPrefix: '여성' } };
const AGE_LIGHTNESS_MAP = { '10s': 75, '20s': 65, '30s': 55, '40s': 45, '50+': 35 };
const WEEKDAYS_OPTIONS = [ { label: '월', value: 'Mon' }, { label: '화', value: 'Tue' }, { label: '수', value: 'Wed' }, { label: '목', value: 'Thu' }, { label: '금', value: 'Fri' }, { label: '토', value: 'Sat' }, { label: '일', value: 'Sun' }];
const GENDER_OPTIONS = [ { label: '전체', value: 'All' }, { label: '남성', value: 'Male' }, { label: '여성', value: 'Female' } ];
const AGE_GROUP_OPTIONS = [ { label: '10대', value: '10s' }, { label: '20대', value: '20s' }, { label: '30대', value: '30s' }, { label: '40대', value: '40s' }, { label: '50대 이상', value: '50+' } ];
const initialStats = { totalVisits: 125830, todayVisits: 850, yesterdayVisits: 780, totalPageViews: 480200, todayPageViews: 2100 };
const initialDateRange = [moment().subtract(6, 'days'), moment()];

const generateDailyData = (startDate, endDate) => {
    const data = [];
    let current = moment(startDate);
    while (current.isSameOrBefore(endDate, 'day')) {
        const visits = 500 + Math.floor(Math.random() * 500);
        const pageViews = visits * (1.5 + Math.random() * 3);
        data.push({ key: current.format('YYYY-MM-DD'), date: current.format('YYYY-MM-DD (ddd)'), visits: Math.max(50, visits), pageViews: Math.floor(pageViews) });
        current.add(1, 'day');
    }
    return data;
};
const initialDailyData = generateDailyData(initialDateRange[0], initialDateRange[1]);

const createChartData = (dailyData) => {
    const labels = dailyData.map(d => d.date.substring(5, 10));
    return {
        labels,
        datasets: [
            {
                label: '방문수',
                data: dailyData.map(d => d.visits),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: (context) => { const chart = context.chart; const {ctx, chartArea} = chart; if (!chartArea) return null; const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top); gradient.addColorStop(0, 'rgba(54, 162, 235, 0)'); gradient.addColorStop(1, 'rgba(54, 162, 235, 0.3)'); return gradient; },
                fill: true, tension: 0.3,
            },
            {
                label: '페이지뷰',
                data: dailyData.map(d => d.pageViews),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: (context) => { const chart = context.chart; const {ctx, chartArea} = chart; if (!chartArea) return null; const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top); gradient.addColorStop(0, 'rgba(75, 192, 192, 0)'); gradient.addColorStop(1, 'rgba(75, 192, 192, 0.3)'); return gradient; },
                fill: true, tension: 0.3,
            }
        ]
    };
};
const initialVisitTrendData = createChartData(initialDailyData);

const visitTrendChartOptions = {
    responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false }, },
    scales: { x: { title: { display: false, text: '날짜' } }, y: { type: 'logarithmic', display: true, position: 'left', title: { display: false }, grid: { drawOnChartArea: true, drawBorder: false, color: 'rgba(0,0,0,0.05)' }, ticks: { callback: function(value) { return Number(value.toString()).toLocaleString();}}}}
};

const generateDetailedHourlyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = {};
    const peakHoursByDay = { Mon: { start: 9, end: 18, factor: 1.2 }, Tue: { start: 9, end: 18, factor: 1.2 }, Wed: { start: 9, end: 18, factor: 1.3 }, Thu: { start: 9, end: 18, factor: 1.1 }, Fri: { start: 10, end: 20, factor: 1.5 }, Sat: { start: 11, end: 22, factor: 1.8 }, Sun: { start: 10, end: 21, factor: 1.6 } };
    days.forEach(day => { data[day] = Array.from({ length: 24 }, (_, hour) => { const hourData = { demographics: { male: {}, female: {} } }; let baseVisit = Math.random() * 20 + 5; if (hour >= peakHoursByDay[day].start && hour <= peakHoursByDay[day].end) { baseVisit *= peakHoursByDay[day].factor; } ['male', 'female'].forEach(gender => { AGE_GROUPS_KEYS.forEach(ageGroup => { let demographicFactor = 1; if (gender === 'female' && (ageGroup === '20s' || ageGroup === '30s')) demographicFactor = 1.2; if (gender === 'male' && (ageGroup === '30s' || ageGroup === '40s')) demographicFactor = 1.1; if (hour >= 18 && hour <= 22 && (ageGroup === '10s' || ageGroup === '20s')) demographicFactor *= 1.3; hourData.demographics[gender][ageGroup] = Math.floor(baseVisit * demographicFactor * Math.random() * 0.3); }); }); return hourData; }); });
    return data;
};

const popularBookDataAll = [ { key: 'b1', id: 1, title: '달러구트 꿈 백화점', author: '이미예', publisher: '팩토리나인', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book1', description: '잠들어야만 입장 가능한 꿈 백화점에서 일어나는 비밀스럽고도 기묘하며 가슴 뭉클한 판타지 소설', visits: 580, link: '/content/books/1' },  { key: 'b2', id: 2, title: '시간을 파는 상점', author: '김선영', publisher: '자음과모음', category: '청소년 소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book2', description: '시간을 파는 특별한 상점을 둘러싼 흥미로운 이야기', visits: 450, link: '/content/books/2' },  { key: 'b3', id: 3, title: '팩트풀니스', author: '한스 로슬링', publisher: '김영사', category: '사회과학', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book3', description: '우리가 세상을 오해하는 10가지 이유와 세상이 생각보다 괜찮은 이유', visits: 320, link: '/content/books/3' },  { key: 'b4', id: 4, title: '어린이라는 세계', author: '김소영', publisher: '사계절', category: '에세이', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book4', description: '어린이들의 시선으로 세상을 바라보는 따뜻한 이야기', visits: 210, link: '/content/books/4' },  { key: 'b5', id: 5, title: '불편한 편의점', author: '김호연', publisher: '나무옆의자', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book5', description: '서울역 뒤편 골목길의 작은 편의점에서 벌어지는 이야기', visits: 150, link: '/content/books/5' },  { key: 'b6', id: 6, title: '책 6', author: '저자 6', publisher: '출판사 6', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book6', description: '...', visits: 140, link: '/content/books/6' },  { key: 'b7', id: 7, title: '책 7', author: '저자 7', publisher: '출판사 7', category: '에세이', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book7', description: '...', visits: 130, link: '/content/books/7' },  { key: 'b8', id: 8, title: '책 8', author: '저자 8', publisher: '출판사 8', category: '자기계발', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book8', description: '...', visits: 120, link: '/content/books/8' },  { key: 'b9', id: 9, title: '책 9', author: '저자 9', publisher: '출판사 9', category: '역사', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book9', description: '...', visits: 110, link: '/content/books/9' },  { key: 'b10', id: 10, title: '책 10', author: '저자 10', publisher: '출판사 10', category: '과학', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book10', description: '...', visits: 100, link: '/content/books/10' },  { key: 'b11', id: 11, title: '책 11', author: '저자 11', publisher: '출판사 11', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book11', description: '...', visits: 95, link: '/content/books/11' },  { key: 'b12', id: 12, title: '책 12', author: '저자 12', publisher: '출판사 12', category: '청소년', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book12', description: '...', visits: 90, link: '/content/books/12' },  { key: 'b13', id: 13, title: '책 13', author: '저자 13', publisher: '출판사 13', category: '사회', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book13', description: '...', visits: 85, link: '/content/books/13' },  { key: 'b14', id: 14, title: '책 14', author: '저자 14', publisher: '출판사 14', category: '에세이', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book14', description: '...', visits: 80, link: '/content/books/14' },  { key: 'b15', id: 15, title: '책 15', author: '저자 15', publisher: '출판사 15', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book15', description: '...', visits: 75, link: '/content/books/15' },  { key: 'b16', id: 16, title: '책 16', author: '저자 16', publisher: '출판사 16', category: '인문', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book16', description: '...', visits: 70, link: '/content/books/16' },  { key: 'b17', id: 17, title: '책 17', author: '저자 17', publisher: '출판사 17', category: '경제', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book17', description: '...', visits: 65, link: '/content/books/17' },  { key: 'b18', id: 18, title: '책 18', author: '저자 18', publisher: '출판사 18', category: '기술', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book18', description: '...', visits: 60, link: '/content/books/18' },  { key: 'b19', id: 19, title: '책 19', author: '저자 19', publisher: '출판사 19', category: '예술', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book19', description: '...', visits: 55, link: '/content/books/19' },  { key: 'b20', id: 20, title: '책 20', author: '저자 20', publisher: '출판사 20', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book20', description: '...', visits: 50, link: '/content/books/20' }, ];

const VisitStatistics = () => {
    const [stats, setStats] = useState(initialStats);
    const [dateRange, setDateRange] = useState(initialDateRange);
    const [isBookDetailModalVisible, setIsBookDetailModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [visibleBookCount, setVisibleBookCount] = useState(10);
    
    // States for Visit Trend Line Chart (Restored)
    const [currentChartData, setCurrentChartData] = useState(initialVisitTrendData);
    const [showVisitsLine, setShowVisitsLine] = useState(true); // Not used in UI yet, but for data gen
    const [showPageViewsLine, setShowPageViewsLine] = useState(true); // Not used in UI yet, but for data gen

    // States for Hourly Bar Chart and Peak Doughnut Charts
    const [selectedWeekdays, setSelectedWeekdays] = useState('Mon');
    const [hourlyVisitStatData, setHourlyVisitStatData] = useState({ labels: [], datasets: [] });
    const [topPeakHoursDetails, setTopPeakHoursDetails] = useState([]);
    const [selectedGender, setSelectedGender] = useState('All');
    const [selectedAgeGroup, setSelectedAgeGroup] = useState(AGE_GROUPS_KEYS);
    const chartRefs = [useRef(null), useRef(null), useRef(null)]; // 각 도넛 차트 인스턴스 참조
    const [hiddenDoughnutSegments, setHiddenDoughnutSegments] = useState({}); // { peakIndex: { segmentLabel: boolean } }
    const [compareDate, setCompareDate] = useState(moment().subtract(1, 'days'));

    const allTimeHourlyData = useMemo(() => generateDetailedHourlyData(), []);

    // Function for Visit Trend Line Chart data generation (Restored)
    const generateDynamicChartData = (dailyData, showVisits, showPageViews) => {
        const labels = dailyData.map(d => d.date.substring(5, 10));
        const datasets = [];
        if (showVisits) {
            datasets.push({ label: '방문수', data: dailyData.map(d => d.visits), borderColor: 'rgb(54, 162, 235)', backgroundColor: (context) => { const chart = context.chart; const {ctx, chartArea} = chart; if (!chartArea) return null; const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top); gradient.addColorStop(0, 'rgba(54, 162, 235, 0)'); gradient.addColorStop(1, 'rgba(54, 162, 235, 0.3)'); return gradient; }, fill: true, tension: 0.3 });
        }
        if (showPageViews) {
            datasets.push({ label: '페이지뷰', data: dailyData.map(d => d.pageViews), borderColor: 'rgb(75, 192, 192)', backgroundColor: (context) => { const chart = context.chart; const {ctx, chartArea} = chart; if (!chartArea) return null; const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top); gradient.addColorStop(0, 'rgba(75, 192, 192, 0)'); gradient.addColorStop(1, 'rgba(75, 192, 192, 0.3)'); return gradient; }, fill: true, tension: 0.3 });
        }
        return { labels, datasets };
    };

    // useEffect for Visit Trend Line Chart (Restored)
    useEffect(() => {
        if (dateRange && dateRange.length === 2) {
            const newData = generateDailyData(dateRange[0], dateRange[1]);
            setCurrentChartData(generateDynamicChartData(newData, showVisitsLine, showPageViewsLine));
        }
    }, [dateRange, showVisitsLine, showPageViewsLine]);

    // --- Chart Options (defined inside component) ---
    const hourlyVisitChartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 15, padding: 10 } }, title: { display: false }, tooltip: { mode: 'index', intersect: false, callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) label += ': '; if (context.parsed.y !== null) label += context.parsed.y.toLocaleString() + '명'; return label; }, footer: function(tooltipItems) { let sum = 0; tooltipItems.forEach(tooltipItem => sum += tooltipItem.parsed.y); return '총 방문 (해당 시간): ' + sum.toLocaleString() + '명';} } } },
        scales: { x: { title: { display: true, text: '시간' }, stacked: true }, y: { title: { display: true, text: '방문수' }, beginAtZero: true, stacked: true }, }
    };
    const basePeakDoughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: function(context) { let label = context.label || ''; if (label) label += ': '; const value = context.parsed; if (value !== null) { const sum = context.dataset.data.reduce((a, b) => a + b, 0); const percentage = sum > 0 ? ((value / sum) * 100).toFixed(1) + '%' : '0%'; label += value.toLocaleString() + '명 (' + percentage + ')'; } return label; } } },
            centerTextPlugin: { // 플러그인 기본 설정 (display는 동적으로 제어)
                display: true, // 기본적으로 표시, 동적으로 덮어쓸 수 있음
                fontStyle: 'bold 1rem Arial', // 기본 폰트 스타일
                textColor: '#333'
            }
        }
    };

    // useEffect for Bar chart and Doughnut charts (Main detailed logic)
    useEffect(() => {
        const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        const finalBarDatasets = [];
        const totalVisitsForAllDemographics = Array(24).fill(0);

        if (selectedWeekdays && allTimeHourlyData) {
            const dayHourlyRawData = allTimeHourlyData[selectedWeekdays];
            
            if (dayHourlyRawData) {
                for (let hour = 0; hour < 24; hour++) {
                    let hourlySumAll = 0;
                    AGE_GROUPS_KEYS.forEach(ageKey => {
                        hourlySumAll += dayHourlyRawData[hour]?.demographics?.male?.[ageKey] || 0;
                        hourlySumAll += dayHourlyRawData[hour]?.demographics?.female?.[ageKey] || 0;
                    });
                    totalVisitsForAllDemographics[hour] = hourlySumAll;
                }
            }

            const sortedSelectedAgeGroupForBar = AGE_GROUPS_KEYS.filter(key => selectedAgeGroup.includes(key));
            if ((selectedGender === 'All' || selectedGender === 'Male') && sortedSelectedAgeGroupForBar.length > 0 && dayHourlyRawData) {
                sortedSelectedAgeGroupForBar.forEach(ageKey => {
                    const maleBase = GENDER_BASE_COLORS_HSL.Male;
                    const lightness = AGE_LIGHTNESS_MAP[ageKey];
                    const maleDataForAge = Array(24).fill(0);
                    for (let hour = 0; hour < 24; hour++) maleDataForAge[hour] = dayHourlyRawData[hour]?.demographics?.male?.[ageKey] || 0;
                    finalBarDatasets.push({ label: `${AGE_LABELS[ageKey]} ${maleBase.labelPrefix}`, data: maleDataForAge, backgroundColor: `hsla(${maleBase.h}, ${maleBase.s}%, ${lightness}%, 0.7)`, borderColor: `hsl(${maleBase.h}, ${maleBase.s}%, ${Math.max(0, lightness-10)}%)`, borderWidth: 1, stack: 'singleStack' });
                });
            }
            if ((selectedGender === 'All' || selectedGender === 'Female') && sortedSelectedAgeGroupForBar.length > 0 && dayHourlyRawData) {
                sortedSelectedAgeGroupForBar.forEach(ageKey => {
                    const femaleBase = GENDER_BASE_COLORS_HSL.Female;
                    const lightness = AGE_LIGHTNESS_MAP[ageKey];
                    const femaleDataForAge = Array(24).fill(0);
                    for (let hour = 0; hour < 24; hour++) femaleDataForAge[hour] = dayHourlyRawData[hour]?.demographics?.female?.[ageKey] || 0;
                    finalBarDatasets.push({ label: `${AGE_LABELS[ageKey]} ${femaleBase.labelPrefix}`, data: femaleDataForAge, backgroundColor: `hsla(${femaleBase.h}, ${femaleBase.s}%, ${lightness}%, 0.7)`, borderColor: `hsl(${femaleBase.h}, ${femaleBase.s}%, ${Math.max(0, lightness-10)}%)`, borderWidth: 1, stack: 'singleStack' });
                });
            }
        }
        setHourlyVisitStatData({ labels, datasets: finalBarDatasets });

        // --- 상위 3개 피크 시간 도넛 차트 데이터 구성 ---
        const peakHourCalcData = totalVisitsForAllDemographics.map((visits, hour) => ({ hour, visits }));
        const top3PeakHoursRaw = [...peakHourCalcData].sort((a, b) => b.visits - a.visits).slice(0, 3).filter(item => item.visits > 0);

        const newTopPeakHoursDetails = [];
        const newHiddenSegments = {}; // useEffect 실행시마다 hidden 상태 초기화 또는 기존 상태 유지 로직 필요 (여기선 단순 초기화)

        if (selectedWeekdays && allTimeHourlyData && top3PeakHoursRaw.length > 0) {
            const dayHourlyRawData = allTimeHourlyData[selectedWeekdays];

            if (dayHourlyRawData) {
                top3PeakHoursRaw.forEach((peakHourInfo, peakIndex) => {
                    newHiddenSegments[peakIndex] = hiddenDoughnutSegments[peakIndex] || {}; // 기존 숨김 상태 유지 시도
                    const peakHourActual = peakHourInfo.hour;
                    const totalVisitsUnfiltered = peakHourInfo.visits;
                    const peakHourDemographicsData = dayHourlyRawData[peakHourActual]?.demographics;
                    
                    const allPossibleSegmentsForPeak = []; // 이 피크 시간, 현재 필터에 맞는 모든 세그먼트 후보
                    let filteredTotalVisitsInPeak = 0; // 현재 필터 적용된 방문자 수 합계 (도넛 중앙 텍스트용)

                    if (peakHourDemographicsData) {
                        const sortedSelectedAgeGroupForDoughnut = AGE_GROUPS_KEYS.filter(key => selectedAgeGroup.includes(key));
                        
                        // 남성 데이터 후보 수집
                        if (selectedGender === 'All' || selectedGender === 'Male') {
                            sortedSelectedAgeGroupForDoughnut.forEach(ageKey => {
                                const visits = peakHourDemographicsData.male?.[ageKey] || 0;
                                if (visits > 0) {
                                    const style = GENDER_BASE_COLORS_HSL.Male;
                                    const lightness = AGE_LIGHTNESS_MAP[ageKey];
                                    const color = `hsla(${style.h}, ${style.s}%, ${lightness}%, 0.7)`;
                                    const label = `${AGE_LABELS[ageKey]} ${style.labelPrefix}`;
                                    allPossibleSegmentsForPeak.push({ label, visits, color, originalColor: color });
                                    filteredTotalVisitsInPeak += visits;
                                }
                            });
                        }
                        // 여성 데이터 후보 수집
                        if (selectedGender === 'All' || selectedGender === 'Female') {
                            sortedSelectedAgeGroupForDoughnut.forEach(ageKey => {
                                const visits = peakHourDemographicsData.female?.[ageKey] || 0;
                                if (visits > 0) {
                                    const style = GENDER_BASE_COLORS_HSL.Female;
                                    const lightness = AGE_LIGHTNESS_MAP[ageKey];
                                    const color = `hsla(${style.h}, ${style.s}%, ${lightness}%, 0.7)`;
                                    const label = `${AGE_LABELS[ageKey]} ${style.labelPrefix}`;
                                    allPossibleSegmentsForPeak.push({ label, visits, color, originalColor: color });
                                    filteredTotalVisitsInPeak += visits;
                                }
                            });
                        }
                    }

                    // 실제 도넛 차트에 표시될 데이터 (숨김 처리된 세그먼트 제외)
                    const visibleSegments = allPossibleSegmentsForPeak.filter(seg => !newHiddenSegments[peakIndex]?.[seg.label]);
                    
                    const doughnutLabels = visibleSegments.map(s => s.label);
                    const doughnutDataValues = visibleSegments.map(s => s.visits);
                    const doughnutBackgroundColors = visibleSegments.map(s => s.color);

                    // 상세 리스트용 데이터 (숨김 상태와 무관하게 모든 잠재적 세그먼트, 정렬 및 백분율은 filteredTotal 기준)
                    const sortedSegmentDetails = allPossibleSegmentsForPeak.sort((a, b) => b.visits - a.visits)
                        .map(segment => ({
                            ...segment,
                            percentageString: filteredTotalVisitsInPeak > 0 ? ((segment.visits / filteredTotalVisitsInPeak) * 100).toFixed(1) + '%' : '0%',
                            isHidden: newHiddenSegments[peakIndex]?.[segment.label] || false
                        }));

                    if (allPossibleSegmentsForPeak.length > 0) { // 필터링된 잠재적 데이터가 있는 경우에만 세부 정보 객체 생성
                        newTopPeakHoursDetails.push({
                            hour: peakHourActual,
                            totalVisitsUnfiltered: totalVisitsUnfiltered,
                            doughnutChartData: { 
                                labels: doughnutLabels, 
                                datasets: [{ 
                                    data: doughnutDataValues, 
                                    backgroundColor: doughnutBackgroundColors, 
                                    hoverOffset: 4 
                                }]
                            },
                            segmentDetails: sortedSegmentDetails,
                            filteredTotalVisitsInPeak: filteredTotalVisitsInPeak
                        });
                    } else {
                         // 해당 피크 시간에 현재 필터로 표시할 데이터가 없는 경우, 빈 데이터라도 넣어 UI 일관성 유지
                        newTopPeakHoursDetails.push({
                            hour: peakHourActual,
                            totalVisitsUnfiltered: totalVisitsUnfiltered,
                            doughnutChartData: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
                            segmentDetails: [],
                            filteredTotalVisitsInPeak: 0
                        });
                    }
                });
            }
        }
        setTopPeakHoursDetails(newTopPeakHoursDetails);
        // setHiddenDoughnutSegments(prev => ({...prev, ...newHiddenSegments})); // 숨김 상태 유지 로직 개선 필요

    }, [selectedWeekdays, selectedGender, selectedAgeGroup, allTimeHourlyData, hiddenDoughnutSegments]); // hiddenDoughnutSegments 의존성 추가
    
    const handleSegmentToggle = (peakChartIndex, segmentLabel) => {
        setHiddenDoughnutSegments(prev => {
            const peakHiddenSegments = prev[peakChartIndex] || {};
            return {
                ...prev,
                [peakChartIndex]: {
                    ...peakHiddenSegments,
                    [segmentLabel]: !peakHiddenSegments[segmentLabel]
                }
            };
        });
    };

    // --- Handler Functions --- 
    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            setDateRange(dates);
        } else {
            setDateRange(initialDateRange);
        }
    };
    const setPresetDateRange = (type) => {
        let start, end = moment();
        switch(type) {
            case '7days': 
                start = moment().subtract(6, 'days'); 
                break;
            case 'thisMonth': 
                start = moment().startOf('month'); 
                break;
            case 'lastMonth': 
                start = moment().subtract(1, 'month').startOf('month'); 
                end = moment().subtract(1, 'month').endOf('month'); 
                break;
            case '3months':
                start = moment().subtract(3, 'months').add(1, 'day');
                end = moment();
                break;
            default: 
                start = moment().subtract(6, 'days');
        }
        setDateRange([start, end]);
    };
    const showBookDetailModal = (book) => {
        setSelectedBook(book);
        setIsBookDetailModalVisible(true);
    };
    const handleBookDetailModalClose = () => {
        setIsBookDetailModalVisible(false);
        setSelectedBook(null);
    };
    const loadMoreBooks = () => setVisibleBookCount(prevCount => prevCount + 10);
    const popularBookColumns = [
        {
            title: '도서명',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <AntLink onClick={() => showBookDetailModal(record)}>{text}</AntLink>
            ),
        },
        {
            title: '조회 수',
            dataIndex: 'visits',
            key: 'visits',
            align: 'right',
            width: 100,
            render: (text) => text.toLocaleString(),
        },
    ];
    const displayedPopularBooks = popularBookDataAll.slice(0, visibleBookCount);

    // 유입 경로 분석 관련 상태와 함수를 별도의 컴포넌트로 분리
    const ReferrerPathAnalysis = () => {
        const [refPeriod, setRefPeriod] = useState('daily');
        const [refSelectedDate, setRefSelectedDate] = useState(null);
        const [refData, setRefData] = useState(generateSampleData());
        const refChartRef = useRef(null);

        const refPeriodData = generatePeriodData(refPeriod);

        // 차트 클릭 이벤트 핸들러
        const handleRefChartClick = (event) => {
            if (!refChartRef.current) return;
            
            const chart = refChartRef.current;
            const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
            
            if (points.length) {
                const firstPoint = points[0];
                const index = firstPoint.index;
                const selectedDate = refPeriodData.labels[index];
                setRefSelectedDate(selectedDate);
                setRefData(generateSelectedDateData(selectedDate));
            }
        };

        // 선택된 날짜의 데이터 생성 함수
        const generateSelectedDateData = (date) => {
            // Simple hash function to make data vary with date
            let seed = 0;
            if (date) { // Ensure date is not null/undefined
                for (let i = 0; i < date.length; i++) {
                    seed = (seed << 5) - seed + date.charCodeAt(i);
                    seed |= 0; // Convert to 32bit integer
                }
            }

            const randomFactor = (val) => Math.max(10, Math.floor(val * (0.8 + (Math.abs(seed % 100) / 250)))); // Vary by +/- 20%

            const searchData = {
                google: { visits: randomFactor(700), device: { pc: 65, mobile: 35 } },
                naver: { visits: randomFactor(600), device: { pc: 45, mobile: 55 } },
                daum: { visits: randomFactor(400), device: { pc: 55, mobile: 45 } },
                zoom: { visits: randomFactor(250), device: { pc: 70, mobile: 30 } },
                bing: { visits: randomFactor(150), device: { pc: 60, mobile: 40 } },
                other: { visits: randomFactor(100), device: { pc: 50, mobile: 50 } },
            };
            const socialData = {
                kakao: { visits: randomFactor(500), device: { pc: 30, mobile: 70 } },
                facebook: { visits: randomFactor(450), device: { pc: 40, mobile: 60 } },
                instagram: { visits: randomFactor(550), device: { pc: 25, mobile: 75 } },
                twitter: { visits: randomFactor(200), device: { pc: 45, mobile: 55 } },
                youtube: { visits: randomFactor(300), device: { pc: 35, mobile: 65 } },
                other: { visits: randomFactor(100), device: { pc: 40, mobile: 60 } },
            };
            const otherData = {
                direct: { visits: randomFactor(800), device: { pc: 55, mobile: 45 } },
                ai: { visits: randomFactor(200), device: { pc: 75, mobile: 25 } },
            };

            return {
                search: searchData,
                social: socialData,
                other: otherData
            };
        };

        const refChartData = {
            labels: refPeriodData.labels,
            datasets: [
                {
                    label: '현재',
                    data: refPeriodData.labels.map((_, index) => 
                        refPeriodData.searchData[index] + 
                        refPeriodData.socialData[index] + 
                        refPeriodData.otherData[index]
                    ),
                    backgroundColor: '#1890ff',
                },
                {
                    label: '이전',
                    data: refPeriodData.labels.map((_, index) => 
                        refPeriodData.prevSearchData[index] + 
                        refPeriodData.prevSocialData[index] + 
                        refPeriodData.prevOtherData[index]
                    ),
                    backgroundColor: 'rgba(24, 144, 255, 0.3)',
                }
            ],
        };

        const refChartOptions = {
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
                            const periodText = refPeriod === 'daily' ? '어제' : 
                                             refPeriod === 'weekly' ? '저번주' : '저번달';
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
            <>
                <Title level={2}><SearchOutlined /> 유입 경로 분석</Title>

                <Card size="small">
                    <Space>
                        <Radio.Group value={refPeriod} onChange={(e) => setRefPeriod(e.target.value)}>
                            <Radio.Button value="daily">일간</Radio.Button>
                            <Radio.Button value="weekly">주간</Radio.Button>
                            <Radio.Button value="monthly">월간</Radio.Button>
                        </Radio.Group>
                        {refSelectedDate && (
                            <Text type="secondary" style={{ marginLeft: 16 }}>
                                선택된 기간: {refSelectedDate}
                            </Text>
                        )}
                    </Space>
                </Card>

                <Card size="small">
                    <div style={{ height: '300px' }}>
                        <Bar 
                            ref={refChartRef}
                            data={refChartData} 
                            options={refChartOptions} 
                            onClick={handleRefChartClick}
                        />
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
                                dataSource={transformData(refData, 'search')}
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
                                dataSource={transformData(refData, 'social')}
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
                                dataSource={transformData(refData, 'other')}
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
                                dataSource={transformDeviceData(refData)}
                                renderItem={renderListItem}
                            />
                        </Card>
                    </Col>
                </Row>
            </>
        );
    };

    // 더미 비교 데이터 생성 함수
    const generateCompareData = (baseData, date) => {
        return baseData.map(peakDetail => {
            // 각 세그먼트별로 다른 변동폭 적용
            return {
                ...peakDetail,
                segmentDetails: peakDetail.segmentDetails.map(segment => {
                    // 각 세그먼트별로 -30% ~ +30% 사이의 랜덤 변동
                    const randomFactor = 0.7 + Math.random() * 0.6;
                    const newVisits = Math.floor(segment.visits * randomFactor);
                    return {
                        ...segment,
                        visits: newVisits,
                        percentageString: ((newVisits / (peakDetail.totalVisitsUnfiltered * randomFactor)) * 100).toFixed(1) + '%'
                    };
                }),
                totalVisitsUnfiltered: Math.floor(peakDetail.totalVisitsUnfiltered * (0.7 + Math.random() * 0.6))
            };
        });
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><AreaChartOutlined /> 방문 통계</Title>
             <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} md={6}><Card size="small"><Statistic title="총 방문" value={stats.totalVisits} formatter={(value) => value.toLocaleString()} /></Card></Col>
                <Col xs={12} sm={12} md={6}><Card size="small"><Statistic title="오늘 방문" value={stats.todayVisits} formatter={(value) => value.toLocaleString()} /></Card></Col>
                <Col xs={12} sm={12} md={6}><Card size="small"><Statistic title="어제 방문" value={stats.yesterdayVisits} formatter={(value) => value.toLocaleString()} /></Card></Col>
                <Col xs={12} sm={12} md={6}><Card size="small"><Statistic title="오늘 페이지뷰" value={stats.todayPageViews} formatter={(value) => value.toLocaleString()} /></Card></Col>
            </Row>
            <Row gutter={[16, 16]} align="stretch">
                <Col xs={24} lg={16}>
                    <Card title="방문 추이" style={{ height: '100%' }}>
                        <Space wrap align="center" style={{ justifyContent:"space-between", marginBottom: 16, width: '100%' }}>
                            <Space wrap>
                                <Button.Group>
                                    <Button onClick={() => setPresetDateRange('7days')}>7일</Button>
                                    <Button onClick={() => setPresetDateRange('thisMonth')}>이번달</Button>
                                    <Button onClick={() => setPresetDateRange('lastMonth')}>지난달</Button>
                                    <Button onClick={() => setPresetDateRange('3months')}>3개월</Button>
                                </Button.Group>
                                <RangePicker value={dateRange} onChange={handleDateChange} allowClear />
                            </Space>
                        </Space>
                        <div style={{ height: '350px', position: 'relative' }}>
                            <Line options={visitTrendChartOptions} data={currentChartData} />
                        </div>
                    </Card>
                </Col>
                 <Col xs={24} lg={8}>
                     <Card title={<><BookOutlined /> 인기 도서</>} style={{ height: '100%' }} bodyStyle={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 56px)' }}>
                         <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, minHeight: 0 }}>
                             <Table columns={popularBookColumns} dataSource={displayedPopularBooks} size="small" pagination={false} rowKey="key" />
                         </div>
                         {visibleBookCount < popularBookDataAll.length && (<Button onClick={loadMoreBooks} style={{ width: '100%' }}>더보기</Button> )}
                     </Card>
                 </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="시간대별 방문 통계">
                        <Space wrap style={{ marginBottom: 16, alignItems: 'center' }}>
                            {WEEKDAYS_OPTIONS.map(day => (
                                <Button key={day.value} type={selectedWeekdays === day.value ? 'primary' : 'default'} onClick={() => setSelectedWeekdays(day.value)}>{day.label}</Button>
                            ))}
                            <Select value={selectedGender} style={{ width: 100, marginLeft: 8 }} onChange={(value) => setSelectedGender(value)} options={GENDER_OPTIONS} />
                            <Select value={selectedAgeGroup} style={{ minWidth: 250, marginLeft: 8 }} onChange={(value) => setSelectedAgeGroup(value)} options={AGE_GROUP_OPTIONS} mode="multiple" allowClear maxTagCount="responsive" />
                        </Space>
                        <div style={{ height: '350px', position: 'relative' }}>
                            <Bar options={hourlyVisitChartOptions} data={hourlyVisitStatData} />
                        </div>
                    </Card>
                </Col>
            </Row>

            {topPeakHoursDetails.length > 0 && <Title level={4} style={{marginTop: 24}}>주요 피크 시간 상세 분포</Title>}
            <Row gutter={[16, 24]}>
                {topPeakHoursDetails.map((peakDetail, peakIndex) => {
                    const compareData = generateCompareData([peakDetail], compareDate)[0];
                    
                    // 대비되는 색상 생성 함수
                    const getContrastColor = (color) => {
                        // HSL 색상에서 색상각을 180도 회전하여 보색 생성
                        const hsl = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%[^)]*\)/);
                        if (hsl) {
                            const [_, h, s, l] = hsl;
                            // 색상각을 180도 회전 (0-360 범위 내에서)
                            const newH = (parseInt(h) + 180) % 360;
                            // 채도와 명도는 유지
                            return `hsla(${newH}, ${s}%, ${l}%, 0.7)`;
                        }
                        return color + '80'; // 기본 투명도 적용
                    };

                    const barChartData = {
                        labels: peakDetail.segmentDetails.map(seg => seg.label),
                        datasets: [
                            {
                                label: `${selectedWeekdays} (${moment().format('MM/DD')})`,
                                data: peakDetail.segmentDetails.map(seg => seg.visits),
                                backgroundColor: peakDetail.segmentDetails.map(seg => seg.originalColor),
                                borderColor: peakDetail.segmentDetails.map(seg => seg.originalColor),
                                borderWidth: 1
                            },
                            {
                                label: `${WEEKDAYS_OPTIONS.find(d => d.value === moment(compareDate).format('ddd'))?.label} (${moment(compareDate).format('MM/DD')})`,
                                data: compareData.segmentDetails.map(seg => seg.visits),
                                backgroundColor: peakDetail.segmentDetails.map(seg => getContrastColor(seg.originalColor)),
                                borderColor: peakDetail.segmentDetails.map(seg => getContrastColor(seg.originalColor)),
                                borderWidth: 1
                            }
                        ]
                    };

                    const barChartOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                    font: {
                                        size: 12
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const value = context.raw;
                                        const dataset = context.dataset;
                                        const total = dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        const diff = context.datasetIndex === 0 ? 
                                            value - context.chart.data.datasets[1].data[context.dataIndex] :
                                            value - context.chart.data.datasets[0].data[context.dataIndex];
                                        const diffPercentage = ((diff / (value - diff)) * 100).toFixed(1);
                                        
                                        return [
                                            `${dataset.label}: ${value.toLocaleString()}명 (${percentage}%)`,
                                            diff !== 0 ? `${diff > 0 ? '▲' : '▼'} ${Math.abs(diff).toLocaleString()}명 (${diffPercentage}%)` : '변동 없음'
                                        ];
                                    }
                                }
                            },
                            title: {
                                display: false // 기존 타이틀 제거
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: '방문자 수'
                                },
                                ticks: {
                                    callback: function(value) {
                                        return value.toLocaleString();
                                    }
                                }
                            },
                            y: {
                                ticks: {
                                    font: {
                                        size: 12
                                    }
                                }
                            }
                        }
                    };

                    return (
                        <Col key={`peak-${peakDetail.hour}-${peakIndex}`} xs={24} md={12} lg={8}>
                            <Card 
                                bordered={false}
                                headStyle={{borderBottom: '1px solid #f0f0f0', textAlign: 'center'}}
                                style={{ height: '100%' }}
                                title={
                                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                                        <Text strong>{WEEKDAYS_OPTIONS.find(d => d.value === selectedWeekdays)?.label}요일 ({moment().format('MM/DD')})</Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>{peakDetail.hour}:00-{peakDetail.hour + 1}:00</Text>
                                    </Space>
                                }
                                extra={
                                    <DatePicker
                                        value={compareDate}
                                        onChange={(date) => setCompareDate(date)}
                                        allowClear={false}
                                        style={{ width: 120 }}
                                    />
                                }
                            >
                                {peakDetail.segmentDetails.length > 0 ? (
                                    <>
                                        <div style={{ height: '300px', position: 'relative', marginBottom: 16 }}>
                                            <Bar 
                                                data={barChartData}
                                                options={{
                                                    ...barChartOptions,
                                                    plugins: {
                                                        ...barChartOptions.plugins,
                                                        title: {
                                                            display: false // 기존 타이틀 제거
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                        <List
                                            size="small"
                                            dataSource={peakDetail.segmentDetails}
                                            renderItem={(segment) => {
                                                const isHidden = hiddenDoughnutSegments[peakIndex]?.[segment.label] || false;
                                                const compareSegment = compareData.segmentDetails.find(s => s.label === segment.label);
                                                const diff = segment.visits - compareSegment.visits;
                                                const diffPercentage = ((diff / compareSegment.visits) * 100).toFixed(1);
                                                
                                                return (
                                                    <List.Item 
                                                        style={{padding: '8px 0', cursor:'pointer', opacity: isHidden ? 0.5 : 1}}
                                                        onClick={() => handleSegmentToggle(peakIndex, segment.label)}
                                                    >
                                                        <Tag color={segment.originalColor} style={{ marginRight: 8, minWidth: '15px', height:'15px', borderRadius:'50%', opacity: isHidden ? 0.5 : 1 }} />
                                                        <Text style={{ flex: 1, textDecoration: isHidden ? 'line-through' : 'none' }}>{segment.label}</Text>
                                                        <Space direction="vertical" align="end" size={0}>
                                                            <Space>
                                                                <Text strong>{segment.visits.toLocaleString()}명</Text>
                                                                <Text type="secondary">({segment.percentageString})</Text>
                                                            </Space>
                                                            <Space>
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {moment(compareDate).format('MM/DD')}: {compareSegment.visits.toLocaleString()}명
                                                                </Text>
                                                                {diff !== 0 && (
                                                                    <Text type={diff > 0 ? 'success' : 'danger'} style={{ fontSize: '12px' }}>
                                                                        {diff > 0 ? '▲' : '▼'} {Math.abs(diff).toLocaleString()}명 ({diffPercentage}%)
                                                                    </Text>
                                                                )}
                                                            </Space>
                                                        </Space>
                                                    </List.Item>
                                                );
                                            }}
                                        />
                                    </>    
                                ) : (
                                    <Text type="secondary">선택된 필터 조건에 해당하는 방문 데이터가 없습니다.</Text>
                                )}
                            </Card>
                        </Col>
                    );
                })}
            </Row>
            {topPeakHoursDetails.length === 0 && selectedWeekdays && (
                 <Card>
                    <Text type="secondary">선택된 요일에 방문 데이터가 없거나, 피크 시간대 방문이 없습니다.</Text>
                </Card>
            )}
            
            <Modal title="도서 상세 정보" open={isBookDetailModalVisible} onCancel={handleBookDetailModalClose} footer={[ <Button key="close" onClick={handleBookDetailModalClose}>닫기</Button>, <Button key="edit" type="primary" href={selectedBook?.link ? `/content/books/edit/${selectedBook.id}` : '#'} >도서 관리로 이동</Button>, ]} width={600} > {selectedBook && ( <Row gutter={16}> <Col span={8}> <Image width="100%" src={selectedBook.coverUrl || 'https://via.placeholder.com/150?text=No+Image'} alt={selectedBook.title} fallback="https://via.placeholder.com/150?text=Error" /> </Col> <Col span={16}> <Descriptions bordered column={1} size="small"> <Descriptions.Item label="제목">{selectedBook.title}</Descriptions.Item> <Descriptions.Item label="저자">{selectedBook.author}</Descriptions.Item> <Descriptions.Item label="출판사">{selectedBook.publisher}</Descriptions.Item> <Descriptions.Item label="카테고리">{selectedBook.category}</Descriptions.Item> <Descriptions.Item label="설명">{selectedBook.description}</Descriptions.Item> <Descriptions.Item label="방문자 수 (선택 기간)">{selectedBook.visits?.toLocaleString()}</Descriptions.Item> </Descriptions> </Col> </Row> )} </Modal>

            {/* 유입 경로 분석 */}
            <ReferrerPathAnalysis />
        </Space>
    );
};

export default VisitStatistics; 