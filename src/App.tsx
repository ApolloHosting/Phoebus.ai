import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUp, Terminal, History, Settings, Zap, ShieldAlert } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'System initialized. Phoebus V2 online. How can I assist you today?',
    timestamp: new Date(),
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFounderMode, setIsFounderMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isFounderMode 
          ? 'Founder Mode active. Executing elevated protocols. Acknowledged: ' + newUserMsg.content
          : 'Processing request... ' + newUserMsg.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAiMsg]);
    }, 1000);
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-[#00FF41]/30 selection:text-[#00FF41]">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/10 flex flex-col"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#00FF41] font-mono text-sm">
                <Terminal size={16} />
                <span>SYSTEM.MENU</span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-white/10 rounded-md transition-colors"
              >
                <X size={18} className="text-white/70" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-white/50 font-mono text-xs mb-3 uppercase tracking-wider">
                  <History size={14} />
                  <span>Session History</span>
                </div>
                <div className="space-y-1">
                  {[1, 2, 3].map((i) => (
                    <button key={i} className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-md transition-colors truncate">
                      Session_00{i}_Alpha
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10">
              <button 
                onClick={() => setIsFounderMode(!isFounderMode)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md border transition-all duration-300 ${
                  isFounderMode 
                    ? 'bg-[#00FF41]/10 border-[#00FF41]/50 text-[#00FF41]' 
                    : 'border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-sm">
                  {isFounderMode ? <ShieldAlert size={16} /> : <Settings size={16} />}
                  <span>FOUNDER MODE</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${isFounderMode ? 'bg-[#00FF41] shadow-[0_0_8px_#00FF41]' : 'bg-white/20'}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <header className="h-14 flex-shrink-0 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-between px-4 z-40 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
            >
              <Menu size={18} className="text-white/70" />
            </button>
            <div className="font-mono text-xs sm:text-sm tracking-widest text-white/90">
              PHOEBUS V2 <span className="text-white/30 hidden sm:inline">// CLOVER AI STUDIOS</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs text-white/50 uppercase tracking-wider hidden sm:inline">
              System Status: Online
            </span>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]"></span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
          <div className="max-w-[800px] mx-auto space-y-6 pb-24">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl backdrop-blur-md border ${
                      msg.role === 'user'
                        ? 'bg-white/5 border-white/10 text-white rounded-tr-sm'
                        : isFounderMode
                          ? 'bg-[#00FF41]/5 border-[#00FF41]/20 text-[#00FF41] rounded-tl-sm shadow-[0_0_15px_rgba(0,255,65,0.05)]'
                          : 'bg-white/5 border-white/10 text-white/90 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={12} className={isFounderMode ? 'text-[#00FF41]' : 'text-[#00FF41]/70'} />
                        <span className={`font-mono text-[10px] uppercase tracking-wider ${isFounderMode ? 'text-[#00FF41]' : 'text-white/40'}`}>
                          Phoebus V2
                        </span>
                      </div>
                    )}
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pointer-events-none">
          <div className="max-w-[800px] mx-auto pointer-events-auto">
            <form 
              onSubmit={handleSendMessage}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FF41]/0 via-[#00FF41]/20 to-[#00FF41]/0 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative flex items-end gap-2 bg-[#141414] border border-white/10 rounded-2xl p-2 backdrop-blur-xl transition-colors focus-within:border-[#00FF41]/50 focus-within:bg-[#1a1a1a]">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Initiate sequence..."
                  className="w-full max-h-32 min-h-[44px] bg-transparent text-white placeholder:text-white/30 resize-none outline-none py-3 px-4 text-sm sm:text-base font-sans"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-3 rounded-xl bg-white/5 text-white/50 hover:text-[#00FF41] hover:bg-[#00FF41]/10 disabled:opacity-50 disabled:hover:text-white/50 disabled:hover:bg-white/5 transition-all mb-0.5 mr-0.5"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </form>
            <div className="text-center mt-3">
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                Phoebus V2 may produce inaccurate information.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
