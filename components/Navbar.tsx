"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LayoutDashboard, PlusCircle, User, Zap, Menu, X, ShieldCheck, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? "py-4" : "py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className={`relative flex items-center justify-between transition-all duration-500 rounded-[2rem] px-8 ${scrolled ? "bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl h-16" : "h-20"
                    }`}>

                    {/* Tech Scanner Line (Animated) */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan z-[-1]" />

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-5 group">
                        <div className="relative">
                            <div className="w-14 h-14 glass rounded-xl flex items-center justify-center p-2 border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_25px_rgba(0,242,255,0.2)] transition-all duration-500 overflow-hidden">
                                <img src="/acm-logo.png" alt="ACM" className="w-full h-full object-contain brightness-110 contrast-125" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-primary border-2 border-black rounded-full shadow-[0_0_8px_#00f2ff] animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-black tracking-[0.25em] uppercase leading-none text-white">Logic Quest</span>
                                <span className="text-[7px] text-primary/80 border border-primary/30 px-1 py-0.5 rounded-sm font-mono font-bold">R.01</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase">Intelligence Command Hub</span>
                                <div className="w-0.5 h-0.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {/* System Status (Tech Detail) */}
                        <div className="hidden lg:flex items-center gap-4 px-6 border-x border-white/5 h-10 font-mono">
                            <div className="flex flex-col items-end">
                                <span className="text-[7px] text-gray-600 uppercase tracking-widest leading-none font-bold">Protocol</span>
                                <span className="text-[9px] text-primary/80 uppercase tracking-[0.2em] mt-1 font-bold">Secured_Link</span>
                            </div>
                            <ShieldCheck className="w-3.5 h-3.5 text-primary opacity-30" />
                        </div>

                        <div className="flex items-center gap-8">
                            {session ? (
                                <>
                                    <div className="flex items-center gap-8 pr-8 border-r border-white/10">
                                        <Link
                                            href="/dashboard"
                                            className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 hover:text-white transition-all flex items-center gap-2 group/link"
                                        >
                                            <LayoutDashboard className="w-3.5 h-3.5 group-hover:text-primary transition-colors opacity-50" />
                                            Dashboard
                                        </Link>
                                        {session.user?.role === "ADMIN" && (
                                            <Link
                                                href="/admin/quiz/new"
                                                className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80 hover:text-white transition-all flex items-center gap-2 group/link"
                                            >
                                                <PlusCircle className="w-3.5 h-3.5 opacity-50" />
                                                Deployment
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none text-white/90">{session.user?.name}</span>
                                            <span className="text-[8px] text-primary/60 font-mono uppercase tracking-widest mt-1">ID: {session.user?.id?.slice(-6).toUpperCase()}</span>
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-10 h-10 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all text-red-500 group"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-6">
                                    <Link href="/login" className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all">
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="relative group px-8 py-2.5 overflow-hidden rounded-lg bg-white"
                                    >
                                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                        <span className="relative z-10 text-black text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-500">
                                            Register
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden w-12 h-12 flex items-center justify-center glass rounded-xl border border-white/10"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden absolute top-full left-6 right-6 mt-4 glass rounded-3xl border border-white/10 overflow-hidden z-50 shadow-2xl"
                    >
                        <div className="p-8 flex flex-col gap-6">
                            {session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-4 text-sm font-black uppercase tracking-widest p-4 rounded-2xl bg-white/5"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-5 h-5 text-primary" /> Dashboard
                                    </Link>
                                    {session.user?.role === "ADMIN" && (
                                        <Link
                                            href="/admin/quiz/new"
                                            className="flex items-center gap-4 text-sm font-black uppercase tracking-widest p-4 rounded-2xl bg-white/5 text-primary"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <PlusCircle className="w-5 h-5" /> Create Mission
                                        </Link>
                                    )}
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-widest">{session.user?.name}</span>
                                            <span className="text-[10px] text-gray-500 uppercase">{session.user?.role}</span>
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-center p-5 text-sm font-black uppercase tracking-widest border border-white/10 rounded-2xl"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-center p-5 text-sm font-black uppercase tracking-widest bg-white text-black rounded-2xl"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
