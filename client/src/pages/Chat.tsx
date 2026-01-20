import { useEffect, useRef } from "react";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, Compass, Newspaper, Globe } from "lucide-react";

const SUGGESTIONS = [
  {
    text: "Analyze the Indian stock market with today's key signals",
    icon: TrendingUp,
  },
  {
    text: "Analyse Conditions of Large, Mid and Small Cap in Indian Market",
    icon: Compass,
  },
  {
    text: "Track major stock market events shaping investor sentiment",
    icon: Newspaper,
  },
  {
    text: "How global news connects with Indian market movements",
    icon: Globe,
  },
];

export default function Chat() {
  const { data: messages, isLoading: isLoadingHistory } = useChatHistory();
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = (message: string) => {
    sendMessage(message, {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error sending message",
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="flex h-screen bg-transparent text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full relative">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold font-display tracking-tight">StockAI</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {isLoadingHistory ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Loading market data...</p>
            </div>
          ) : messages?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-xl border border-primary/20">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-2 font-display">Market Intelligence AI</h2>
              <p className="text-muted-foreground max-w-md mb-12">
                Ask me about stock trends, market analysis, or financial concepts. I'm here to help you navigate the markets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.text}
                    onClick={() => handleSend(suggestion.text)}
                    className="p-6 text-left rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:bg-card/60 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-secondary/50 group-hover:bg-primary/20 transition-colors">
                        <suggestion.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium leading-relaxed">{suggestion.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pb-32 pt-4">
              {messages?.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {isSending && (
                <div className="flex w-full gap-4 p-4 md:p-6 bg-card/50 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground animate-pulse">
                      Analyzing market data...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent pt-20 pb-6 z-10 px-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={handleSend} isLoading={isSending} />
          </div>
        </div>
      </main>
    </div>
  );
}
