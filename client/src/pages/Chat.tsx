import { useEffect, useRef } from "react";
import { useChatHistory, useSendMessage } from "@/hooks/use-chat";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp } from "lucide-react";

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
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
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
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 shadow-xl border border-border/50">
                <TrendingUp className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2 font-display">Market Intelligence AI</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Ask me about stock trends, market analysis, or financial concepts. I'm here to help you navigate the markets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full">
                {["Analysis of AAPL stock", "Explain P/E ratio", "Current market sentiment", "Tech sector outlook"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="p-4 text-left rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-secondary/50 hover:shadow-lg transition-all duration-200 text-sm font-medium"
                  >
                    "{suggestion}"
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
                <div className="flex w-full gap-4 p-4 md:p-6 bg-card/50">
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

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-10 pb-4 z-10">
          <ChatInput onSend={handleSend} isLoading={isSending} />
        </div>
      </main>
    </div>
  );
}
