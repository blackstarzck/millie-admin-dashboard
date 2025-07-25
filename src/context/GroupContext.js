import { message } from 'antd';
import React, { createContext, useCallback, useContext, useState } from 'react';

// 초기 그룹 데이터 (TargetGroupManagement에서 가져옴)
const initialGroupsData = [
    { key: 'G001', id: 'G001', name: 'VIP 고객', description: '구매 금액 상위 10% 고객 그룹',
      query: { combinator: 'and', rules: [{ field: 'totalPurchaseAmount', operator: '>=', value: 100000 }] } },
    { key: 'G003', id: 'G003', name: '이벤트 참여자 (7월)', description: '7월 신간 알림 이벤트 참여 고객',
      query: { combinator: 'and', rules: [] } },
    { key: 'G004', id: 'G004', name: '시리즈 알림 YES 그룹', description: '시리즈 알림 수신에 동의한 사용자 그룹',
      query: { combinator: 'and', rules: [] } },
    { key: 'G005', id: 'G005', name: '신간도서 알림 YES 그룹', description: '신간도서 알림 수신에 동의한 사용자 그룹',
      query: { combinator: 'and', rules: [] } },
    {
      key: 'ERR01', id: 'ERR01', name: '특정 프로모션 대상', description: '8월 프로모션 대상 고객 그룹 (값 오류 테스트)',
      query: { combinator: 'and', rules: [{ field: 'totalPurchaseAmount', operator: '=', value: '만원' }] }
    },
    {
      key: 'ERR02', id: 'ERR02', name: '캠페인 비참여자 그룹', description: '특정 캠페인 미참여 고객 (필드 오류 테스트)',
      query: { combinator: 'and', rules: [{ field: 'purchaseCount', operator: '>', value: 10 }] }
    },
    {
      key: 'ERR03', id: 'ERR03', name: '구매 패턴 분석 그룹', description: '특정 구매 패턴 고객 (연산자 오류 테스트)',
      query: { combinator: 'and', rules: [{ field: 'totalPurchaseAmount', operator: 'contains', value: '100' }] }
    },
    {
      key: 'ERR04', id: 'ERR04', name: '서울 거주 확인 그룹', description: '서울 거주 예상 고객 (값 누락 테스트)',
      query: { combinator: 'and', rules: [{ field: 'city', operator: '=' }] }
    },
    {
        key: 'ERR05', id: 'ERR05', name: '도시 기반 타겟팅 그룹', description: '특정 도시 타겟 고객 (연산자 누락 테스트)',
        query: { combinator: 'and', rules: [{ field: 'city', value: '서울' }] }
    }
];

// 1. Context 생성
const GroupContext = createContext();

// 2. Provider 컴포넌트 생성
export const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState(initialGroupsData);

    // 그룹 추가 함수
    const addGroup = useCallback((newGroupData) => {
        // TODO: Implement API call for create
        const newGroup = {
            key: `G${String(Date.now()).slice(-4)}`, // Simple unique key generation
            id: `G${String(Date.now()).slice(-4)}`,
            ...newGroupData
        };
        setGroups(prevGroups => [...prevGroups, newGroup]);
        message.success(`새 그룹 '${newGroup.name}'이(가) 추가되었습니다.`);
        console.log('Context: Create Group:', newGroup);
    }, []);

    // 그룹 수정 함수
    const updateGroup = useCallback((updatedGroupData) => {
        // TODO: Implement API call for update
        setGroups(prevGroups =>
            prevGroups.map(group =>
                group.key === updatedGroupData.key ? { ...group, ...updatedGroupData } : group
            )
        );
        message.success(`그룹 '${updatedGroupData.name}'이(가) 수정되었습니다.`);
        console.log('Context: Update Group:', updatedGroupData);
    }, []);

    // 그룹 삭제 함수
    const deleteGroup = useCallback((key) => {
        // TODO: Implement API call for delete
        setGroups(prevGroups => prevGroups.filter(group => group.key !== key));
        message.success('그룹이 삭제되었습니다.');
        console.log('Context: Delete Group Key:', key);
    }, []);

    // Context 값
    const value = { groups, addGroup, updateGroup, deleteGroup };

    return (
        <GroupContext.Provider value={value}>
            {children}
        </GroupContext.Provider>
    );
};

// 3. Custom Hook 생성 (사용 편의성)
export const useGroups = () => {
    const context = useContext(GroupContext);
    if (context === undefined) {
        throw new Error('useGroups must be used within a GroupProvider');
    }
    return context;
};
