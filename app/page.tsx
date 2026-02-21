"use client";

import Link from "next/link";
import { MoveRight, Zap, Target, Trophy, Cpu, Code, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    return (
        <div ref={containerRef} className="relative bg-background selection:bg-primary selection:text-black">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent_50%)] pointer-events-none" />

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[100vw] h-[600px] bg-primary/10 blur-[150px] mask-radial -z-10" />

                <div className="max-w-7xl mx-auto w-full space-y-12 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center text-center space-y-8"
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-32 h-32 mb-8 relative group"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-all duration-700" />
                            <img src="/acm-logo.png" alt="ACM Logo" className="w-full h-full object-contain relative z-10 brightness-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110 group-hover:scale-125 transition-transform duration-700" />
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-white/10 text-xs uppercase font-bold tracking-[0.3em] text-primary"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Round 01: The Initiation
                        </motion.div>

                        <div className="relative">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-6xl md:text-[10rem] font-bold tracking-tighter leading-[0.85] uppercase"
                            >
                                LOGIC<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">QUEST</span>
                            </motion.h1>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                className="absolute -bottom-4 left-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                            className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-light"
                        >
                            Welcome to Round 1 of Logic Quest, officially conducted by ACM.
                            Step into the digital arena where your analytical skills meet high-stakes
                            quiz challenges. Master the logic, outpace the clock, and prove your
                            computational dominance to qualify for the next evolution.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 w-full md:w-auto"
                        >
                            <Link
                                href="/dashboard"
                                className="group relative px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 w-full md:w-auto text-center"
                            >
                                <div className="absolute inset-x-0 bottom-0 h-0 bg-primary group-hover:h-full transition-all duration-300 -z-10" />
                                <span className="flex items-center justify-center gap-3">
                                    System Initialize <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </Link>

                            <Link
                                href="/register"
                                className="group px-10 py-5 glass border border-white/20 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-white/10 transition-all w-full md:w-auto text-center"
                            >
                                Create Identity
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Abstract Entities */}
                <motion.div
                    style={{ y }}
                    className="absolute right-[10%] top-1/4 w-32 h-32 border border-primary/20 rounded-full animate-float hidden lg:block"
                />
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
                    className="absolute left-[5%] bottom-1/4 w-48 h-48 border border-secondary/20 rounded-2xl rotate-45 animate-float hidden lg:block"
                />
            </section>

            {/* Featured Section - ACM Event Branding */}
            <section className="px-6 py-40 max-w-7xl mx-auto relative">
                <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-secondary">Advanced Computing Machinery</h2>
                        <h3 className="text-4xl md:text-6xl font-bold tracking-tight">ELEVATING TECHNICAL EXCELLENCE</h3>
                    </div>
                    <p className="text-gray-500 text-sm max-w-xs leading-relaxed uppercase tracking-widest">
                        A symposium of intelligence, speed, and precision. Join the network.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden glass">
                    {[
                        {
                            title: "Neural MCQ Engine",
                            desc: "Dynamic question routing with zero-latency response tracking.",
                            icon: Cpu,
                            color: "primary"
                        },
                        {
                            title: "Encrypted Auth",
                            desc: "Military-grade credential handling via NextAuth protocol.",
                            icon: ShieldCheck,
                            color: "secondary"
                        },
                        {
                            title: "Code Simulation",
                            desc: "Interactive code snippets rendered with zero-latency precision.",
                            icon: Code,
                            color: "accent"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-background p-12 space-y-8 hover:bg-white/[0.02] transition-colors relative group">
                            <div className={`w-14 h-14 rounded-full bg-${feature.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-2xl font-bold tracking-tight">{feature.title}</h4>
                                <p className="text-gray-400 font-light leading-relaxed">{feature.desc}</p>
                            </div>
                            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer / CTA */}
            <section className="px-6 py-40 text-center relative overflow-hidden">
                <div className="absolute inset-center w-[800px] h-[800px] bg-secondary/5 blur-[120px] rounded-full -z-10" />
                <h2 className="text-7xl md:text-[12rem] font-bold tracking-tighter opacity-10 uppercase select-none pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                    JOIN THE NETWORK
                </h2>
                <div className="relative space-y-12">
                    <h3 className="text-5xl md:text-7xl font-bold">READY FOR ROUND 01?</h3>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-4 text-2xl font-bold hover:text-primary transition-colors group"
                    >
                        START YOUR JOURNEY <div className="p-4 rounded-full border border-white/20 group-hover:border-primary transition-colors"><MoveRight className="w-6 h-6" /></div>
                    </Link>
                </div>
            </section>

            <footer className="px-6 py-12 border-t border-white/5 text-center">
                <p className="text-xs uppercase tracking-[0.5em] text-gray-600 font-bold">
                    © 2026 ACM CHAPTER - LOGIC QUEST DIVISION
                </p>
            </footer>
        </div>
    );
}
