import React, { useState, useMemo, useCallback } from 'react';
import {
    Collapse,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Space,
    Typography,
    Tag,
    message,
    Popconfirm,
    InputNumber,
    Tooltip,
    Row,
    Col,
    Card,
    List,
    Transfer,
    Tree,
    theme,
    Tabs,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// TreeTransfer Helper
const generateTreeDataForTransfer = (treeNodes = [], targetItemKeys = [], currentTargetItemCount = 0, maxLimit = 5) =>
    treeNodes.map(({ children, ...props }) => {
        const isAlreadyTarget = targetItemKeys.includes(props.key);
        let disableThisNode = isAlreadyTarget; // 이미 대상이면 왼쪽에서 다시 선택 못하도록 비활성화

        // 자식 노드가 없고(즉, FAQ 항목이고), 아직 대상이 아니며, 현재 대상 수가 최대치에 도달한 경우
        if (!children && !isAlreadyTarget && currentTargetItemCount >= maxLimit) {
            disableThisNode = true;
        }

        return {
            ...props,
            disabled: disableThisNode,
            children: children ? generateTreeDataForTransfer(children, targetItemKeys, currentTargetItemCount, maxLimit) : undefined,
        };
    });

const DEFAULT_CATEGORY = '기타';

// --- Sample Data (New Categories) ---
const initialFaqs = [
    // 결제/환불
    { key: 'faq1', id: 'F001', category: '결제/환불', question: '사용 가능한 결제 수단은 무엇인가요?', answer: '신용카드, 계좌이체, 휴대폰 소액결제를 이용할 수 있습니다.', isVisible: true, order: 1, createdAt: '2024-01-15 11:00:00', isRepresentative: true },
    { key: 'faq2', id: 'F002', category: '결제/환불', question: '환불 규정은 어떻게 되나요?', answer: '구매 후 7일 이내 미사용 시 전액 환불 가능합니다. 자세한 내용은 이용약관을 참고해주세요.', isVisible: false, order: 2, createdAt: '2024-02-01 14:00:00', isRepresentative: false },
    { key: 'faq3', id: 'F003', category: '결제/환불', question: '무통장 입금 계좌번호를 알려주세요.', answer: '주문 과정에서 가상계좌가 발급됩니다. 해당 계좌로 입금해주세요.', isVisible: true, order: 3, createdAt: '2024-03-20 10:00:00', isRepresentative: false },
    
    // 구독권/제휴
    { key: 'faq4', id: 'F004', category: '구독권/제휴', question: '구독권 해지는 어떻게 하나요?', answer: '마이페이지 > 구독 관리 메뉴에서 직접 해지할 수 있습니다.', isVisible: true, order: 1, createdAt: '2024-01-20 15:00:00', isRepresentative: false },
    { key: 'faq5', id: 'F005', category: '구독권/제휴', question: '제휴 문의는 어디로 해야 하나요?', answer: 'help@example.com 으로 제휴안과 함께 문의주시면 검토 후 답변드리겠습니다.', isVisible: true, order: 2, createdAt: '2024-02-10 12:00:00', isRepresentative: false },

    // 회원/로그인
    { key: 'faq6', id: 'F006', category: '회원/로그인', question: '비밀번호는 어떻게 변경하나요?', answer: '로그인 후 [마이페이지] > [회원정보 수정] 메뉴에서 변경할 수 있습니다.', isVisible: true, order: 1, createdAt: '2024-01-10 10:00:00', isRepresentative: true },
    { key: 'faq7', id: 'F007', category: '회원/로그인', question: '아이디를 잊어버렸어요.', answer: '로그인 페이지 하단의 [아이디 찾기] 메뉴를 이용해주세요.', isVisible: true, order: 2, createdAt: '2024-03-05 16:00:00', isRepresentative: false },
    { key: 'faq8', id: 'F008', category: '회원/로그인', question: '회원 탈퇴는 어떻게 하나요?', answer: '마이페이지 > 회원 탈퇴 메뉴를 통해 직접 탈퇴할 수 있으며, 모든 정보는 복구되지 않습니다.', isVisible: true, order: 3, createdAt: '2024-03-15 11:00:00', isRepresentative: false },

    // 서비스 이용
    { key: 'faq9', id: 'F009', category: '서비스 이용', question: '강의 수강 기간은 어떻게 되나요?', answer: '대부분의 강의는 구매 후 무제한 수강 가능합니다. 일부 기간제 강의는 상세 페이지를 참고해주세요.', isVisible: true, order: 1, createdAt: '2024-02-05 18:00:00', isRepresentative: false },
    { key: 'faq10', id: 'F010', category: '서비스 이용', question: '자료는 어디서 다운로드 받나요?', answer: '강의실 내 \'자료실\' 탭에서 다운로드 가능합니다.', isVisible: true, order: 2, createdAt: '2024-02-20 09:30:00', isRepresentative: false },

    // 기기/뷰어
    { key: 'faq11', id: 'F011', category: '기기/뷰어', question: '모바일에서도 수강 가능한가요?', answer: '네, 모바일 웹 및 앱을 통해 모든 강의를 수강하실 수 있습니다.', isVisible: true, order: 1, createdAt: '2024-01-25 13:00:00', isRepresentative: false },
    { key: 'faq12', id: 'F012', category: '기기/뷰어', question: '동영상 재생이 안돼요.', answer: '브라우저 캐시 삭제 후 재시도해보시거나, 다른 브라우저 또는 네트워크 환경에서 확인해주세요.', isVisible: true, order: 2, createdAt: '2024-03-01 17:00:00', isRepresentative: false },

    // 기타
    { key: 'faq13', id: 'F013', category: '기타', question: '고객센터 운영시간은 어떻게 되나요?', answer: '평일 오전 9시부터 오후 6시까지 운영됩니다. (점심시간: 12시~1시)', isVisible: true, order: 1, createdAt: '2024-01-05 09:00:00', isRepresentative: false }
];

// --- Helper Functions ---
/*
const getVisibilityTag = (isVisible) => {
    return isVisible
        ? <Tag icon={<EyeOutlined />} color="processing">노출 중</Tag>
        : <Tag icon={<EyeInvisibleOutlined />} color="default">숨김</Tag>;
};
*/

// --- Draggable FAQ Item Component ---
const DraggableFaqItem = ({ faq, onEdit, onDelete, onToggleVisibility }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: faq.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '12px',
        border: isDragging ? '2px dashed #1890ff' : '1px solid #d9d9d9',
        borderRadius: '4px',
        backgroundColor: isDragging ? '#e6f7ff' : '#fff',
        boxShadow: isDragging ? '0px 4px 12px rgba(0,0,0,0.1)': 'none',
    };

    const titleStyle = {
        maxWidth: '500px',
        cursor: 'pointer',
        color: isHovered ? '#1890ff' : undefined,
        transition: 'color 0.3s',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Card size="small">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Space align="center">
                        <span {...listeners} style={{ cursor: 'grab', paddingRight: '8px' }}><MenuOutlined /></span>
                        <Text 
                            strong 
                            ellipsis={{tooltip: faq.question}}
                            style={titleStyle}
                            onClick={() => onEdit(faq)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {faq.question}
                        </Text>
                    </Space>
                    <Space size="small">
                        <Tooltip title="노출 상태 변경">
                            <Switch 
                                checked={faq.isVisible}
                                onChange={() => onToggleVisibility(faq.key)}
                                checkedChildren={<EyeOutlined />}
                                unCheckedChildren={<EyeInvisibleOutlined />}
                                size="small"
                            />
                        </Tooltip>
                        <Popconfirm
                            title={`'${faq.question}' FAQ를 삭제하시겠습니까?`}
                            onConfirm={() => onDelete(faq.key, faq.question)}
                            okText="삭제" cancelText="취소" placement="topRight"
                        >
                            <Tooltip title="삭제">
                                <Button size="small" danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                </div>
            </Card>
        </div>
    );
};

// TreeTransfer Helper
/*
const generateTreeDataForTransfer = (treeNodes = [], targetItemKeys = [], currentTargetItemCount = 0, maxLimit = 5) =>
    treeNodes.map(({ children, ...props }) => {
        const isAlreadyTarget = targetItemKeys.includes(props.key);
        let disableThisNode = isAlreadyTarget; 
        if (!children && !isAlreadyTarget && currentTargetItemCount >= maxLimit) {
            disableThisNode = true;
        }
        return {
            ...props,
            disabled: disableThisNode,
            children: children ? generateTreeDataForTransfer(children, targetItemKeys, currentTargetItemCount, maxLimit) : undefined,
        };
    });
*/

// --- TreeTransfer Helper Functions and Component (AntD 샘플 기반) ---
// const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey); // isChecked is not used, can be removed or kept if intended for future

// Generates tree data suitable for AntD Tree, disabling nodes already in targetKeys
const generateTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: checkedKeys.includes(props.key),
        // Recursively generate children, passing down checkedKeys
        children: children ? generateTree(children, checkedKeys) : undefined,
    }));

