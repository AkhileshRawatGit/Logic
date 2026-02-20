"use client";

import { useState, useEffect, use } from "react";
import { getQuizById, submitQuiz } from "@/actions/quiz";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, Timer, Zap, Cpu, Terminal as TerminalIcon, ShieldCheck, AlertCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes in seconds
    const router = useRouter();

    useEffect(() => {
        async function loadQuiz() {
            const data = await getQuizById(id);
            if (!data) router.push("/dashboard");
            setQuiz(data);
            setLoading(false);
        }
        loadQuiz();
    }, [id, router]);

    // Timer Logic
    useEffect(() => {
        if (showInstructions || loading || showSuccess) return;

        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, showInstructions, loading, showSuccess]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="text-center space-y-8 relative">
                <div className="relative">
                    <div className="w-20 h-20 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                    <Cpu className="absolute inset-center w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                    <p className="text-primary font-black text-sm tracking-[0.4em] uppercase">Initializing Neural Link</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-mono">Decrypting payload assets...</p>
                </div>
            </div>
        </div>
    );

    async function handleOptionSelect(optionId: string) {
        setAnswers({ ...answers, [quiz.questions[currentQuestion].id]: optionId });
    }

    async function handleSubmit() {
        if (submitting) return;
        setSubmitting(true);
        try {
            const timeTaken = 2700 - timeLeft;
            await submitQuiz(quiz.id, answers, timeTaken);
            setShowSuccess(true);
            // Auto redirect after 5 seconds
            setTimeout(() => {
                router.push("/");
            }, 5000);
        } catch (error) {
            console.error(error);
            setSubmitting(false);
        }
    }

    // Success View
    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-6">
                <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full glass p-12 rounded-[2.5rem] border border-primary/20 text-center space-y-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />

                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20 relative">
                        <Rocket className="w-10 h-10 text-primary animate-bounce" />
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-sm font-black text-primary uppercase tracking-[0.5em]">Transmission Successful</h2>
                        <h1 className="text-4xl font-bold tracking-tighter uppercase leading-tight">MISSION ACCOMPLISHED</h1>
                        <p className="text-gray-400 text-sm font-light leading-relaxed">
                            Your neural data has been encrypted and stored on the secure ACM mainframe.
                            The connection will terminate automatically.
                        </p>
                    </div>

                    <div className="pt-8 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            Redirecting to HQ in <span className="text-white">REMAINING SECTOR</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                className="h-full bg-primary"
                            />
                        </div>
                        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/30 pb-1 hover:text-white transition-colors">
                            Manual Extraction Hub
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Instructions View
    if (showInstructions) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
                <div className="fixed inset-0 grid-bg opacity-5 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full glass p-8 md:p-12 rounded-3xl border border-white/5 space-y-8"
                >
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
                        <p className="text-gray-400 text-sm">Please read the instructions carefully before starting the quiz.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-white">Time Limit</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">The quiz has a strict 45-minute limit. It will auto-submit when the timer reaches zero.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-white">Navigation</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">You can navigate between questions freely using the buttons at the bottom.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-white">Integrity</h4>
                                    <p className="text-xs text-gray-500 leading-relaxed">Do not refresh your browser during the test as it may lead to data loss.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="px-10 py-4 bg-primary text-black font-bold text-sm uppercase tracking-[0.2em] rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all active:scale-95"
                            >
                                Start Quiz
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === quiz.questions.length - 1;

    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6 relative overflow-hidden">
            <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
            <div className="max-w-4xl mx-auto relative">

                {/* Top bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{quiz.title}</h2>
                        <div className="text-3xl font-bold tracking-tighter">
                            VECTOR <span className="text-primary">{String(currentQuestion + 1).padStart(2, '0')}</span>
                            <span className="text-white/20"> / {String(quiz.questions.length).padStart(2, '0')}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`px-6 py-3 glass rounded-full border border-white/10 flex items-center gap-3 transition-colors ${timeLeft < 300 ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                            <Timer className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                            <span className={`font-mono font-bold text-sm tracking-widest ${timeLeft < 300 ? 'text-red-500' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Global Progress */}
                <div className="h-px w-full bg-white/10 mb-16 relative overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                        className="absolute left-0 top-0 h-full bg-primary shadow-[0_0_15px_#00f2ff]"
                    />
                </div>

                {/* Question Container */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-12"
                    >
                        <div className="space-y-8">
                            <h3 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight">
                                {question.text}
                            </h3>

                            {question.code && (
                                <div className="relative group overflow-hidden">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-secondary/10 blur opacity-50 transition duration-1000 group-hover:opacity-100" />
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                        {/* Mac Header */}
                                        <div className="h-10 bg-[#1e1e1e] border-x border-t border-white/10 flex items-center px-4 gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                            <div className="ml-4 text-[10px] text-gray-400 font-mono tracking-widest opacity-50 uppercase">source_module.sys</div>
                                        </div>
                                        <div className="bg-[#1e1e1e] border-x border-b border-white/10 p-8 pt-4">
                                            <pre className="font-mono text-sm leading-relaxed text-primary/90 overflow-x-auto whitespace-pre-wrap selection:bg-primary/20">
                                                <code>{question.code}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Options Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {question.options.map((option: any, idx: number) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    className={`group relative flex items-center justify-between p-8 rounded-2xl border transition-all text-left overflow-hidden ${answers[question.id] === option.id
                                        ? "bg-white text-black border-white"
                                        : "bg-white/[0.03] border-white/5 hover:border-white/20 active:scale-95"
                                        }`}
                                >
                                    <div className="space-y-1">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${answers[question.id] === option.id ? "text-black/40" : "text-white/20"}`}>
                                            Option {String.fromCharCode(65 + idx)}
                                        </span>
                                        <div className="text-lg font-bold">
                                            {option.text}
                                        </div>
                                    </div>
                                    {answers[question.id] === option.id && (
                                        <div className="p-2 bg-black rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-20 pt-8 border-t border-white/5">
                    <button
                        onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all disabled:opacity-0"
                    >
                        <ArrowLeft className="w-4 h-4" /> REVERSE PHASE
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !answers[question.id]}
                            className="px-10 py-5 bg-primary text-black font-black text-sm uppercase tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>Transmitting <Loader2 className="w-5 h-5 animate-spin" /></>
                            ) : (
                                <>Finalize Mission <Zap className="w-5 h-5" /></>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(prev => prev + 1)}
                            disabled={!answers[question.id]}
                            className="flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full hover:bg-primary transition-all disabled:opacity-50 group hover:scale-105 active:scale-95"
                        >
                            Advance Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
