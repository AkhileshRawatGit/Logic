import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getQuizzes, getUserResults, getAllResults } from "@/actions/quiz";
import Link from "next/link";
import { Zap, Clock, Trophy, Target, ArrowRight, BookOpen, PlusCircle, LayoutDashboard, Database, Activity, User, Shield } from "lucide-react";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    const isAdmin = session.user?.role === "ADMIN";

    const [quizzes, results, allResultsData] = await Promise.all([
        getQuizzes(),
        getUserResults(),
        isAdmin ? getAllResults() : Promise.resolve([]),
    ]);

    const allResults = allResultsData as any[];

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
            <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative space-y-20">

                {/* Profile / Stats Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div className="space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.5em] text-primary">Intelligence Command</h2>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase whitespace-nowrap">
                            WELCOME, {session?.user?.name ? session.user.name.split(' ')[0] : 'AGENT'}
                        </h1>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Main Missions Area */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="flex items-center justify-between border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <h3 className="text-sm font-black uppercase tracking-[0.3em]">Active Missions</h3>
                            </div>
                            {session.user?.role === "ADMIN" && (
                                <Link
                                    href="/admin/quiz"
                                    className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-primary transition-all flex items-center gap-2"
                                >
                                    <LayoutDashboard className="w-3.5 h-3.5" /> Manage Missions
                                </Link>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                            {quizzes.length > 0 ? (
                                quizzes.map((quiz: any) => (
                                    <Link
                                        key={quiz.id}
                                        href={`/quiz/${quiz.id}`}
                                        className="bg-background group p-10 space-y-8 hover:bg-white/[0.02] transition-colors relative"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10 text-gray-400">
                                                    {quiz.category}
                                                </span>
                                                <div className="text-xs font-mono text-gray-600 uppercase tracking-widest">
                                                    {quiz.difficulty} Level
                                                </div>
                                            </div>
                                            <h4 className="text-3xl font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
                                                {quiz.title}
                                            </h4>
                                            <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">
                                                {quiz.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-6">
                                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-600">
                                                <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> {quiz._count.questions} Vectors</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 15m</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:text-primary transition-all group-hover:translate-x-1">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="md:col-span-2 p-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Zap className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Sector Clear. No missions detected.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Results Log */}
                    <div className="lg:col-span-4 space-y-12">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-primary shadow-[0_0_5px_#00f2ff]' : 'bg-secondary'}`} />
                            <h3 className="text-sm font-black uppercase tracking-[0.3em]">
                                {isAdmin ? 'ADMIN COMMAND: ALL SCORES' : 'MISSION STATUS'}
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {isAdmin ? (
                                allResultsData.length > 0 ? (
                                    (allResultsData as any[]).map((result) => (
                                        <div key={result.id} className="glass p-6 rounded-3xl border border-white/10 hover:border-primary/30 transition-all flex flex-col gap-3 group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black uppercase tracking-widest leading-none">{result.user?.name || 'Anonymous'}</span>
                                                        <span className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">{result.user?.email || 'No Email'}</span>
                                                    </div>
                                                </div>
                                                <div className={`text-lg font-black ${result.status === 'PASS' ? 'text-primary' : 'text-red-500'}`}>
                                                    {result.percentage.toFixed(0)}%
                                                </div>
                                            </div>
                                            <div className="h-px bg-white/5 w-full" />
                                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                                <span>MISSION: {result.quiz?.title || 'Unknown Quiz'}</span>
                                                <div className="flex items-center gap-4">
                                                    {typeof result.timeTaken === 'number' && (
                                                        <span className="flex items-center gap-1"><Clock className="w-2 h-2" /> {Math.floor(result.timeTaken / 60)}:{String(result.timeTaken % 60).padStart(2, '0')}</span>
                                                    )}
                                                    <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="glass p-12 rounded-3xl border border-dashed border-white/10 text-center">
                                        <p className="text-gray-600 text-xs font-black uppercase tracking-widest text-glow">No Data Transmitted Yet</p>
                                    </div>
                                )
                            ) : (
                                <div className="glass p-12 rounded-3xl border border-dashed border-white/10 text-center space-y-6">
                                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto border border-secondary/20">
                                        <Shield className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-white font-bold uppercase tracking-widest text-sm">Encrypted Phase</p>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest leading-relaxed">
                                            Your results are being secured. Participants cannot view logs during this phase.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
