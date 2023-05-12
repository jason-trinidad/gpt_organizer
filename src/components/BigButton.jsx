import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { getChainResponse, getNewChain } from "../chains/convo_chain";

const BigButton = () => {
  const defaultColor = "bg-blue-500";
  const defaultText = "Hold space to chat";
  const recordingColor = "bg-red-500";
  const recordingText = "Listening...";
  const thinkingColor = "bg-yellow-500";
  const thinkingText = "Thinking...";
  const respondingColor = "bg-green-500";
  const respondingText = "Responding...";

  const [buttonColor, setButtonColor] = useState(defaultColor);
  const [indicatorText, setIndicatorText] = useState(defaultText);
  const [convoChain, setConvoChain] = useState();
  const [isInitialRender, setIsInitialRender] = useState(true);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      // Start listening
      SpeechRecognition.startListening();

      // Indicate that a recording is in progress
      setButtonColor(recordingColor);
      setIndicatorText(recordingText);
    }
  };

  const handleKeyUp = (e) => {
    if (e.code === "Space") {
      // Stop listening
      SpeechRecognition.stopListening();

      // Reset color and text
      setButtonColor(thinkingColor);
      setIndicatorText(thinkingText);
    }
  };

  const vocalize = async (script) => {
    const message = new SpeechSynthesisUtterance();
    message.text = script;
    message.onend = () => {
      setButtonColor(defaultColor);
      setIndicatorText(defaultText);
    };

    setButtonColor(respondingColor);
    setIndicatorText(respondingText);

    window.speechSynthesis.speak(message);
  };

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);

      setConvoChain(getNewChain());
    } else if (!listening) {
      console.log(transcript);

      // Get the AI's response
      (async () => {
        setButtonColor(thinkingColor);
        setIndicatorText(thinkingText);

        const response = await getChainResponse(convoChain, transcript);

        console.log(response);
        vocalize(response.response);
      })();
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [listening]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`${buttonColor} text-white text-lg font-bold 
          w-32 h-32 md:w-64 md:h-64 lg:w-96 lg:h-96 
          rounded-full flex items-center justify-center`}
      >
        {indicatorText}
      </div>
    </div>
  );
};

export default BigButton;
