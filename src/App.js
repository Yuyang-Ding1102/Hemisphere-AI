import { Card, ConfigProvider, Layout, theme, Typography } from "antd";
import React, { useState } from "react";
import ChatComponent from "./components/ChatComponent";
import PdfUploader from "./components/PdfUploader";
import RenderQA from "./components/RenderQA";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const App = () => {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResp = (question, answer) => {
    setConversation((prev) => [...prev, { question, answer }]);
  };

  // === fancy background color ===
  const layoutStyle = {
    height: "100vh",
    background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    backgroundSize: "400% 400%",
    animation: "gradientBG 15s ease infinite",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.7)", 
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    padding: "0 40px",
    height: "70px",
    zIndex: 10,
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
  };

  const titleStyle = {
    margin: 0,
    background: "linear-gradient(90deg, #23a6d5, #23d5ab)", // 呼应背景色
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "800",
    fontSize: "26px",
    letterSpacing: "-0.5px",
    cursor: "default",
  };

  const contentStyle = {
    flex: 1,
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", 
    position: "relative",
    zIndex: 1,
  };

  // 聊天记录区域
  const scrollableAreaStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "10px 20px 120px 20px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };


  const footerStyle = {
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingBottom: "30px",
    background: "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
    zIndex: 100,
  };

  const inputContainerStyle = {
    width: "90%",
    maxWidth: "800px",
    pointerEvents: "auto",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#23a6d5",
          borderRadius: 16,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      {/* 注入全局动画样式 */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          /* 隐藏 Chrome/Safari 滚动条但保留功能 */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <Layout style={layoutStyle}>
        {/* Header */}
        <Header style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "32px", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>🧠</span>
            <Title level={3} style={titleStyle}>
              Hemisphere AI
            </Title>
          </div>
          <Text strong style={{ color: "#555", fontSize: "13px", opacity: 0.8 }}>
            Dual-Brain Architecture
          </Text>
        </Header>

        {/* Content */}
        <Content style={contentStyle}>
          {/* Upload Card */}
          <div style={{ marginBottom: "10px" }}>
            <Card
              bordered={false}
              style={{
                background: "rgba(255, 255, 255, 0.65)", // 半透明卡片
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
              }}
              bodyStyle={{ padding: "16px" }}
            >
              <PdfUploader />
            </Card>
          </div>

          {/* Chat Area */}
          <div style={scrollableAreaStyle} className="hide-scrollbar">
            <RenderQA conversation={conversation} isLoading={isLoading} />
          </div>
        </Content>

        {/* Floating Footer */}
        <div style={footerStyle}>
          <div style={inputContainerStyle}>
            <ChatComponent
              handleResp={handleResp}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
      </Layout>
    </ConfigProvider>
  );
};

export default App;