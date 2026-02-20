"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/actions/auth";
import { Terminal, ArrowRight, Loader2, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const res = await register(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/login?message=Account created successfully");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dark-400">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] -z-10" />

            <div className="w-full max-w-md glass p-8 rounded-3xl border border-white/10 space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex w-16 h-16 bg-primary/20 rounded-2xl items-center justify-center mb-4 neon-border">
                        <Terminal className="text-primary w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Identity</h1>
                    <p className="text-gray-400 text-sm">Initialize your terminal access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                name="name"
                                type="text"
                                placeholder="Full Name"
                                required
                                className="w-full bg-dark-200 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-gray-500"
                            />
                        </div>

                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full bg-dark-200 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-gray-500"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Access Key (Password)"
                                required
                                className="w-full bg-dark-200 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-gray-500"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full py-4 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_#00f2ff] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Register Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm">
                    Already verified?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign In Here
                    </Link>
                </p>
            </div>
        </div>
    );
}
