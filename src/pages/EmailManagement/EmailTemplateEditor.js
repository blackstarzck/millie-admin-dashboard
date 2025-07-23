import { Card, Col, Input, Row, Tabs, Typography } from 'antd';
import React, { useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // SunEditor CSS import

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { TextArea } = Input;

// 각 탭에 대한 초기 데이터 구조
const initialTemplateData = {
    'confirm_signup': {
        subject: '회원가입을 확인해주세요',
        body: `<h2>회원가입 확인</h2>
<p>밀리의 서재에 가입해주셔서 감사합니다. 아래 버튼을 눌러 이메일 주소를 인증하고 회원가입을 완료해주세요.</p>
<p><a href="{{ .ConfirmationURL }}">이메일 주소 확인</a></p>`
    },
    'welcome_user': {
        subject: '밀리의 서재에 오신 것을 환영합니다!',
        body: `<h2>밀리의 서재에 오신 것을 환영합니다!</h2>
<p>가입해주셔서 감사합니다. 이제 밀리의 서재가 제공하는 다채로운 콘텐츠를 마음껏 즐겨보세요.</p>
<p>지금 바로 독서를 시작해보세요!</p>`
    },
    'invite_user': {
        subject: '밀리의 서재에 초대되셨습니다!',
        body: `<h2>초대장이 도착했습니다!</h2>
<p>밀리의 서재에 초대되셨습니다. 아래 링크를 클릭하여 가입하고 특별한 혜택을 받아보세요.</p>
<p><a href="{{ .InvitationURL }}">초대 수락하기</a></p>`
    },
    'magic_link': {
        subject: '매직 링크로 간편하게 로그인하세요',
        body: `<h2>매직 링크</h2>
<p>아래 링크를 클릭하면 바로 계정에 로그인됩니다.</p>
<p><a href="{{ .MagicLink }}">로그인하기</a></p>`
    },
    'change_email': {
        subject: '이메일 주소 변경을 확인해주세요',
        body: `<h2>이메일 주소 변경 확인</h2>
<p>계정의 이메일 주소 변경 요청이 있었습니다. 본인이 요청한 것이 맞다면 아래 링크를 클릭하여 변경을 완료해주세요.</p>
<p><a href="{{ .EmailChangeURL }}">이메일 변경 확인</a></p>`
    },
    'reset_password': {
        subject: '비밀번호 재설정을 진행해주세요',
        body: `<h2>비밀번호 재설정</h2>
<p>비밀번호 재설정 요청을 받았습니다. 아래 링크를 클릭하여 새로운 비밀번호를 설정하세요.</p>
<p><a href="{{ .PasswordResetURL }}">비밀번호 재설정하기</a></p>`
    },
    'reauthentication': {
        subject: '보안을 위해 재인증이 필요합니다',
        body: `<h2>재인증 필요</h2>
<p>고객님의 정보를 안전하게 보호하기 위해 재인증이 필요합니다. 아래 링크를 클릭하여 계정을 다시 인증해주세요.</p>
<p><a href="{{ .ReauthenticationURL }}">재인증하기</a></p>`
    },
    'event_promotion': {
        subject: '[밀리의 서재] 고객님을 위한 특별한 이벤트와 프로모션 안내입니다.',
        body: `<h2>놓치지 마세요! 특별한 이벤트가 준비되었습니다.</h2>
<p>안녕하세요, {{ .UserName }}님!</p>
<p>고객님을 위해 준비된 특별한 이벤트를 확인하고 풍성한 혜택을 누려보세요!</p>
<p><a href="{{ .PromotionURL }}">이벤트/프로모션 확인하기</a></p>`
    },
};


const EmailTemplateManagement = () => {
    const [templates, setTemplates] = useState(initialTemplateData);
    const [activeTab, setActiveTab] = useState('confirm_signup');

    const handleSubjectChange = (e) => {
        const newTemplates = { ...templates };
        newTemplates[activeTab].subject = e.target.value;
        setTemplates(newTemplates);
    };

    const handleBodyChange = (content) => {
        const newTemplates = { ...templates };
        newTemplates[activeTab].body = content;
        setTemplates(newTemplates);
    };

    const currentTemplate = templates[activeTab];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>이메일 템플릿 등록록</Title>
            <Text type="secondary">사용자에게 전송되는 이메일의 내용을 설정합니다.</Text>

            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{marginTop: '20px'}}>
                <TabPane tab="회원가입 확인" key="confirm_signup" />
                <TabPane tab="회원가입 환영" key="welcome_user" />
                <TabPane tab="사용자 초대" key="invite_user" />
                <TabPane tab="매직 링크" key="magic_link" />
                <TabPane tab="이메일 주소 변경" key="change_email" />
                <TabPane tab="비밀번호 재설정" key="reset_password" />
                <TabPane tab="재인증" key="reauthentication" />
                <TabPane tab="이벤트/프로모션" key="event_promotion" />
            </Tabs>

            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card>
                        <Title level={5}>이메일 제목</Title>
                        <Input
                            value={currentTemplate.subject}
                            onChange={handleSubjectChange}
                        />
                    </Card>
                </Col>
                <Col span={24}>
                     <Card>
                        <Title level={5}>메시지 본문</Title>
                        <SunEditor
                            lang="ko"
                            setContents={currentTemplate.body}
                            onChange={handleBodyChange}
                            setOptions={{
                                height: 300,
                                buttonList: [
                                    ['undo', 'redo'],
                                    ['font', 'fontSize', 'formatBlock'],
                                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                    ['removeFormat'],
                                    '/', // line break
                                    ['fontColor', 'hiliteColor', 'outdent', 'indent'],
                                    ['align', 'horizontalRule', 'list', 'table'],
                                    ['link', 'image', 'video'],
                                    ['fullScreen', 'showBlocks', 'codeView'],
                                    ['preview', 'print'],
                                    ['save']
                                ],
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EmailTemplateManagement;
