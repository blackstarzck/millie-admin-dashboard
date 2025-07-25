import React, { createContext, useState, useContext, useCallback } from "react";
import moment from "moment";

// Helper to generate unique IDs (replace with a more robust solution if needed)
const generateId = () =>
  `popupTpl${Date.now()}${Math.random().toString(36).substring(2, 7)}`;

// Initial Data - Moved from TemplateManagement.js
// NOTE: In a real app, this would likely be fetched from an API
const initialTemplatesData = [
  {
    key: "popupTpl001",
    id: "popupTpl001",
    name: "긴급 공지 팝업 템플릿",
    description: "화면 중앙에 표시되는 긴급 공지 스타일",
    lastModified: "2024-07-21",
    content:
      '<div class="popup-urgent"><h1>긴급 공지</h1><p>{content}</p><button>닫기</button></div>',
    variables: [{ key: "{content}", label: "공지 내용" }],
  },
  {
    key: "popupTpl002",
    id: "popupTpl002",
    name: "이벤트 홍보 팝업 템플릿",
    description: "이미지와 버튼이 포함된 이벤트 안내 스타일",
    lastModified: "2024-07-22",
    content:
      '<div class="popup-event"><img src="{imageUrl}" alt="Event"><p>{text}</p><button>자세히 보기</button><button>닫기</button></div>',
    variables: [
      { key: "{imageUrl}", label: "이미지 URL" },
      { key: "{text}", label: "이벤트 문구" },
    ],
  },
];

// Create Context
const PopupTemplateContext = createContext();

// Create Provider Component
export const PopupTemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState(initialTemplatesData);

  const addTemplate = useCallback((templateData) => {
    const newTemplate = {
      ...templateData,
      key: generateId(), // Generate unique key/id
      id: generateId(),
      lastModified: moment().format("YYYY-MM-DD"),
    };
    setTemplates((prevTemplates) => [newTemplate, ...prevTemplates]);
    // TODO: Add API call to save the new template
    console.log("Context: Adding template", newTemplate);
  }, []);

  const updateTemplate = useCallback((key, updatedData) => {
    setTemplates((prevTemplates) =>
      prevTemplates.map((tpl) =>
        tpl.key === key
          ? {
              ...tpl,
              ...updatedData,
              lastModified: moment().format("YYYY-MM-DD"),
            }
          : tpl
      )
    );
    // TODO: Add API call to update the template
    console.log("Context: Updating template", key, updatedData);
  }, []);

  const deleteTemplate = useCallback((key) => {
    setTemplates((prevTemplates) =>
      prevTemplates.filter((tpl) => tpl.key !== key)
    );
    // TODO: Add API call to delete the template
    console.log("Context: Deleting template", key);
  }, []);

  const getTemplateById = useCallback(
    (id) => {
      return templates.find((tpl) => tpl.id === id);
    },
    [templates]
  );

  const value = {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
  };

  return (
    <PopupTemplateContext.Provider value={value}>
      {children}
    </PopupTemplateContext.Provider>
  );
};

// Custom Hook for easy consumption
export const usePopupTemplates = () => {
  const context = useContext(PopupTemplateContext);
  if (context === undefined) {
    throw new Error(
      "usePopupTemplates must be used within a PopupTemplateProvider"
    );
  }
  return context;
};
