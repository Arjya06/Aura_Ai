import React, { useState, useEffect, useRef } from 'react';
import { Features, Scores, ChatMessage } from '../types';
import { startChatSession, sendMessage } from '../services/geminiService';

interface AlertModalProps {
  score: number;
  initialFeatures: Features;
  initialScores: Scores;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ score, initialFeatures, initialScores, onClose }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isChatError, setIsChatError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      const initialMessage = await startChatSession(initialFeatures, initialScores);
      
      if (initialMessage.toLowerCase().includes('failed') || initialMessage.toLowerCase().includes('unavailable')) {
        setIsChatError(true);
      }

      setChatHistory([{ role: 'model', content: initialMessage }]);
      setIsLoading(false);
    };
    initChat();
  }, [initialFeatures, initialScores]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const modelResponse = await sendMessage(userInput);
    const modelMessage: ChatMessage = { role: 'model', content: modelResponse };
    setChatHistory(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-sentinel-blue-light border-2 border-red-500 rounded-lg shadow-xl p-6 max-w-2xl w-full flex flex-col transform transition-all animate-fade-in-up max-h-[90vh]">
        <div className="flex-shrink-0">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h2 className="text-xl font-bold text-red-400">AI Co-Pilot: Anomaly Investigation</h2>
                        <p className="text-4xl font-bold text-white my-1">{Math.round(score * 100)}% <span className="text-lg font-normal text-sentinel-gray">Risk Score</span></p>
                    </div>
                </div>
                <button onClick={onClose} className="text-sentinel-gray hover:text-white">&times;</button>
            </div>
        </div>

        <div className="flex-grow mt-4 bg-sentinel-blue-deep rounded-md p-4 overflow-y-auto min-h-[200px] space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-sentinel-cyan/20 text-sentinel-cyan flex items-center justify-center flex-shrink-0 text-xs font-bold">AI</div>}
              <div className={`max-w-md p-3 rounded-lg ${msg.role === 'model' ? 'bg-sentinel-blue-light text-sentinel-light-gray' : 'bg-sentinel-cyan text-sentinel-blue-deep font-medium'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
           {isLoading && chatHistory.length > 0 && (
             <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-sentinel-cyan/20 text-sentinel-cyan flex items-center justify-center flex-shrink-0 text-xs font-bold">AI</div>
                 <div className="max-w-md p-3 rounded-lg bg-sentinel-blue-light text-sentinel-light-gray animate-pulse">
                    ...
                 </div>
             </div>
           )}
          <div ref={chatEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="mt-4 flex-shrink-0 flex items-center gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isChatError ? "AI Co-pilot unavailable" : "Ask a follow-up question..."}
            className="w-full bg-sentinel-blue-dark border border-sentinel-blue-light rounded-lg p-2 focus:ring-2 focus:ring-sentinel-cyan focus:outline-none disabled:opacity-50"
            disabled={isLoading || isChatError}
          />
          <button type="submit" className="bg-sentinel-cyan text-sentinel-blue-deep font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !userInput.trim() || isChatError}>
            Send
          </button>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AlertModal;