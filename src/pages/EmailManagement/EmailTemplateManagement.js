import { Editor } from '@tinymce/tinymce-react';
import { Alert, Button, Card, Col, Input, Row, Tabs, Typography } from 'antd';
import React, { useRef, useState } from 'react';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

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

// 사용 가능한 템플릿 변수 목록
const templateVariables = [
    { text: '사용자 이름', value: '{{ .UserName }}' },
    { text: '확인 URL', value: '{{ .ConfirmationURL }}' },
    { text: '초대 URL', value: '{{ .InvitationURL }}' },
    { text: '매직 링크 URL', value: '{{ .MagicLink }}' },
    { text: '이메일 변경 URL', value: '{{ .EmailChangeURL }}' },
    { text: '비밀번호 재설정 URL', value: '{{ .PasswordResetURL }}' },
    { text: '재인증 URL', value: '{{ .ReauthenticationURL }}' },
    { text: '프로모션 URL', value: '{{ .PromotionURL }}' },
];


const EmailTemplateManagement = () => {
    const [templates, setTemplates] = useState(initialTemplateData);
    const [activeTab, setActiveTab] = useState('confirm_signup');
    const editorRef = useRef(null);

    // TinyMCE API 키 확인
    const tinymceApiKey = process.env.REACT_APP_TINYMCE_API_KEY;

    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === 'development') {
        console.log('TinyMCE API Key loaded:', tinymceApiKey ? 'Yes' : 'No');
    }

    // API 키가 없을 경우 경고
    if (!tinymceApiKey) {
        console.error('TinyMCE API Key is missing! Please set REACT_APP_TINYMCE_API_KEY environment variable.');
    }

    const handleSubjectChange = (e) => {
        const newTemplates = { ...templates };
        newTemplates[activeTab].subject = e.target.value;
        setTemplates(newTemplates);
    };

    const handleEditorChange = (content, editor) => {
        const newTemplates = { ...templates };
        newTemplates[activeTab].body = content;
        setTemplates(newTemplates);
    };

    const handleSave = () => {
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            // 여기서 저장 로직을 구현할 수 있습니다.
            // 예를 들어, API 호출을 통해 서버에 템플릿을 저장합니다.
            console.log('Saving template:', {
                type: activeTab,
                subject: templates[activeTab].subject,
                body: content,
            });
            alert('템플릿이 저장되었습니다.');
        }
    };

    const currentTemplate = templates[activeTab];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>이메일 템플릿 등록</Title>
            <Text type="secondary">사용자에게 전송되는 이메일의 내용을 수정합니다.</Text>

            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{marginTop: '20px'}}
                tabBarExtraContent={<Button type="primary" onClick={handleSave}>템플릿 저장</Button>}
            >
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
                        {!tinymceApiKey && (
                            <Alert
                                message="TinyMCE API 키가 설정되지 않았습니다"
                                description="환경변수 REACT_APP_TINYMCE_API_KEY를 설정해주세요. Vercel에서는 프로젝트 설정 > Environment Variables에서 설정할 수 있습니다."
                                type="error"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />
                        )}
                         <Editor
                            apiKey={tinymceApiKey}
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={currentTemplate.body}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 500,
                                menubar: 'file edit view insert format tools table help',
                                language: 'ko_KR', // 에디터 언어를 한국어로 설정
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount', 'preview'
                                ],
                                toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | templateVariables | preview | code | help', // 미리보기 버튼 추가
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                // 파일 메뉴 커스터마이징 - preview와 print만 표시
                                menu: {
                                    file: { title: '파일', items: 'preview | print' },
                                    edit: { title: '편집', items: 'undo redo | cut copy paste | selectall | searchreplace' },
                                    view: { title: '보기', items: 'code | visualaid visualchars visualblocks | spellchecker | fullscreen' },
                                    insert: { title: '삽입', items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
                                    format: { title: '서식', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
                                    tools: { title: '도구', items: 'spellchecker spellcheckerlanguage | code wordcount' },
                                    table: { title: '표', items: 'inserttable | cell row column | tableprops deletetable' },
                                    help: { title: '도움말', items: 'help' }
                                },
                                // 템플릿 변수 드롭다운 메뉴 설정
                                setup: (editor) => {
                                    // 템플릿 변수 버튼 추가
                                    editor.ui.registry.addMenuButton('templateVariables', {
                                        text: '템플릿 변수',
                                        fetch: (callback) => {
                                            const items = templateVariables.map(variable => ({
                                                type: 'menuitem',
                                                text: variable.text,
                                                onAction: () => {
                                                    editor.insertContent(`&nbsp;${variable.value}&nbsp;`);
                                                }
                                            }));
                                            callback(items);
                                        }
                                    });
                                }
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EmailTemplateManagement;
