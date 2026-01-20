import { Sidebar } from "@/components/Sidebar";
import { Link } from "wouter";
import { ArrowLeft, Construction } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/10 border border-border">
            <Construction className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold font-display mb-4 text-white">
            Under Development
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            This feature is currently being built. We're working hard to bring you the best market analysis tools.
          </p>
          
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200">
            <ArrowLeft className="w-5 h-5" />
            Back to Chat
          </Link>
        </div>
      </main>
    </div>
  );
}
