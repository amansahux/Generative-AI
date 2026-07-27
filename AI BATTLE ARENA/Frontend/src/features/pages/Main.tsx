import React, { useState } from "react";
import {
  Swords,
  PlusCircle,
  History,
  Cpu,
  Bookmark,
  Settings,
  HelpCircle,
  User,
  Search,
  Bell,
  Send,
  Sparkles,
  Bot,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Clock,
  Zap,
  Menu,
  X,
  RefreshCw,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "../hook/useChat.ts";

export interface JudgeResponse {
  solution_1_score: number;
  solution_2_score: number;
  solution_1_reasoning: string;
  solution_2_reasoning: string;
}

export interface BackendResult {
  prompt: string;
  solution_1: string;
  solution_2: string;
  retryCount?: number;
  isValid?: boolean;
  judge_response?: JudgeResponse;
  judgeRetryCount?: number;
  judgeSuccess?: boolean;
  loading?: string; // idle | solution_generated | validated | solution_retried | judged | judge_retried | completed | failed
}

export const Main: React.FC = () => {
  const { messages, loading: isApiLoading, error, sendMessage, clearMessages } = useChat();
  const [inputPrompt, setInputPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get the latest message (or AI result)
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const lastUserMessage = [...messages].reverse().find((m) => m.sender === "user");

  let resultData: BackendResult | null = null;
  if (lastMessage && lastMessage.sender === "ai" && lastMessage.content) {
    if (lastMessage.content.result) {
      resultData = lastMessage.content.result;
    } else if (typeof lastMessage.content === "object") {
      resultData = lastMessage.content as BackendResult;
    }
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isApiLoading) return;
    const promptToSend = inputPrompt;
    setInputPrompt("");
    sendMessage(promptToSend);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to determine winner
  const sol1Score = resultData?.judge_response?.solution_1_score ?? 0;
  const sol2Score = resultData?.judge_response?.solution_2_score ?? 0;
  let winner = "Tie";
  if (sol1Score > sol2Score) winner = "Solution 1 (Claude 3.5 Sonnet)";
  else if (sol2Score > sol1Score) winner = "Solution 2 (GPT-4o)";

  const avgScore = resultData?.judge_response
    ? ((sol1Score + sol2Score) / 2).toFixed(1)
    : null;

  return (
    <div className="flex h-screen w-full bg-[#0a0d14] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Luxury Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0e121e] border-r border-slate-800/60 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/60">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <div className="h-full w-full bg-[#0e121e] rounded-[10px] flex items-center justify-center">
                  <Swords className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wider text-slate-100 uppercase">
                  AMANOVA
                </h1>
                <p className="text-[10px] tracking-widest text-amber-400 font-semibold uppercase">
                  BATTLE AI
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={() => {
                clearMessages();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-md shadow-indigo-600/25 transition-all duration-200"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Arena Battle</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            <a
              href="#history"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm font-medium transition-colors"
            >
              <History className="h-4 w-4 text-indigo-400" />
              <span>Battle History</span>
            </a>
            <a
              href="#models"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm font-medium transition-colors"
            >
              <Cpu className="h-4 w-4 text-cyan-400" />
              <span>AI Models</span>
            </a>
            <a
              href="#library"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800/50 hover:text-white text-sm font-medium transition-colors"
            >
              <Bookmark className="h-4 w-4 text-emerald-400" />
              <span>Prompt Library</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/60 space-y-1">
          <a
            href="#settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 text-xs font-medium transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </a>
          <a
            href="#support"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 text-xs font-medium transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Support & Feedback</span>
          </a>

          {/* User Profile Card */}
          <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                AA
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate">Aman Sahu</p>
                <p className="text-[10px] text-slate-400 truncate">Pro Arena Tier</p>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0a0d14]">
        {/* Top Navigation */}
        <header className="h-16 border-b border-slate-800/60 px-4 lg:px-8 flex items-center justify-between bg-[#0e121e]/60 backdrop-blur-md shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800/60 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden sm:block w-64 md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search battles, prompts, models..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500" />
            </button>
            <div className="h-8 w-px bg-slate-800 mx-1" />
            <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
              <User className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-slate-300 hidden md:inline">
                Amanova Judge Engine v2.4
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3 text-red-400 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Prompt Header */}
          {lastUserMessage && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center space-x-1.5 text-indigo-400 font-semibold uppercase tracking-wider text-[11px]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Active Battle Prompt</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{new Date(lastUserMessage.timestamp).toLocaleTimeString()}</span>
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-medium text-slate-100 leading-snug">
                "{lastUserMessage.content}"
              </h2>
            </div>
          )}

          {/* AI Processing Status / Stepper */}
          {isApiLoading && (
            <div className="bg-slate-900/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5 animate-pulse" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      Amanova Battle Engine Processing...
                    </h3>
                    <p className="text-xs text-slate-400">
                      Generating Dual LLM Solutions & Running Autonomous AI Judge
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Evaluating Graph Pipeline</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State when no messages */}
          {!lastUserMessage && !isApiLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center max-w-xl mx-auto space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-cyan-500/20 border border-slate-800 flex items-center justify-center">
                <Swords className="h-8 w-8 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">
                Welcome to Amanova Battle AI
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enter any complex prompt below to execute a side-by-side battle between top-tier AI models. Our intelligent judge will benchmark their answers and recommend the superior solution.
              </p>
            </div>
          )}

          {/* Judge Recommendation Hero Card */}
          {resultData?.judge_response && (
            <div className="bg-gradient-to-br from-[#121829] to-[#0d1222] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Top Banner Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                      JUDGE RECOMMENDATION
                    </span>
                    <h3 className="text-base font-semibold text-slate-100">
                      Winner: {winner}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {avgScore && (
                    <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2">
                      <span className="text-xs text-slate-400">Avg Arena Score</span>
                      <span className="text-sm font-bold text-amber-400">{avgScore} / 10</span>
                    </div>
                  )}
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Judged & Validated</span>
                  </span>
                </div>
              </div>

              {/* Reasoning Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-400">
                      Solution 1 Analysis
                    </span>
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                      Score: {resultData.judge_response.solution_1_score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {resultData.judge_response.solution_1_reasoning}
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-400">
                      Solution 2 Analysis
                    </span>
                    <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
                      Score: {resultData.judge_response.solution_2_score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {resultData.judge_response.solution_2_reasoning}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Solution Cards Side-by-Side */}
          {resultData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Solution 1 Card */}
              <div className="bg-[#0e121e] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg hover:border-slate-700 transition-colors">
                <div className="px-5 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Bot className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-slate-200">
                      Solution 1
                    </span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                      Claude 3.5 Sonnet
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(resultData?.solution_1 || "", "sol1")}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-800/60 transition-colors"
                  >
                    {copiedId === "sol1" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 flex-1 max-h-[500px] overflow-y-auto text-xs text-slate-300 space-y-3 font-normal leading-relaxed prose prose-invert max-w-none">
                  <ReactMarkdown>{resultData.solution_1}</ReactMarkdown>
                </div>

                <div className="px-5 py-3 bg-slate-900/30 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>Token Count: ~480</span>
                  </span>
                  <span>Response Time: 1.2s</span>
                </div>
              </div>

              {/* Solution 2 Card */}
              <div className="bg-[#0e121e] border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg hover:border-slate-700 transition-colors">
                <div className="px-5 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Bot className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-slate-200">
                      Solution 2
                    </span>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full font-medium">
                      GPT-4o
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(resultData?.solution_2 || "", "sol2")}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-md bg-slate-800/60 transition-colors"
                  >
                    {copiedId === "sol2" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 flex-1 max-h-[500px] overflow-y-auto text-xs text-slate-300 space-y-3 font-normal leading-relaxed prose prose-invert max-w-none">
                  <ReactMarkdown>{resultData.solution_2}</ReactMarkdown>
                </div>

                <div className="px-5 py-3 bg-slate-900/30 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>Token Count: ~520</span>
                  </span>
                  <span>Response Time: 1.4s</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Chat Input Bar */}
        <footer className="p-4 lg:p-6 border-t border-slate-800/60 bg-[#0e121e]/80 backdrop-blur-md shrink-0">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask anything to battle dual AI models..."
              disabled={isApiLoading}
              className="w-full pl-5 pr-14 py-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors shadow-inner disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isApiLoading || !inputPrompt.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
            >
              {isApiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};
