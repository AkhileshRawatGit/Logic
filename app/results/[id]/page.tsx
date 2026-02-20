import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Trophy, RefreshCcw, Home, CheckCircle2, XCircle, BarChart3, ArrowRight, Cpu, Target } from "lucide-react";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await prisma.result.findUnique({
        where: { id },
        include: {
            quiz: true,
        }
    });

    if (!result) redirect("/dashboard");

    const isPass = result.status === "PASS";

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
            <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className={`fixed inset-0 ${isPass ? 'bg-primary/5' : 'bg-red-500/5'} blur-[150px] mask-radial pointer-events-none`} />

            <div className="max-w-4xl mx-auto relative text-center space-y-20">
                {/* Status Header */}
                <div className="space-y-12">
                    <div className="relative inline-block">
                        <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${isPass ? 'border-primary shadow-[0_0_50px_rgba(0,242,255,0.3)]' : 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]'
                            }`}>
                            <Trophy className={`w-14 h-14 ${isPass ? 'text-primary' : 'text-red-500'}`} />
                        </div>
                        <div className={`absolute -top-4 -right-4 p-3 rounded-xl border ${isPass ? 'bg-primary border-primary text-black' : 'bg-red-500 border-red-500 text-white'}`}>
                            <Cpu className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className={`text-[12px] font-black uppercase tracking-[0.5em] ${isPass ? 'text-primary' : 'text-red-500'}`}>
                            Mission Analysis Complete
                        </h2>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                            {isPass ? 'SYNC SUCCESSFUL' : 'LINK SEVERED'}
                        </h1>
                    </div>
                </div>

                {/* Global Stats Grid */}
                <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-3xl overflow-hidden glass">
                    <div className="bg-background p-10 space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Neural Accuracy</div>
                        <div className={`text-5xl font-black tracking-tighter ${isPass ? 'text-primary' : 'text-red-400'}`}>
                            {result.percentage.toFixed(0)}%
                        </div>
                    </div>
                    <div className="bg-background p-10 space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Vectors Resolved</div>
                        <div className="text-5xl font-black tracking-tighter">
                            {result.score}<span className="text-xl text-white/20">/{result.total}</span>
                        </div>
                    </div>
                    <div className="bg-background p-10 space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Operation Status</div>
                        <div className={`text-5xl font-black tracking-tighter ${isPass ? 'text-primary' : 'text-red-400'}`}>
                            {result.status}
                        </div>
                    </div>
                </div>

                {/* Breakdown Card */}
                <div className="glass p-12 rounded-[40px] border border-white/10 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <BarChart3 className="w-40 h-40" />
                    </div>

                    <div className="space-y-12">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <h3 className="text-xs font-black uppercase tracking-widest">Efficiency Feedback</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase tracking-widest leading-none">Cognitive Throughput</span>
                                    <span className="text-[10px] font-mono text-primary uppercase">98% Efficient</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[98%] shadow-[0_0_10px_#00f2ff]" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold uppercase tracking-widest leading-none">Response Latency</span>
                                    <span className="text-[10px] font-mono text-secondary uppercase">Optimized</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary w-full shadow-[0_0_10px_#7000ff]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
                    <Link
                        href={`/quiz/${result.quizId}`}
                        className="group px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:bg-primary transition-all flex items-center gap-3 h-16 w-full md:w-auto justify-center"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                        RE-INITIALIZE
                    </Link>

                    <Link
                        href="/dashboard"
                        className="group px-10 py-5 glass border border-white/20 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-white/10 transition-all flex items-center gap-3 h-16 w-full md:w-auto justify-center"
                    >
                        <Home className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                        RETURN TO COMMAND
                    </Link>
                </div>
            </div>

            <footer className="mt-40 mb-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">
                    SECURE PROTOCOL TERMINATED // ACM LOGIC QUEST
                </p>
            </footer>
        </div>
    );
}