// Custom TreeTransfer component
const TreeTransfer = ({
    dataSource, // This is the hierarchical treeDataSource (categories with FAQ children)
    targetKeys = [],
    currentSourceSelectedKeys,
    onSourceSelectedKeysChange,
    currentTargetSelectedKeys, // New prop for target selections
    onTargetSelectedKeysChange, // New prop for handling target selection changes
    onChange, // This is handleTreeTransferChange from FaqManagement
    maxRepresentativeFaqs, // Pass the limit
    ...restProps
}) => {
    const { token } = theme.useToken();
    const [expandedKeys, setExpandedKeys] = React.useState([]);

    // Flatten the tree data source for the underlying Transfer component
    // transferDataSource will contain only actual FAQ items that can be transferred.
    const transferDataSource = React.useMemo(() => {
        const flatData = [];
        function flatten(list = []) {
            list.forEach(item => {
                if (!item.children) { // Is an FAQ item
                    flatData.push({ ...item, title: item.title || '[질문 없음]' });
                }
                if (item.children) { // Is a category, recurse
                    flatten(item.children);
                }
            });
        }
        flatten(dataSource);
        return flatData;
    }, [dataSource]);

    const allCategoryKeys = React.useMemo(() => 
        dataSource.filter(node => node.children && node.children.length > 0).map(node => node.key),
    [dataSource]);

    const areAllExpanded = React.useMemo(() => 
        allCategoryKeys.length > 0 && 
        expandedKeys.length === allCategoryKeys.length && 
        allCategoryKeys.every(k => expandedKeys.includes(k)), // Ensure all expanded keys are actual category keys
    [expandedKeys, allCategoryKeys]);

    const handleToggleExpandAll = () => {
        if (areAllExpanded) {
            setExpandedKeys([]);
        } else {
            setExpandedKeys(allCategoryKeys);
        }
    };

    const onTreeExpand = (newExpandedKeys) => {
        setExpandedKeys(newExpandedKeys);
    };

    // Calculate keys for Tree's visual checked state (includes parents if all children selected)
    const treeDisplayCheckedKeys = React.useMemo(() => {
        const displayKeys = [...(currentSourceSelectedKeys || [])];

        dataSource.forEach(categoryNode => { // dataSource is the array of category nodes
            if (categoryNode.children && categoryNode.children.length > 0) {
                const childrenFaqItemKeys = categoryNode.children.map(child => child.key);
                
                const eligibleChildrenFaqKeys = childrenFaqItemKeys.filter(
                    childKey => transferDataSource.some(tdsItem => tdsItem.key === childKey) && !targetKeys.includes(childKey)
                );

                if (eligibleChildrenFaqKeys.length > 0) {
                    const allEligibleChildrenSelected = eligibleChildrenFaqKeys.every(
                        childKey => (currentSourceSelectedKeys || []).includes(childKey)
                    );
                    if (allEligibleChildrenSelected) {
                        if (!displayKeys.includes(categoryNode.key)) {
                            displayKeys.push(categoryNode.key);
                        }
                    }
                }
            }
        });
        return displayKeys;
    }, [currentSourceSelectedKeys, dataSource, targetKeys, transferDataSource]);

    const generatedTreeData = React.useMemo(() => 
        generateTreeDataForTransfer(dataSource, targetKeys, targetKeys.length, maxRepresentativeFaqs),
    [dataSource, targetKeys, maxRepresentativeFaqs]);

    return (
        <Transfer
            {...restProps}
            targetKeys={targetKeys}
            selectedKeys={[...(currentSourceSelectedKeys || []), ...(currentTargetSelectedKeys || [])]} // Combine source and target selections
            onSelectChange={(newSourceSelKeys, newTargetSelKeys) => {
                if (onSourceSelectedKeysChange) {
                    onSourceSelectedKeysChange(newSourceSelKeys);
                }
                if (onTargetSelectedKeysChange) { // Update target selections as well
                    onTargetSelectedKeysChange(newTargetSelKeys);
                }
            }}
            onChange={onChange} // This prop is for when items are actually moved
            dataSource={transferDataSource} 
            render={item => item.title}
            showSelectAll={false}
        >
            {({ direction, selectedKeys: currentPanelSelectedKeys }) => { // selectedKeys here are specific to the panel being rendered by Transfer
                if (direction === 'left') {
                    return (
                        <div style={{ padding: token.paddingXS, maxHeight: '400px', overflowY: 'auto' }}>
                            <Space size="small" style={{ marginBottom: token.paddingXS, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button size="small" onClick={handleToggleExpandAll}>
                                    {areAllExpanded ? '전체 접기' : '전체 펼치기'}
                                </Button>
                            </Space>
                            <Tree
                                blockNode
                                checkable
                                checkStrictly
                                expandedKeys={expandedKeys}
                                onExpand={onTreeExpand}
                                checkedKeys={treeDisplayCheckedKeys}
                                treeData={generatedTreeData}
                                onCheck={(_, { node, checked: eventNodeChecked }) => {
                                    const clickedKey = node.key;
                                    if (node.disabled && eventNodeChecked) {
                                        message.warning(`대표 FAQ는 최대 ${maxRepresentativeFaqs}개까지 설정할 수 있습니다.`);
                                        return;
                                    }
                                    let newSelectedKeysArray = [...(currentSourceSelectedKeys || [])];
                                    const isFaqNode = transferDataSource.some(item => item.key === clickedKey);
                                    const isCategoryNode = dataSource.find(n => n.key === clickedKey && n.children);

                                    if (isFaqNode) {
                                        if (eventNodeChecked) {
                                            if (!newSelectedKeysArray.includes(clickedKey)) {
                                                if (targetKeys.length < maxRepresentativeFaqs) {
                                                    newSelectedKeysArray.push(clickedKey);
                                                } else {
                                                    message.warning(`대표 FAQ는 최대 ${maxRepresentativeFaqs}개까지 설정할 수 있습니다.`);
                                                    return;
                                                }
                                            }
                                        } else {
                                            newSelectedKeysArray = newSelectedKeysArray.filter(k => k !== clickedKey);
                                        }
                                    } else if (isCategoryNode) {
                                        const categoryNodeData = dataSource.find(n => n.key === clickedKey);
                                        if (categoryNodeData && categoryNodeData.children) {
                                            const childrenFaqKeys = categoryNodeData.children
                                                .map(child => child.key)
                                                .filter(key => transferDataSource.some(item => item.key === key))
                                                .filter(key => !targetKeys.includes(key)); // Consider only non-target children
                                            
                                            let currentCanAddCount = maxRepresentativeFaqs - targetKeys.length;
                                            const childrenToAdd = [];

                                            if (eventNodeChecked) {
                                                for (const childKey of childrenFaqKeys) {
                                                    if (!newSelectedKeysArray.includes(childKey)) {
                                                        if (currentCanAddCount > 0) {
                                                            childrenToAdd.push(childKey);
                                                            currentCanAddCount--;
                                                        } else {
                                                            message.warning(`대표 FAQ는 최대 ${maxRepresentativeFaqs}개까지만 추가할 수 있습니다. 일부 항목만 선택됩니다.`);
                                                            break; 
                                                        }
                                                    }
                                                }
                                                newSelectedKeysArray.push(...childrenToAdd);
                                            } else { 
                                                newSelectedKeysArray = newSelectedKeysArray.filter(k => !childrenFaqKeys.includes(k));
                                            }
                                        }
                                    }
                                    if (onSourceSelectedKeysChange) onSourceSelectedKeysChange(Array.from(new Set(newSelectedKeysArray))); // Ensure unique keys
                                }}
                                onSelect={(_, { node }) => {
                                    const clickedKey = node.key;
                                    if (node.disabled && !(currentSourceSelectedKeys || []).includes(clickedKey)) { // Allow de-selecting disabled if it was somehow selected
                                        message.warning(`대표 FAQ는 최대 ${maxRepresentativeFaqs}개까지 설정할 수 있습니다.`);
                                        return;
                                    }

                                    let newSelectedKeysArray = [...(currentSourceSelectedKeys || [])];
                                    const isFaqNode = transferDataSource.some(item => item.key === clickedKey);
                                    const isCategoryNode = dataSource.find(n => n.key === clickedKey && n.children);
                                    
                                    if (isFaqNode) {
                                        if (newSelectedKeysArray.includes(clickedKey)) {
                                            newSelectedKeysArray = newSelectedKeysArray.filter(k => k !== clickedKey);
                                        } else {
                                            if (targetKeys.length < maxRepresentativeFaqs) {
                                                newSelectedKeysArray.push(clickedKey);
                                            } else {
                                                message.warning(`대표 FAQ는 최대 ${maxRepresentativeFaqs}개까지 설정할 수 있습니다.`);
                                                return; 
                                            }
                                        }
                                    } else if (isCategoryNode) { 
                                        const categoryNodeData = dataSource.find(n => n.key === clickedKey);
                                        if (categoryNodeData && categoryNodeData.children) {
                                            const childrenFaqKeys = categoryNodeData.children
                                                .map(child => child.key)
                                                .filter(key => transferDataSource.some(item => item.key === key))
                                                .filter(key => !targetKeys.includes(key)); 

                                            const allSelectedCurrently = childrenFaqKeys.length > 0 && childrenFaqKeys.every(k => newSelectedKeysArray.includes(k));
                                            let currentCanAddCount = maxRepresentativeFaqs - targetKeys.length;
                                            const childrenToProcess = [];

                                            if (allSelectedCurrently) { // If all are selected, deselect them
                                                newSelectedKeysArray = newSelectedKeysArray.filter(k => !childrenFaqKeys.includes(k));
                                            } else { // If not all selected, try to select them
                                                for (const childKey of childrenFaqKeys) {
                                                    if (!newSelectedKeysArray.includes(childKey)) {
                                                         if (currentCanAddCount > 0) {
                                                            childrenToProcess.push(childKey);
                                                            currentCanAddCount--;
                                                        } else {
                                                            message.warning(`대표 FAQ는 최대 ${maxRepresentativeFaqs}개까지만 추가할 수 있습니다. 일부 항목만 선택됩니다.`);
                                                            break;
                                                        }
                                                    }
                                                }
                                                newSelectedKeysArray.push(...childrenToProcess);
                                            }
                                        }
                                    }
                                    if (onSourceSelectedKeysChange) onSourceSelectedKeysChange(Array.from(new Set(newSelectedKeysArray)));
                                }}
                            />
                        </div>
                    );
                }
            }}
        </Transfer>
    );
};

// --- Component ---
const FaqManagement = () => {
    const MAX_REPRESENTATIVE_FAQS = 5; // Define here

    const [faqs, setFaqs] = useState(initialFaqs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [form] = Form.useForm();
    const [activeCategoryKey, setActiveCategoryKey] = useState([]);
    const [transferSourceSelectedKeys, setTransferSourceSelectedKeys] = useState([]);
    const [transferTargetSelectedKeys, setTransferTargetSelectedKeys] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- Group FAQs by Category ---
    const groupedFaqs = useMemo(() => {
        const groups = faqs.reduce((acc, faq) => {
            const category = (typeof faq.category === 'string' && faq.category.trim() !== "") 
                             ? faq.category.trim() 
                             : DEFAULT_CATEGORY;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(faq);
            acc[category].sort((a, b) => a.order - b.order);
            return acc;
        }, {});
        return Object.entries(groups).sort((a, b) => {
            if (a[0] === DEFAULT_CATEGORY && b[0] !== DEFAULT_CATEGORY) return 1;
            if (b[0] === DEFAULT_CATEGORY && a[0] !== DEFAULT_CATEGORY) return -1;
            return a[0].localeCompare(b[0]);
        });
    }, [faqs]);

    // --- Unique Category List for Select Options ---
    const uniqueCategories = useMemo(() => {
        const categories = new Set(faqs.map(faq => 
            (typeof faq.category === 'string' && faq.category.trim() !== "") 
            ? faq.category.trim() 
            : DEFAULT_CATEGORY
        ));
        if (!categories.has(DEFAULT_CATEGORY)) {
            categories.add(DEFAULT_CATEGORY);
        }
        return Array.from(categories).sort((a,b) => {
            if (a === DEFAULT_CATEGORY && b !== DEFAULT_CATEGORY) return 1;
            if (b === DEFAULT_CATEGORY && a !== DEFAULT_CATEGORY) return -1;
            return a.localeCompare(b);
        });
    }, [faqs]);

    // --- Data Source for TreeTransfer ---
    const treeDataSourceForTransfer = useMemo(() => {
        return groupedFaqs.map(([categoryName, faqsInCategory]) => ({
            key: categoryName, // Category key
            title: `${categoryName} (${faqsInCategory.length})`, // Category title
            children: faqsInCategory.map(faq => ({ // FAQ items as children
                key: faq.key,
                title: faq.question,
            })),
            // Disable category nodes from being directly transferred
            // disabled: true, // This prevents selection, let TreeTransfer handle disabling
        }));
    }, [groupedFaqs]);

    // --- Target Keys for Transfer (Representative FAQs) ---
    const targetKeys = useMemo(() => 
        faqs.filter(faq => faq.isRepresentative).map(faq => faq.key),
    [faqs]);

    // --- Modal Handling ---
    const showModal = (faq = null) => {
        setEditingFaq(faq);
        if (faq) {
            form.setFieldsValue({ ...faq });
        } else {
            form.resetFields();
            const highestOrder = faqs.reduce((max, f) => Math.max(max, f.order), 0);
            form.setFieldsValue({ isVisible: true, order: highestOrder + 1, category: DEFAULT_CATEGORY });
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
        form.resetFields();
    };

    // --- Add/Edit Logic ---
    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const processedValues = {
                    ...values,
                    category: (typeof values.category === 'string' && values.category.trim() !== "") 
                                ? values.category.trim() 
                                : DEFAULT_CATEGORY,
                    order: Number(values.order) || 0,
                };

                if (editingFaq) {
                    setFaqs(prevFaqs =>
                        prevFaqs.map(f => f.key === editingFaq.key ? { ...editingFaq, ...processedValues } : f)
                    );
                    message.success(`FAQ(ID: ${editingFaq.id})가 수정되었습니다.`);
                } else {
                    const newFaq = {
                        ...processedValues,
                        key: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        id: `F${String(Date.now()).slice(-4)}${Math.floor(Math.random()*100)}`,
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };
                    setFaqs(prevFaqs => [...prevFaqs, newFaq]);
                    message.success('새 FAQ가 등록되었습니다.');
                }
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('필수 입력 항목을 확인해주세요.');
            });
    };

    // --- Delete Logic ---
    const handleDelete = useCallback((key, question) => {
        setFaqs(prevFaqs => prevFaqs.filter(f => f.key !== key));
        message.success(`FAQ '${question}'이(가) 삭제되었습니다.`);
    }, []);

    // --- Toggle Visibility Logic ---
    const handleVisibilityToggle = useCallback((key) => {
        setFaqs(prevFaqs =>
            prevFaqs.map(f => f.key === key ? { ...f, isVisible: !f.isVisible } : f)
        );
        message.success('FAQ 노출 상태가 변경되었습니다.');
    }, []);

    // --- Manual Order Change (Up/Down buttons) ---
    const handleChangeOrderManual = useCallback((keyToMove, direction) => {
        setFaqs(prevFaqs => {
            const faqToMove = prevFaqs.find(f => f.key === keyToMove);
            if (!faqToMove) return prevFaqs;

            const categoryName = (typeof faqToMove.category === 'string' && faqToMove.category.trim() !== "") 
                                ? faqToMove.category.trim() 
                                : DEFAULT_CATEGORY;

            const categoryFaqs = prevFaqs
                .filter(f => ((typeof f.category === 'string' && f.category.trim() !== "") ? f.category.trim() : DEFAULT_CATEGORY) === categoryName)
                .sort((a, b) => a.order - b.order);

            const currentIndex = categoryFaqs.findIndex(f => f.key === keyToMove);
            let targetIndex = -1;

            if (direction === 'up' && currentIndex > 0) {
                targetIndex = currentIndex - 1;
            } else if (direction === 'down' && currentIndex < categoryFaqs.length - 1) {
                targetIndex = currentIndex + 1;
            }

            if (targetIndex !== -1) {
                const itemAtTargetIndex = categoryFaqs[targetIndex];
                const newFaqs = prevFaqs.map(f => {
                    if (f.key === faqToMove.key) return { ...f, order: itemAtTargetIndex.order };
                    if (f.key === itemAtTargetIndex.key) return { ...f, order: faqToMove.order };
                    return f;
                });
                message.success('순서가 변경되었습니다.');
                return newFaqs;
            }
            return prevFaqs;
        });
    }, []);

    // --- Drag and Drop Order Change ---
    const handleDragEnd = useCallback((event, categoryName) => {
        const { active, over } = event;
        if (!active || !over || active.id === over.id) {
            return;
        }
        
        console.log(`DragEnd in category '${categoryName}': ActiveID=${active.id}, OverID=${over.id}`);

        setFaqs(prevFaqs => {
            const itemsInThisCategory = prevFaqs
                .filter(f => ((typeof f.category === 'string' && f.category.trim() !== "") ? f.category.trim() : DEFAULT_CATEGORY) === categoryName);

            const oldIndex = itemsInThisCategory.findIndex(item => item.key === active.id);
            const newIndex = itemsInThisCategory.findIndex(item => item.key === over.id);

            if (oldIndex === -1 || newIndex === -1) {
                console.error("DragEnd: Item not found in category for reordering.", {activeId: active.id, overId: over.id, categoryName});
                return prevFaqs;
            }

            const reorderedCategoryItems = arrayMove(itemsInThisCategory, oldIndex, newIndex);

            const updatedOrderInCategory = reorderedCategoryItems.map((item, index) => ({
                ...item,
                order: index + 1
            }));

            const newFaqsList = prevFaqs.map(faq => {
                if (((typeof faq.category === 'string' && faq.category.trim() !== "") ? faq.category.trim() : DEFAULT_CATEGORY) !== categoryName) {
                    return faq;
                }
                const updatedItem = updatedOrderInCategory.find(uItem => uItem.key === faq.key);
                return updatedItem || faq;
            });

            message.success(`FAQ 순서가 변경되었습니다.`);
            return newFaqsList;
        });
    }, []);

    // --- Toggle All Panels ---
    const expandAll = () => {
        setActiveCategoryKey(groupedFaqs.map(([categoryName]) => categoryName));
    };

    const collapseAll = () => {
        setActiveCategoryKey([]);
    };

    // --- Handler for TreeTransfer Component (onChange prop for Transfer) ---
    const handleTreeTransferChange = useCallback((nextTargetKeysParam, direction, moveKeys) => {
        let finalNextTargetKeys = [...nextTargetKeysParam];
        let limited = false;

        if (finalNextTargetKeys.length > MAX_REPRESENTATIVE_FAQS) {
            message.warning(`대표 FAQ는 최대 ${MAX_REPRESENTATIVE_FAQS}개까지만 설정할 수 있습니다. ${finalNextTargetKeys.length - MAX_REPRESENTATIVE_FAQS}개 항목이 제외됩니다.`);
            finalNextTargetKeys = finalNextTargetKeys.slice(0, MAX_REPRESENTATIVE_FAQS);
            limited = true;
        }

        setFaqs(prevFaqs =>
            prevFaqs.map(faq => ({
                ...faq,
                isRepresentative: finalNextTargetKeys.includes(faq.key)
            }))
        );
        
        if (direction === 'left') { 
            setTransferTargetSelectedKeys(prev => prev.filter(k => !moveKeys.includes(k)));
        } else { 
            // If items were moved to target (right) and some were selected in source
            let newSourceSelected = transferSourceSelectedKeys.filter(k => !moveKeys.includes(k)); // Remove moved keys
            if(limited){
                // If limit was hit, movedKeys might contain items that weren't actually moved to target.
                // We need to re-add those to selection if they were part of original moveKeys but not in finalNextTargetKeys.
                const notMovedButAttempted = moveKeys.filter(mk => !finalNextTargetKeys.includes(mk));
                newSourceSelected = [...newSourceSelected, ...notMovedButAttempted];
                 // Also, clear target selection if items were limited, as Transfer component might have its own ideas
                setTransferTargetSelectedKeys([]); 
            }
            setTransferSourceSelectedKeys(Array.from(new Set(newSourceSelected)));
        }
        // message.success('대표 FAQ 목록이 업데이트되었습니다.'); // Warning/Success might conflict
    }, [transferSourceSelectedKeys, setTransferSourceSelectedKeys, setTransferTargetSelectedKeys, MAX_REPRESENTATIVE_FAQS]); // Added MAX_REPRESENTATIVE_FAQS

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex', width: '100%' }}>
            <Title level={2}>FAQ 관리</Title>
            <Text type="secondary">자주 묻는 질문과 답변을 관리합니다. 탭을 선택하여 대표 FAQ를 설정하거나 전체 FAQ 목록을 관리하세요.</Text>

            <Tabs defaultActiveKey="1">
                <TabPane tab="대표 FAQ 설정"  key="1">
                    <Row justify="end" style={{ marginTop: 16, marginBottom: 16}}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                            새 FAQ 추가
                        </Button>
                    </Row>
                    <Card title="대표 FAQ 설정 가이드" size="small" style={{ marginBottom:16 }}>
                        <Paragraph>
                            - 왼쪽에 표시된 카테고리별 FAQ 목록에서 대표로 지정하고 싶은 FAQ를 선택하세요.<br/>
                            - 선택된 FAQ는 오른쪽 '대표 FAQ' 목록으로 이동하며, 사용자 페이지의 FAQ 최상단에 우선적으로 노출됩니다.<br/>
                            - 검색 기능을 사용하여 특정 FAQ를 빠르게 찾을 수 있습니다.<br/>
                            - <Text strong>대표 FAQ는 최대 {MAX_REPRESENTATIVE_FAQS}개까지 설정할 수 있습니다.</Text>
                        </Paragraph>
                    </Card>
                    <TreeTransfer
                        dataSource={treeDataSourceForTransfer} // Renamed prop for clarity
                        targetKeys={targetKeys}
                        currentSourceSelectedKeys={transferSourceSelectedKeys}
                        onSourceSelectedKeysChange={setTransferSourceSelectedKeys}
                        currentTargetSelectedKeys={transferTargetSelectedKeys} 
                        onTargetSelectedKeysChange={setTransferTargetSelectedKeys} 
                        onChange={handleTreeTransferChange} 
                        maxRepresentativeFaqs={MAX_REPRESENTATIVE_FAQS} // Pass the limit
                        titles={['일반 FAQ (카테고리별)', '대표 FAQ']} 
                        showSearch 
                        filterOption={(inputValue, item) => 
                            item.title.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                </TabPane>
                <TabPane tab="FAQ 목록 관리" key="2">
                    <Row justify="end" style={{ marginTop: 16, marginBottom: 16}}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                            새 FAQ 추가
                        </Button>
                    </Row>

                    {/* Expand/Collapse All Buttons */}
                    <Row justify="end" style={{ marginBottom: 8 }}>
                        <Space>
                            <Button onClick={expandAll} size="small">전체 펼치기</Button>
                            <Button onClick={collapseAll} size="small">전체 접기</Button>
                        </Space>
                    </Row>

                    {/* Main FAQ Collapse Section */}
                    <Collapse activeKey={activeCategoryKey} onChange={setActiveCategoryKey} accordion={false}>
                        {groupedFaqs.map(([categoryName, faqsInCategory]) => (
                            <Panel header={<Title level={5} style={{margin:0}}>{`${categoryName} (${faqsInCategory.length})`}</Title>} key={categoryName}>
                                <DndContext 
                                    sensors={sensors} 
                                    collisionDetection={closestCenter} 
                                    onDragEnd={(event) => handleDragEnd(event, categoryName)}
                                >
                                    <SortableContext 
                                        items={faqsInCategory.map(f => f.key)} 
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div style={{padding: '10px 0'}}>
                                            {faqsInCategory.map(faq => (
                                                <DraggableFaqItem 
                                                    key={faq.key} 
                                                    faq={faq} 
                                                    onEdit={showModal}
                                                    onDelete={handleDelete}
                                                    onToggleVisibility={handleVisibilityToggle}
                                                    onChangeOrder={handleChangeOrderManual}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                                 {faqsInCategory.length === 0 && <Text type="secondary" style={{display: 'block', textAlign: 'center', padding: '10px'}}>이 카테고리에 등록된 FAQ가 없습니다.</Text>}
                            </Panel>
                        ))}
                     </Collapse>
                     {groupedFaqs.length === 0 && <Text>등록된 FAQ가 없습니다.</Text>}
                </TabPane>
            </Tabs>
            
            {/* Modal is kept outside Tabs to function correctly */}
            <Modal
                title={editingFaq ? `FAQ 수정 (ID: ${editingFaq.id})` : '새 FAQ 추가'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingFaq ? '수정' : '추가'}
                cancelText="취소"
                destroyOnClose
                width={700}
            >
                <Form form={form} layout="vertical" name="faq_form">
                     <Form.Item
                        name="category"
                        label="카테고리"
                        rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}
                        tooltip="FAQ 생성 시에만 카테고리를 지정할 수 있습니다. 기존 FAQ의 카테고리 변경은 지원되지 않습니다."
                    >
                        <Select placeholder="카테고리 선택" disabled={!!editingFaq} allowClear>
                            {uniqueCategories.map(cat => (
                                <Option key={cat} value={cat}>{cat}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="question"
                        label="질문"
                        rules={[{ required: true, message: '질문을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 비밀번호는 어떻게 변경하나요?" />
                    </Form.Item>
                    <Form.Item
                        name="answer"
                        label="답변"
                        rules={[{ required: true, message: '답변을 입력해주세요.' }]}
                    >
                        <TextArea rows={10} placeholder="질문에 대한 답변을 상세하게 입력해주세요." />
                    </Form.Item>
                     <Row gutter={16}>
                         <Col span={12}>
                             <Form.Item
                                name="order"
                                label="노출 순서"
                                rules={[{ required: true, type: 'number', message: '노출 순서를 숫자로 입력해주세요.' }]}
                                tooltip="숫자가 낮을수록 해당 카테고리 내에서 먼저 노출됩니다."
                            >
                                <InputNumber min={0} style={{ width: '100%' }}/>
                            </Form.Item>
                         </Col>
                         <Col span={12}>
                            <Form.Item name="isVisible" label="노출 여부" valuePropName="checked" initialValue={true}>
                                <Switch checkedChildren="노출" unCheckedChildren="숨김" />
                             </Form.Item>
                         </Col>
                     </Row>
                </Form>
            </Modal>
        </Space>
    );
};

export default FaqManagement; 