import {
  AndroidOutlined,
  AppleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DesktopOutlined,
  FacebookOutlined,
  GoogleOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
  TabletOutlined,
  UserOutlined,
  WechatOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import moment from 'moment';
import 'moment/locale/ko';
import React, { useEffect, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';

// moment 한국어 설정
moment.locale('ko');

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Sample Data - 등록된 기기 정보 생성 함수
const generateDevices = (count) => {
    const deviceTypes = ['mobile', 'tablet', 'desktop'];
    const osTypes = {
        mobile: ['iOS', 'Android'],
        tablet: ['iOS', 'Android'],
        desktop: ['Windows', 'macOS', 'Linux']
    };
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];

    const devices = [];
    for (let i = 0; i < count; i++) {
        const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
        const os = osTypes[deviceType][Math.floor(Math.random() * osTypes[deviceType].length)];
        const browser = deviceType === 'desktop' ? browsers[Math.floor(Math.random() * browsers.length)] : null;

        // 랜덤한 최근 접속일 생성 (최근 30일 내)
        const daysAgo = Math.floor(Math.random() * 30);
        const lastAccess = moment().subtract(daysAgo, 'days').format('YYYY-MM-DD HH:mm:ss');

        // 랜덤한 등록일 생성 (30일~365일 전)
        const daysAgoReg = 30 + Math.floor(Math.random() * 335);
        const registeredAt = moment().subtract(daysAgoReg, 'days').format('YYYY-MM-DD HH:mm:ss');

        devices.push({
            key: `device${i + 1}`,
            deviceId: `device_${Math.random().toString(36).substring(2, 15)}`,
            deviceType,
            os,
            osVersion: os === 'iOS' ? `${15 + Math.floor(Math.random() * 3)}.${Math.floor(Math.random() * 5)}` :
                       os === 'Android' ? `${11 + Math.floor(Math.random() * 3)}` :
                       os === 'Windows' ? '10' : os === 'macOS' ? 'Ventura' : 'Ubuntu 22.04',
            browser: browser,
            browserVersion: browser ? `${90 + Math.floor(Math.random() * 30)}.0` : null,
            deviceName: deviceType === 'mobile' ?
                (os === 'iOS' ? `iPhone ${12 + Math.floor(Math.random() * 3)}` : 'Galaxy S22') :
                deviceType === 'tablet' ?
                (os === 'iOS' ? 'iPad Pro' : 'Galaxy Tab') :
                os === 'Windows' ? 'Windows PC' : os === 'macOS' ? 'MacBook Pro' : 'Linux PC',
            registeredAt,
            lastAccess,
            isActive: daysAgo < 7
        });
    }
    return devices;
};

const initialUsers = [
    { key: '1', userId: 'user001', name: '홍길동', email: 'gildong@example.com', phone: '010-1234-5678', signupDate: '2024-07-01 10:30:00', lastLogin: '2024-07-25 15:00:00', status: 'active', userGroup: ' 일반', purchaseAmount: 50000, suspensionReason: null, birthdate: '1990-05-15', gender: 'male', notifications: { appPush: true, sms: true, email: false }, signupType: 'email', socialProvider: null, devices: generateDevices(3), connectedSns: ['google', 'kakao'] },
    { key: '2', userId: 'user002', name: '김철수', email: 'chulsoo@example.com', phone: '010-9876-5432', signupDate: '2024-06-15 09:00:00', lastLogin: '2024-07-20 11:20:00', status: 'active', userGroup: 'VIP', purchaseAmount: 250000, suspensionReason: null, birthdate: '1985-11-20', gender: 'male', notifications: { appPush: true, sms: false, email: true }, signupType: 'social', socialProvider: 'kakao', devices: generateDevices(5), connectedSns: ['kakao', 'naver', 'google'] },
    { key: '3', userId: 'user003', name: '박영희', email: 'younghee@example.com', phone: '010-1111-2222', signupDate: '2024-05-20 14:00:00', lastLogin: '2024-06-10 08:00:00', status: 'dormant', userGroup: '일반', purchaseAmount: 10000, suspensionReason: null, birthdate: null, gender: 'female', notifications: { appPush: false, sms: false, email: false }, signupType: 'email', socialProvider: null, devices: generateDevices(2), connectedSns: [] },
    { key: '4', userId: 'user004', name: '최미영', email: 'miyoung@example.net', phone: '010-5555-4444', signupDate: '2023-11-30 18:45:00', lastLogin: '2024-07-24 10:00:00', status: 'suspended', userGroup: '일반', purchaseAmount: 120000, suspensionReason: '어뷰징 활동', birthdate: '1992-02-28', gender: 'female', notifications: { appPush: true, sms: true, email: true }, signupType: 'social', socialProvider: 'naver', devices: generateDevices(4), connectedSns: ['naver', 'kakao'] },
    { key: '5', userId: 'user005', name: '강민준', email: 'minjun@example.co.kr', phone: '010-3333-7777', signupDate: '2024-07-22 16:00:00', lastLogin: '2024-07-26 09:10:00', status: 'active', userGroup: '일반', purchaseAmount: 30000, suspensionReason: null, birthdate: '2001-08-25', gender: null, notifications: { appPush: true, sms: false, email: false }, signupType: 'social', socialProvider: 'google', devices: generateDevices(1), connectedSns: ['google'] },
    { key: '6', userId: 'user006', name: '오서아', email: 'seoa@email.com', phone: '010-6666-9999', signupDate: '2024-04-01 12:00:00', lastLogin: '2024-05-15 18:30:00', status: 'dormant', userGroup: '일반', purchaseAmount: 0, suspensionReason: null, birthdate: null, gender: null, notifications: { appPush: false, sms: true, email: true }, signupType: 'email', socialProvider: null, devices: generateDevices(3), connectedSns: ['kakao'] },
    { key: '7', userId: 'user007', name: '이하준', email: 'hajun@example.com', phone: '010-1212-3434', signupDate: '2024-07-10 11:00:00', lastLogin: '2024-07-25 10:00:00', status: 'active', userGroup: '일반', purchaseAmount: 80000, suspensionReason: null, birthdate: '1995-03-10', gender: 'male', notifications: { appPush: true, sms: true, email: false }, signupType: 'social', socialProvider: 'kakao', devices: generateDevices(2), connectedSns: ['kakao', 'google'] },
    { key: '8', userId: 'user008', name: '정서윤', email: 'seoyun@example.com', phone: '010-3434-5656', signupDate: '2024-07-05 16:20:00', lastLogin: '2024-07-22 13:00:00', status: 'active', userGroup: 'VIP', purchaseAmount: 320000, suspensionReason: null, birthdate: '1998-07-22', gender: 'female', notifications: { appPush: true, sms: false, email: true }, signupType: 'email', socialProvider: null, devices: generateDevices(5), connectedSns: ['google', 'apple'] },
    { key: '9', userId: 'user009', name: '박도윤', email: 'doyun@example.com', phone: '010-5656-7878', signupDate: '2024-06-20 09:30:00', lastLogin: '2024-07-15 11:45:00', status: 'dormant', userGroup: '일반', purchaseAmount: 5000, suspensionReason: null, birthdate: '2000-01-01', gender: 'male', notifications: { appPush: false, sms: true, email: false }, signupType: 'social', socialProvider: 'naver', devices: generateDevices(1), connectedSns: ['naver'] },
    { key: '10', userId: 'user010', name: '김하윤', email: 'hayun@example.co.kr', phone: '010-7878-9090', signupDate: '2024-05-15 14:00:00', lastLogin: '2024-06-28 22:00:00', status: 'suspended', userGroup: '일반', purchaseAmount: 0, suspensionReason: '불법 프로그램 사용', birthdate: '1993-11-30', gender: 'female', notifications: { appPush: false, sms: false, email: false }, signupType: 'email', socialProvider: null, devices: generateDevices(2), connectedSns: [] },
    { key: '11', userId: 'user011', name: '최시우', email: 'siwoo@example.net', phone: '010-9090-1212', signupDate: '2024-07-25 08:00:00', lastLogin: '2024-07-26 11:00:00', status: 'active', userGroup: '일반', purchaseAmount: 15000, suspensionReason: null, birthdate: '1999-09-09', gender: 'male', notifications: { appPush: true, sms: true, email: true }, signupType: 'social', socialProvider: 'google', devices: generateDevices(3), connectedSns: ['google', 'facebook'] },
    { key: '12', userId: 'user012', name: '강지아', email: 'jia@email.com', phone: '010-2323-4545', signupDate: '2024-03-10 18:00:00', lastLogin: '2024-07-20 19:30:00', status: 'active', userGroup: 'VIP', purchaseAmount: 550000, suspensionReason: null, birthdate: '1988-12-25', gender: 'female', notifications: { appPush: true, sms: true, email: true }, signupType: 'email', socialProvider: null, devices: generateDevices(4), connectedSns: ['kakao', 'naver', 'google', 'apple'] },
    { key: '13', userId: 'user013', name: '한이준', email: 'ijun@example.com', phone: '010-4545-6767', signupDate: '2024-02-01 10:10:00', lastLogin: '2024-04-01 10:00:00', status: 'dormant', userGroup: '일반', purchaseAmount: 20000, suspensionReason: null, birthdate: '1996-06-07', gender: 'male', notifications: { appPush: false, sms: false, email: false }, signupType: 'social', socialProvider: 'facebook', devices: generateDevices(1), connectedSns: ['facebook'] },
    { key: '14', userId: 'user014', name: '윤아린', email: 'arin@example.com', phone: '010-6767-8989', signupDate: '2024-07-18 13:00:00', lastLogin: '2024-07-26 14:00:00', status: 'active', userGroup: '일반', purchaseAmount: 65000, suspensionReason: null, birthdate: '1994-04-15', gender: 'female', notifications: { appPush: true, sms: false, email: false }, signupType: 'email', socialProvider: null, devices: generateDevices(2), connectedSns: ['naver', 'kakao'] },
    { key: '15', userId: 'user015', name: '임로건', email: 'logan@example.co.kr', phone: '010-8989-1010', signupDate: '2024-01-05 20:00:00', lastLogin: '2024-07-25 21:00:00', status: 'active', userGroup: '일반', purchaseAmount: 95000, suspensionReason: null, birthdate: '1997-10-05', gender: 'male', notifications: { appPush: true, sms: false, email: true }, signupType: 'social', socialProvider: 'apple', devices: generateDevices(3), connectedSns: ['apple'] },
    { key: '16', userId: 'user016', name: '송채원', email: 'chaewon@email.com', phone: '010-1010-2323', signupDate: '2024-06-30 23:50:00', lastLogin: '2024-07-01 08:00:00', status: 'pending', userGroup: '일반', purchaseAmount: 0, suspensionReason: null, birthdate: '2002-08-18', gender: 'female', notifications: { appPush: true, sms: true, email: true }, signupType: 'email', socialProvider: null, devices: generateDevices(1), connectedSns: [] },
    { key: '17', userId: 'user017', name: '김탈퇴', email: 'withdraw@example.com', phone: '010-0000-0000', signupDate: '2023-01-01 10:00:00', lastLogin: '2023-01-02 12:00:00', status: 'withdrawn', userGroup: '일반', purchaseAmount: 15000, suspensionReason: '본인 요청', birthdate: '1991-01-01', gender: 'female', notifications: { appPush: false, sms: false, email: false }, signupType: 'email', socialProvider: null, devices: [], connectedSns: [] },
];

const statusMap = {
    active: { color: 'success', text: '활성', icon: <CheckCircleOutlined /> },
    dormant: { color: 'default', text: '휴면', icon: <StopOutlined /> },
    pending: { color: 'warning', text: '대기', icon: <ClockCircleOutlined /> },
    suspended: { color: 'error', text: '정지', icon: <StopOutlined /> },
    withdrawn: { color: 'volcano', text: '탈퇴', icon: <StopOutlined /> },
};

const signupTypeMap = {
    email: { text: '이메일' },
    kakao: { text: 'Kakao' },
    google: { text: 'Google' },
    naver: { text: 'Naver' },
    facebook: { text: 'Facebook' },
    apple: { text: 'Apple' },
};

const MemberInfo = () => {
    const [users, setUsers] = useState(initialUsers);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [deviceNames, setDeviceNames] = useState({});
    const navigate = useNavigate();
    let searchInput = null;

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = () => {
        setLoading(true);
        console.log("Fetching users with filters:", filters);
        // TODO: Replace with API call
        setTimeout(() => {
            let filteredData = initialUsers;
            // Apply filters (example)
            if (filters.status) {
                filteredData = filteredData.filter(user => user.status === filters.status);
            }
            if (filters.signupType) {
                if (filters.signupType === 'email') {
                    filteredData = filteredData.filter(user => user.signupType === 'email');
                } else {
                    filteredData = filteredData.filter(user => user.socialProvider === filters.signupType);
                }
            }
            if (filters.search) {
                const term = filters.search.toLowerCase();
                filteredData = filteredData.filter(user =>
                    user.userId.toLowerCase().includes(term) ||
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term)
                );
            }
             if (filters.signupDateRange) {
                 const [start, end] = filters.signupDateRange;
                 filteredData = filteredData.filter(user => {
                     const signup = new Date(user.signupDate);
                     return signup >= start && signup <= end;
                 });
             }
            setUsers(filteredData);
            setLoading(false);
        }, 500);
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const handleResetFilters = () => {
        setFilters({});
        setSearchText(''); // Reset search text as well
        setSearchedColumn('');
        // Refetch - handled by useEffect
    };

    // --- Search Logic ---
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        handleFilterChange('search', selectedKeys[0]); // Trigger fetch via filter change
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters['search']; // Remove search filter
            return newFilters;
        });
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
         filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={node => { searchInput = node; }}
                    placeholder={`${placeholder} 검색`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    // Use onFilterChange for live filtering if needed, or keep search button
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        검색
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
                        초기화
                    </Button>
                </Space>
            </div>
         ),
         filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
         onFilterDropdownOpenChange: visible => {
             if (visible) {
                 setTimeout(() => searchInput?.select(), 100);
             }
         },
         render: text =>
             searchedColumn === dataIndex ? (
                 <Highlighter
                     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                     searchWords={[searchText]}
                     autoEscape
                     textToHighlight={text ? text.toString() : ''}
                 />
             ) : (
                 text
             ),
     });

    // --- Modal Logic ---
    const showDetailModal = (user) => {
        // Add sample subscription history - replace with actual data fetching
        const userWithHistory = {
            ...user,
            subscriptionHistory: [
                { key: 'sub1', startDate: '2024-01-15', plan: '연간', amount: 99000, status: 'active' },
                { key: 'sub2', startDate: '2024-07-01', plan: '월간', amount: 9900, status: 'active' },
                { key: 'sub3', startDate: '2023-12-01', plan: '월간', amount: 9900, status: 'expired' },
            ]
        };
        setSelectedUser(userWithHistory);
        setEditedUser({ ...userWithHistory }); // Initialize editedUser with history too

        // Initialize device names
        const names = {};
        if (userWithHistory.devices) {
            userWithHistory.devices.forEach(device => {
                names[device.deviceId] = device.deviceName;
            });
        }
        setDeviceNames(names);

        setIsModalVisible(true);
        setIsEditMode(false); // Always start in view mode
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedUser(null);
        setEditedUser(null);
        setIsEditMode(false);
        setDeviceNames({});
    };

    const handleEditModeToggle = () => {
        setIsEditMode(!isEditMode);
        if (!isEditMode) {
            setEditedUser({ ...selectedUser });
        } else {
            setEditedUser({ ...selectedUser });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    // Handle Switch changes for notifications
    const handleNotificationChange = (type, checked) => {
        setEditedUser(prev => ({
            ...prev,
            notifications: {
                ...(prev.notifications || {}), // Ensure notifications object exists
                [type]: checked
            }
        }));
    };

    const handleSelectChange = (value) => {
        setEditedUser(prev => ({ ...prev, userGroup: value }));
    };

    const handleSaveChanges = () => {
        console.log("Saving changes for user:", editedUser);
        message.loading({ content: `'${editedUser.userId}' 정보 업데이트 중...`, key: editedUser.userId });

        // Ensure notifications object exists before saving
        const userToSave = {
            ...editedUser,
            notifications: editedUser.notifications || { appPush: false, sms: false, email: false } // Default if somehow missing
        };

        setTimeout(() => {
            setUsers(prevUsers => prevUsers.map(u => u.userId === userToSave.userId ? { ...userToSave } : u));
            setSelectedUser({ ...userToSave }); // Update the selected user state as well
            setIsEditMode(false);
            message.success({ content: `'${userToSave.userId}' 정보가 업데이트되었습니다.`, key: userToSave.userId });
        }, 500);
    };

    // 기기 삭제 핸들러
    const handleDeviceRemove = (deviceId) => {
        console.log(`Removing device ${deviceId} for user ${selectedUser.userId}`);
        message.loading({ content: '기기 삭제 중...', key: 'device-remove' });

        setTimeout(() => {
            const updatedDevices = selectedUser.devices.filter(d => d.deviceId !== deviceId);
            const updatedUser = { ...selectedUser, devices: updatedDevices };

            setUsers(prevUsers => prevUsers.map(u =>
                u.userId === selectedUser.userId ? updatedUser : u
            ));
            setSelectedUser(updatedUser);
            setEditedUser(updatedUser);

            message.success({ content: '기기가 삭제되었습니다.', key: 'device-remove' });
        }, 500);
    };

    // 기기 아이콘 반환
    const getDeviceIcon = (device) => {
        if (device.deviceType === 'mobile') {
            return device.os === 'iOS' ? <AppleOutlined /> : <AndroidOutlined />;
        } else if (device.deviceType === 'tablet') {
            return <TabletOutlined />;
        } else {
            return <DesktopOutlined />;
        }
    };

    // SNS 아이콘 및 정보 반환
    const getSnsInfo = (snsType) => {
        const snsMap = {
            kakao: { icon: <WechatOutlined />, color: '#FEE500', name: 'Kakao' },
            naver: { icon: <span style={{ fontWeight: 'bold' }}>N</span>, color: '#03C75A', name: 'Naver' },
            google: { icon: <GoogleOutlined />, color: '#4285F4', name: 'Google' },
            facebook: { icon: <FacebookOutlined />, color: '#1877F2', name: 'Facebook' },
            apple: { icon: <AppleOutlined />, color: '#000000', name: 'Apple' }
        };
        return snsMap[snsType] || { icon: null, color: '#999999', name: snsType };
    };

    // 기기명 변경 핸들러
    const handleDeviceNameChange = (deviceId, newName) => {
        setDeviceNames(prev => ({
            ...prev,
            [deviceId]: newName
        }));
    };

    // 기기명 저장 (blur 또는 Enter 시)
    const handleDeviceNameSave = (deviceId) => {
        const newName = deviceNames[deviceId];

        if (!newName || !newName.trim()) {
            message.error('기기명을 입력해주세요.');
            // 원래 이름으로 복원
            const originalDevice = selectedUser.devices.find(d => d.deviceId === deviceId);
            if (originalDevice) {
                setDeviceNames(prev => ({
                    ...prev,
                    [deviceId]: originalDevice.deviceName
                }));
            }
            return;
        }

        // 이름이 변경되지 않았으면 저장하지 않음
        const originalDevice = selectedUser.devices.find(d => d.deviceId === deviceId);
        if (originalDevice && originalDevice.deviceName === newName.trim()) {
            return;
        }

        console.log(`Updating device ${deviceId} name to ${newName}`);
        message.loading({ content: '기기명 변경 중...', key: 'device-name-update' });

        setTimeout(() => {
            const updatedDevices = selectedUser.devices.map(d =>
                d.deviceId === deviceId ? { ...d, deviceName: newName.trim() } : d
            );
            const updatedUser = { ...selectedUser, devices: updatedDevices };

            setUsers(prevUsers => prevUsers.map(u =>
                u.userId === selectedUser.userId ? updatedUser : u
            ));
            setSelectedUser(updatedUser);
            setEditedUser(updatedUser);

            message.success({ content: '기기명이 변경되었습니다.', key: 'device-name-update' });
        }, 500);
    };

    // --- Action Logic ---
    const handleChangeStatus = (userId, currentStatus, newStatus, reason = null) => {
        console.log(`Change status for ${userId} from ${currentStatus} to ${newStatus} with reason: ${reason}`);
        // TODO: API Call to change status
         message.loading({ content: `'${userId}' 상태 변경 중...`, key: userId });
         setTimeout(() => {
             setUsers(prevUsers => prevUsers.map(u =>
                 u.userId === userId
                     ? {
                         ...u,
                         status: newStatus,
                         suspensionReason: newStatus === 'suspended' ? reason : null
                     }
                     : u
             ));
             // Update selected user details if modal is open for this user
             if (selectedUser && selectedUser.userId === userId) {
                 setSelectedUser(prev => ({
                     ...prev,
                     status: newStatus,
                     suspensionReason: newStatus === 'suspended' ? reason : null
                 }));
             }
            message.success({ content: `'${userId}' 상태가 '${statusMap[newStatus]?.text || newStatus}' (으)로 변경되었습니다.`, key: userId });
         }, 500);
    };

    const handleMenuClick = (e, record) => {
        // Add sample subscription history - This should ideally come from the record or fetched
        const userWithHistory = {
            ...record,
            subscriptionHistory: [
                { key: 'sub1', startDate: '2024-01-15', plan: '연간', amount: 99000, status: 'active' },
                { key: 'sub2', startDate: '2024-07-01', plan: '월간', amount: 9900, status: 'active' },
                { key: 'sub3', startDate: '2023-12-01', plan: '월간', amount: 9900, status: 'expired' },
            ]
        };

        switch(e.key) {
            case 'detail':
                showDetailModal(record); // Keep using original record for view
                break;
            case 'edit':
                // Open modal directly in edit mode
                setSelectedUser(userWithHistory);
                setEditedUser({ ...userWithHistory });

                // Initialize device names
                const names = {};
                if (userWithHistory.devices) {
                    userWithHistory.devices.forEach(device => {
                        names[device.deviceId] = device.deviceName;
                    });
                }
                setDeviceNames(names);

                setIsModalVisible(true);
                setIsEditMode(true);
                break;
            default:
                break;
        }
    };

    // 행 클릭 시 수정 모달을 바로 여는 함수
    const openEditModalForRow = (record) => {
        const userWithHistory = { // 샘플 구독 내역, 실제로는 API 등에서 가져와야 함
            ...record,
            subscriptionHistory: [
                { key: 'sub1', startDate: '2024-01-15', plan: '연간', amount: 99000, status: 'active' },
                { key: 'sub2', startDate: '2024-07-01', plan: '월간', amount: 9900, status: 'active' },
                { key: 'sub3', startDate: '2023-12-01', plan: '월간', amount: 9900, status: 'expired' },
            ]
        };
        setSelectedUser(userWithHistory);
        setEditedUser({ ...userWithHistory }); // 수정 모드니까 editedUser도 바로 설정

        // Initialize device names
        const names = {};
        if (userWithHistory.devices) {
            userWithHistory.devices.forEach(device => {
                names[device.deviceId] = device.deviceName;
            });
        }
        setDeviceNames(names);

        setIsModalVisible(true);
        setIsEditMode(true); // 수정 모드로 설정
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 120,
            render: (text, record) => <><Avatar size="small" icon={<UserOutlined />} style={{marginRight: 8}}/> {text}</>,
             ...getColumnSearchProps('userId', '사용자 ID'),
        },
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            width: 100,
             ...getColumnSearchProps('name', '이름'),
             render: (text) => {
                 if (!text) return '-';
                 if (text.length > 2) {
                     return `${text[0]}*${text.substring(text.length - 1)}`;
                 }
                 return text; // Return original for names with 2 or less chars
             }
        },
        {
            title: '이메일',
            dataIndex: 'email',
            key: 'email',
            width: 200,
             render: (text) => <><MailOutlined style={{ marginRight: 8 }} />{text}</>,
             ...getColumnSearchProps('email', '이메일'),
        },
         {
             title: '연락처',
             dataIndex: 'phone',
             key: 'phone',
             width: 150,
             render: (text) => {
                 if (!text) return '-';
                 const parts = text.split('-');
                 if (parts.length === 3 && parts[1].length === 4) {
                     return `${parts[0]}-****-${parts[2]}`;
                 }
                 return text; // Return original if format is unexpected
             }
         },
        {
            title: '가입 유형',
            dataIndex: 'signupType',
            key: 'signupType',
            width: 120,
            align: 'center',
            filters: Object.entries(signupTypeMap)
                .map(([key, { text }]) => ({ text, value: key })),
            onFilter: (value, record) => {
                if (value === 'email') {
                    return record.signupType === 'email';
                }
                return record.socialProvider === value;
            },
            render: (signupType, record) => {
                if (signupType === 'social' && record.socialProvider) {
                    return record.socialProvider.charAt(0).toUpperCase() + record.socialProvider.slice(1);
                }
                const typeInfo = signupTypeMap[signupType] || { text: signupType };
                return typeInfo.text;
            }
        },
        {
            title: 'SNS 연동',
            dataIndex: 'connectedSns',
            key: 'connectedSns',
            width: 120,
            align: 'center',
            render: (connectedSns) => {
                if (!connectedSns || connectedSns.length === 0) {
                    return <Text type="secondary">-</Text>;
                }

                const snsLetterMap = {
                    kakao: 'K',
                    google: 'G',
                    facebook: 'F',
                    naver: 'N',
                    apple: 'A'
                };

                const letters = connectedSns.map(sns => snsLetterMap[sns] || sns.charAt(0).toUpperCase()).join(', ');

                return (
                    <Tooltip
                        title={
                            <Space direction="vertical" size="small">
                                {connectedSns.map(sns => (
                                    <span key={sns}>{getSnsInfo(sns).name}</span>
                                ))}
                            </Space>
                        }
                    >
                        <Text strong>{letters}</Text>
                    </Tooltip>
                );
            },
            sorter: (a, b) => (a.connectedSns?.length || 0) - (b.connectedSns?.length || 0),
        },
        {
            title: '생년월일',
            dataIndex: 'birthdate',
            key: 'birthdate',
            width: 120,
            render: (text) => {
                if (!text) return '-';
                const parts = text.split('-');
                if (parts.length === 3) {
                    return `${parts[0]}-${parts[1]}-**`;
                }
                return text; // Return original if format is unexpected
            },
        },
        {
            title: '성별',
            dataIndex: 'gender',
            key: 'gender',
            width: 80,
            render: (text) => {
                if (!text) return '-';
                return text === 'male' ? '남' : text === 'female' ? '여' : '-';
            },
        },
        {
            title: '알림 수신',
            dataIndex: 'notifications',
            key: 'notifications',
            width: 120,
            align: 'center',
            render: (notifications) => (
                <Space size="small">
                    <Tooltip title={`앱 푸시: ${notifications?.appPush ? '수신' : '미수신'}`}>
                        <MobileOutlined style={{ color: notifications?.appPush ? '#1890ff' : '#bfbfbf' }} />
                    </Tooltip>
                    <Tooltip title={`SMS: ${notifications?.sms ? '수신' : '미수신'}`}>
                        <MessageOutlined style={{ color: notifications?.sms ? '#1890ff' : '#bfbfbf' }} />
                    </Tooltip>
                    <Tooltip title={`이메일: ${notifications?.email ? '수신' : '미수신'}`}>
                        <MailOutlined style={{ color: notifications?.email ? '#1890ff' : '#bfbfbf' }} />
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: '가입일',
            dataIndex: 'signupDate',
            key: 'signupDate',
            width: 160,
            sorter: (a, b) => new Date(a.signupDate) - new Date(b.signupDate),
        },
        {
            title: '마지막 접속일',
            dataIndex: 'lastLogin',
            key: 'lastLogin',
            width: 180,
            sorter: (a, b) => {
                if (!a.lastLogin && !b.lastLogin) return 0;
                if (!a.lastLogin) return 1;
                if (!b.lastLogin) return -1;
                return new Date(a.lastLogin) - new Date(b.lastLogin);
            },
            render: (text) => {
                if (!text) return '-';
                const lastLoginDate = moment(text);
                const today = moment();
                const yearsDiff = today.diff(lastLoginDate, 'years');
                const daysDiff = today.diff(lastLoginDate, 'days');
                let diffText = '';

                if (yearsDiff >= 1) {
                    diffText = `(${yearsDiff}년 전)`;
                } else if (daysDiff === 0) {
                    diffText = '(오늘)';
                } else if (daysDiff > 0) {
                    diffText = `(${daysDiff}일 전)`;
                }
                return (
                    <>
                        {lastLoginDate.format('YYYY-MM-DD HH:mm')}
                        {diffText && <Text type="secondary" style={{ display: 'block', fontSize: '0.85em' }}>{diffText}</Text>}
                    </>
                );
            },
        },
        {
            title: '등록 기기',
            dataIndex: 'devices',
            key: 'devices',
            width: 100,
            align: 'center',
            render: (devices) => (
                <Badge
                    count={devices?.length || 0}
                    showZero
                    style={{ backgroundColor: devices?.length >= 5 ? '#ff4d4f' : '#1890ff' }}
                >
                    <MobileOutlined style={{ fontSize: 18, color: '#595959' }} />
                </Badge>
            ),
            sorter: (a, b) => (a.devices?.length || 0) - (b.devices?.length || 0),
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: Object.entries(statusMap)
                         .map(([key, { text }]) => ({ text, value: key })),
            onFilter: (value, record) => record.status === value,
            render: (status, record) => {
                const statusInfo = statusMap[status] || { color: 'default', text: status, icon: null };
                return (
                    <Tag color={statusInfo.color} icon={statusInfo.icon}>
                        {statusInfo.text}
                    </Tag>
                );
            },
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><UserOutlined /> 회원 정보 관리</Title>
            <Text>시스템에 등록된 회원 정보를 조회하고 관리합니다.</Text>


              <Space style={{ marginBottom: 16 }} wrap>
                  <Input.Search
                      placeholder="ID, 이름, 이메일 검색"
                      allowClear
                      onSearch={(value) => handleFilterChange('search', value)}
                      onChange={(e) => !e.target.value && handleFilterChange('search', '')}
                      style={{ width: 250 }}
                      value={filters.search || ''}
                  />
                  <Select
                      placeholder="상태 필터"
                      allowClear
                      style={{ width: 120 }}
                      onChange={(value) => handleFilterChange('status', value)}
                        value={filters.status || undefined}
                  >
                      {Object.entries(statusMap)
                          .map(([key, { text }]) => (
                              <Option key={key} value={key}>{text}</Option>
                          ))}
                  </Select>
                  <Select
                      placeholder="가입 유형 필터"
                      allowClear
                      style={{ width: 140 }}
                      onChange={(value) => handleFilterChange('signupType', value)}
                      value={filters.signupType || undefined}
                  >
                      {Object.entries(signupTypeMap)
                          .map(([key, { text }]) => (
                              <Option key={key} value={key}>{text}</Option>
                          ))}
                  </Select>
                  <Text>가입일:</Text>
                  <RangePicker
                      onChange={(dates) => handleFilterChange('signupDateRange', dates)}
                      value={filters.signupDateRange || null}
                  />
                  <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>초기화</Button>
              </Space>

              <Table
                  columns={columns}
                  dataSource={users}
                  loading={loading}
                  pagination={{ pageSize: 10, showSizeChanger: true }}
                  scroll={{ x: 1300 }}
                  bordered
                  size="small"
                  rowKey="key"
                  onRow={(record) => {
                      return {
                          onClick: (event) => {
                              openEditModalForRow(record); // 수정 모달 바로 열기
                          },
                          style: { cursor: 'pointer' }
                      };
                  }}
              />


            <Modal
                title={isEditMode ? "회원 정보 수정" : "회원 상세 정보"}
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        {isEditMode ? "취소" : "닫기"}
                    </Button>,
                    isEditMode && (
                        <Button
                            key="save"
                            type="primary"
                            onClick={handleSaveChanges}
                        >
                             저장
                         </Button>
                    )
                ].filter(Boolean)}
                width={800}
            >
                {selectedUser && (
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane tab="기본 정보" key="1">
                            <Descriptions bordered column={1} size="small" style={{ marginBottom: 16 }}>
                                <Descriptions.Item label="사용자 ID">{selectedUser.userId}</Descriptions.Item>
                                <Descriptions.Item label="이름">
                                    {isEditMode ? (
                                        <Input name="name" value={editedUser?.name || ''} onChange={handleInputChange} />
                                    ) : (
                                        selectedUser.name ? (
                                            selectedUser.name.length > 2
                                            ? `${selectedUser.name[0]}*${selectedUser.name.substring(selectedUser.name.length - 1)}`
                                            : selectedUser.name
                                        ) : '-'
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="이메일">
                                     {isEditMode ? (
                                        <Input name="email" value={editedUser?.email || ''} onChange={handleInputChange} />
                                    ) : (
                                        selectedUser.email
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="연락처">
                                     {isEditMode ? (
                                        <Input name="phone" value={editedUser?.phone || ''} onChange={handleInputChange} />
                                     ) : (
                                        selectedUser.phone ? (
                                            selectedUser.phone.split('-').length === 3 && selectedUser.phone.split('-')[1].length === 4
                                            ? `${selectedUser.phone.split('-')[0]}-****-${selectedUser.phone.split('-')[2]}`
                                            : selectedUser.phone
                                        ) : '-'
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="생년월일">
                                    {isEditMode ? (
                                        <Input name="birthdate" value={editedUser?.birthdate || ''} onChange={handleInputChange} placeholder="YYYY-MM-DD" />
                                    ) : (
                                        selectedUser.birthdate ? (
                                            selectedUser.birthdate.split('-').length === 3
                                            ? `${selectedUser.birthdate.split('-')[0]}-${selectedUser.birthdate.split('-')[1]}-**`
                                            : selectedUser.birthdate
                                        ) : '-'
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="성별">
                                     {isEditMode ? (
                                         <Select
                                            name="gender"
                                            value={editedUser?.gender || ''}
                                            onChange={(value) => setEditedUser(prev => ({ ...prev, gender: value }))}
                                            style={{ width: '100%' }}
                                            allowClear
                                            placeholder="선택 안함"
                                        >
                                             <Option value="male">남</Option>
                                             <Option value="female">여</Option>
                                         </Select>
                                     ) : (
                                         selectedUser.gender === 'male' ? '남' : selectedUser.gender === 'female' ? '여' : '-'
                                     )}
                                </Descriptions.Item>
                                <Descriptions.Item label="가입일시">{selectedUser.signupDate}</Descriptions.Item>
                                <Descriptions.Item label="마지막 접속">{selectedUser.lastLogin}</Descriptions.Item>
                                 <Descriptions.Item label="상태">
                                     <Tag color={statusMap[selectedUser.status]?.color} icon={statusMap[selectedUser.status]?.icon}>
                                         {statusMap[selectedUser.status]?.text || selectedUser.status}
                                     </Tag>
                                 </Descriptions.Item>
                                 <Descriptions.Item label="가입 유형" span={1}>
                                    {(() => {
                                        if (selectedUser.signupType === 'social' && selectedUser.socialProvider) {
                                            return selectedUser.socialProvider.charAt(0).toUpperCase() + selectedUser.socialProvider.slice(1);
                                        }
                                        const typeInfo = signupTypeMap[selectedUser.signupType] || { text: selectedUser.signupType };
                                        return typeInfo.text;
                                    })()}
                                </Descriptions.Item>
                                 {selectedUser.status === 'suspended' && !isEditMode && (
                                     <Descriptions.Item label="정지 사유">
                                         {selectedUser.suspensionReason || '사유 없음'}
                                     </Descriptions.Item>
                                 )}
                                <Descriptions.Item label="앱 푸시 수신" span={1}>
                                    <Tag color={selectedUser.notifications?.appPush ? 'blue' : 'default'}>
                                        {selectedUser.notifications?.appPush ? '수신' : '미수신'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="SMS 수신" span={1}>
                                    <Tag color={selectedUser.notifications?.sms ? 'blue' : 'default'}>
                                        {selectedUser.notifications?.sms ? '수신' : '미수신'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="이메일 수신" span={1}>
                                    <Tag color={selectedUser.notifications?.email ? 'blue' : 'default'}>
                                        {selectedUser.notifications?.email ? '수신' : '미수신'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="SNS 계정 연동" span={1}>
                                    {selectedUser.connectedSns && selectedUser.connectedSns.length > 0 ? (
                                        <Space wrap size="small">
                                            {selectedUser.connectedSns.map((sns) => {
                                                const snsInfo = getSnsInfo(sns);
                                                const snsLetterMap = {
                                                    kakao: 'K',
                                                    google: 'G',
                                                    facebook: 'F',
                                                    naver: 'N',
                                                    apple: 'A'
                                                };
                                                const letter = snsLetterMap[sns] || sns.charAt(0).toUpperCase();

                                                return (
                                                    <Tooltip key={sns} title={snsInfo.name}>
                                                        <Tag
                                                            color={snsInfo.color}
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: 'bold',
                                                                padding: '4px 12px',
                                                                color: sns === 'kakao' ? '#000' : '#fff',
                                                                minWidth: 32,
                                                                textAlign: 'center'
                                                            }}
                                                        >
                                                            {letter}
                                                        </Tag>
                                                    </Tooltip>
                                                );
                                            })}
                                        </Space>
                                    ) : (
                                        <Text type="secondary">-</Text>
                                    )}
                                </Descriptions.Item>
                            </Descriptions>
                        </Tabs.TabPane>

                        <Tabs.TabPane
                            tab="등록된 기기"
                            key="2"
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                <Text type="secondary">
                                    최대 5개의 기기에서 로그인할 수 있습니다.
                                    {selectedUser.devices?.length > 0 &&
                                        ` (${selectedUser.devices.length}/5)`
                                    }
                                </Text>

                                {selectedUser.devices && selectedUser.devices.length > 0 ? (
                                    selectedUser.devices.map((device, index) => (
                                        <Card
                                            key={device.deviceId}
                                            size="small"
                                        >
                                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                                <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Space style={{ flex: 1, maxWidth: '70%' }}>
                                                        <span style={{ fontSize: 16 }}>
                                                            {getDeviceIcon(device)}
                                                        </span>
                                                        <Input
                                                            value={deviceNames[device.deviceId] || device.deviceName}
                                                            onChange={(e) => handleDeviceNameChange(device.deviceId, e.target.value)}
                                                            onBlur={() => handleDeviceNameSave(device.deviceId)}
                                                            onPressEnter={() => handleDeviceNameSave(device.deviceId)}
                                                            placeholder="기기명을 입력하세요"
                                                            style={{ flex: 1 }}
                                                        />
                                                    </Space>
                                                    <Popconfirm
                                                        title="기기 삭제"
                                                        description="이 기기를 삭제하시겠습니까?"
                                                        onConfirm={() => handleDeviceRemove(device.deviceId)}
                                                        okText="삭제"
                                                        cancelText="취소"
                                                        okButtonProps={{ danger: true }}
                                                    >
                                                        <Button
                                                            type="text"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                        >
                                                            삭제
                                                        </Button>
                                                    </Popconfirm>
                                                </Space>

                                                <Descriptions size="small" column={1}>
                                                    <Descriptions.Item label="모델명">
                                                        {device.deviceName}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="기기 타입">
                                                        {device.deviceType === 'desktop' || device.deviceType === 'tablet'
                                                            ? 'PC'
                                                            : `모바일 (${device.os})`}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="등록일">
                                                        {device.registeredAt}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Space>
                                        </Card>
                                    ))
                                ) : (
                                    <Card size="small">
                                        <Text type="secondary">등록된 기기가 없습니다.</Text>
                                    </Card>
                                )}
                            </Space>
                        </Tabs.TabPane>
                    </Tabs>
                )}
            </Modal>
        </Space>
    );
};

export default MemberInfo;
