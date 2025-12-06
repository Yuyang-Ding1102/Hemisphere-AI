import { AudioOutlined, StopOutlined } from "@ant-design/icons"; // 引入 Stop 图标
import { Button, Input, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import Speech from "speak-tts";

const { Search } = Input;

const DOMAIN = process.env.REACT_APP_DOMAIN || "http://localhost:5001";

const searchContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

const ChatComponent = (props) => {
  const { handleResp, isLoading, setIsLoading } = props;
  
  const [searchValue, setSearchValue] = useState("");
  const [isChatModeOn, setIsChatModeOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);   // control microphone status
  const [speech, setSpeech] = useState(null);

  // Speech Recognition (STT) Setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // 1. Initialization
  useEffect(() => {
    const initialized_speech = new Speech();
    initialized_speech
      .init({
        volume: 1,
        lang: "en-US",
        rate: 1,
        pitch: 1,
        splitSentences: false,
      })
      .then((data) => {
        console.log("Speech is ready, voices are available", data);
        setSpeech(initialized_speech);
      })
      .catch((e) => {
        console.error("An error occured while initializing : ", e);
      });
  }, []);

  // 2. 监听语音输入：当用户说完话（listening 变为 false）且有内容时，自动发送
  useEffect(() => {
    if (isChatModeOn && !listening && transcript) {
      // 只有在 ChatMode 开启时才自动发送
      const currentQuery = transcript; // 暂存
      resetTranscript(); // 发送前清空，防止重复
      onSearch(currentQuery);
      setIsRecording(false);
    }
  }, [listening, transcript, isChatModeOn]); // 依赖项加入 isChatModeOn

  // 3. AI 说话函数
  const talk = (textToSay) => {
    if (!speech) return;

    // 朗读前先停止录音，防止自己听到自己的声音造成死循环
    SpeechRecognition.stopListening();
    setIsRecording(false);

    speech
      .speak({
        text: textToSay,
        queue: false,
        listeners: {
          onstart: () => {
            console.log("Start speaking");
          },
          onend: () => {
            console.log("End speaking");
            // after speaking, restart recording again to achieve consecutive conversation
            if (isChatModeOn) {
                userStartConvo(); 
            }
          },
        },
      })
      .catch((e) => {
        console.error("An error occurred :", e);
      });
  };

  // users start to speak
  const userStartConvo = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
    message.info("Listening...");
  };

  const chatModeClickHandler = () => {
    const nextMode = !isChatModeOn;
    setIsChatModeOn(nextMode);
    
    if (nextMode) {
      userStartConvo();
    } else {
      setIsRecording(false);
      SpeechRecognition.stopListening();
      if(speech) speech.cancel();
    }
  };

  const recordingClickHandler = () => {
    if (isRecording) {
      setIsRecording(false);
      SpeechRecognition.stopListening();
    } else {
      userStartConvo();
    }
  };

  const onSearch = async (question) => {
    if (!question.trim()) return;

    setSearchValue("");
    setIsLoading(true);

    try {
      const response = await axios.get(`${DOMAIN}/chat`, {
        params: { question },
      });
      
      handleResp(question, response.data);

      if (isChatModeOn && response.data.ragAnswer) {
        talk(response.data.ragAnswer); 
      }

    } catch (error) {
      console.error(`Error: ${error}`);
      handleResp(question, { error: "Failed to fetch response" });
      if (isChatModeOn) talk("Sorry, I encountered an error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div style={searchContainer}>
      {/* 只有在非 ChatMode 时才显示文本输入框 */}
      {!isChatModeOn && (
        <Search
          placeholder="Input text"
          enterButton="Ask"
          size="large"
          onSearch={onSearch}
          loading={isLoading}
          value={searchValue}
          onChange={handleChange}
          style={{ width: "400px" }}
        />
      )}

      <Button
        type={isChatModeOn ? "primary" : "default"}
        danger={isChatModeOn}
        onClick={chatModeClickHandler}
        size="large"
      >
        {isChatModeOn ? "Exit Voice Mode" : "Enter Voice Mode"}
      </Button>

      {isChatModeOn && (
        <Button
          type="primary"
          shape="circle"
          icon={isRecording ? <StopOutlined spin /> : <AudioOutlined />}
          size="large"
          onClick={recordingClickHandler}
          style={{ 
            backgroundColor: isRecording ? "#ff4d4f" : "#1890ff",
            border: "none" 
          }}
        />
      )}
    </div>
  );
};

export default ChatComponent;