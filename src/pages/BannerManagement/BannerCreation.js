import { HolderOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const BANNERS_STORAGE_KEY = 'millie-admin-banners';

const SortableItem = ({ children, id }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };
    return <div ref={setNodeRef} style={style} {...attributes} {...listeners}>{children}</div>;
};

const BannerCreation = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { bannerId } = useParams();
    const isEditMode = !!bannerId;

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

    useEffect(() => {
        if (isEditMode) {
            try {
                const storedBanners = window.localStorage.getItem(BANNERS_STORAGE_KEY);
                const banners = storedBanners ? JSON.parse(storedBanners) : [];
                const data = banners.find(b => b.key === bannerId);
                if (data) {
                    form.setFieldsValue(data);
                }
            } catch (error) {
                console.error("Failed to load banner data for editing", error);
            }
        } else {
             form.setFieldsValue({ items: [] });
        }
    }, [bannerId, isEditMode, form]);

    const onFinish = (values) => {
        try {
            const storedBanners = window.localStorage.getItem(BANNERS_STORAGE_KEY);
            let banners = storedBanners ? JSON.parse(storedBanners) : [];

            if (isEditMode) {
                const index = banners.findIndex(b => b.key === bannerId);
                if (index > -1) {
                    const originalBanner = banners[index];
                    banners[index] = { ...originalBanner, ...values };
                }
            } else {
                const newBanner = {
                    ...values,
                    key: `banner-${Date.now()}`,
                    createdAt: new Date().toISOString().slice(0, 10),
                };
                banners.push(newBanner);
            }

            window.localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));

            Modal.success({
                title: isEditMode ? '수정 완료' : '생성 완료',
                content: `배너가 성공적으로 ${isEditMode ? '수정' : '생성'}되었습니다.`,
                onOk: () => navigate('/banner/list'),
            });
        } catch (error) {
            console.error("Failed to save banner data", error);
            Modal.error({
                title: '저장 실패',
                content: '데이터를 저장하는 중에 오류가 발생했습니다.',
            });
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%', padding: 24 }}>
            <Title level={2}>{isEditMode ? '배너 수정' : '배너 등록'}</Title>

            <Card>
                <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item name="name" label="배너 이름" rules={[{ required: true, message: '배너 이름을 입력해주세요.' }]}><Input placeholder="예: 메인 페이지 상단 배너" /></Form.Item>
                    <Form.Item name="position" label="노출 위치" rules={[{ required: true, message: '노출 위치를 선택해주세요.' }]} initialValue="Home_Top">
                        <Select>
                            <Option value="Home_Top">홈 상단</Option>
                            <Option value="Home_Middle">홈 중단</Option>
                            <Option value="Category_Top">카테고리 상단</Option>
                        </Select>
                    </Form.Item>

                    <Title level={5} style={{ marginBottom: 16 }}>배너 아이템 (드래그하여 순서 변경)</Title>

                    <Form.List name="items">
                        {(fields, { add, remove, move }, { errors }) => {
                            const handleDragEnd = (event) => {
                                const { active, over } = event;
                                if (active && over && active.id !== over.id) {
                                    const items = form.getFieldValue('items');
                                    const oldIndex = items.findIndex((item) => item.id === active.id);
                                    const newIndex = items.findIndex((item) => item.id === over.id);
                                    if (oldIndex > -1 && newIndex > -1) {
                                        move(oldIndex, newIndex);
                                    }
                                }
                            };

                            return (
                                <>
                                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                                        <SortableContext items={(form.getFieldValue('items') || []).map(item => item.id)} strategy={rectSortingStrategy}>
                                            <Row gutter={[16, 16]} align="stretch">
                                                {(fields || []).map((field, index) => {
                                                    const item = form.getFieldValue('items')[index];
                                                    if (!item) return null;
                                                    return (
                                                      <Col xs={24} sm={12} md={8} key={item.id}>
                                                          <SortableItem id={item.id}>
                                                              <Card
                                                                  size="small"
                                                                  title={<Space><HolderOutlined style={{ cursor: 'grab' }} /><span>{`아이템 #${index + 1}`}</span></Space>}
                                                                  extra={<MinusCircleOutlined onClick={() => remove(field.name)} style={{color: 'red'}}/>}
                                                                  style={{ height: '100%' }}
                                                              >
                                                                  <Form.Item {...field} name={[field.name, 'title-01']} label="제목 01" rules={[{ required: true, message: '제목 01을 입력해주세요.' }]}><Input placeholder="배너 제목" /></Form.Item>
                                                                  <Form.Item {...field} name={[field.name, 'title-02']} label="제목 02" rules={[{ required: true, message: '제목 02을 입력해주세요.' }]}><Input placeholder="배너 제목" /></Form.Item>
                                                                  <Form.Item {...field} name={[field.name, 'description-01']} label="설명 01"><Input placeholder="배너 설명" /></Form.Item>
                                                                  <Form.Item {...field} name={[field.name, 'description-02']} label="설명 02"><Input placeholder="배너 설명" /></Form.Item>
                                                                  <Form.Item {...field} name={[field.name, 'DesktopImageUrl']} label="PC 배경 이미지" rules={[{ required: true, message: 'PC 배경 이미지 URL를 입력해주세요.' }, { type: 'url', message: '유효한 URL을 입력해주세요.' }]}><Input placeholder="https://example.com/image.png" /></Form.Item>
                                                                  <Form.Item {...field} name={[field.name, 'MobileImageUrl']} label="모바일일 배경 이미지" rules={[{ required: true, message: '모바일일 배경 이미지 URL를 입력해주세요.' }, { type: 'url', message: '유효한 URL을 입력해주세요.' }]}><Input placeholder="https://example.com/image.png" /></Form.Item>
                                                                  <Form.Item {...field} name={[field.name, 'navigationUrl']} label="네비게이션 URL" rules={[{ required: true, message: '네비게이션 URL을 입력해주세요.' }]}><Input placeholder="/target-page" /></Form.Item>
                                                                  <Form.Item {...field} name={[field.name, 'id']} hidden initialValue={`item-${Date.now()}-${index}`}><Input /></Form.Item>
                                                              </Card>
                                                          </SortableItem>
                                                      </Col>
                                                    )
                                                })}
                                            </Row>
                                        </SortableContext>
                                    </DndContext>
                                    <Form.Item style={{ marginTop: 16 }}>
                                        <Button type="dashed" onClick={() => add({ id: `item-${Date.now()}`})} block icon={<PlusOutlined />}>아이템 추가</Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            );
                        }}
                    </Form.List>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Space>
                            <Button type="primary" htmlType="submit">{isEditMode ? '배너 수정' : '배너 생성'}</Button>
                            <Button onClick={() => navigate('/banner/list')}>취소</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </Space>
    );
};

export default BannerCreation;
