"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Terminal, ArrowRight, Loader2, Mail, Lock } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get("message");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid access credentials");
            setLoading(false);
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-dark-400">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/10 blur-[100px] -z-10" />

            <div className="w-full max-w-md glass p-8 rounded-3xl border border-white/10 space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex w-16 h-16 bg-secondary/20 rounded-2xl items-center justify-center mb-4 border border-secondary/50 shadow-[0_0_15px_#7000ff]">
                        <Terminal className="text-secondary w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Access Terminal</h1>
                    <p className="text-gray-400 text-sm">Enter your credentials to proceed</p>
                </div>

                {message && (
                    <div className="p-4 bg-primary/10 border border-primary/50 rounded-xl text-primary text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full bg-dark-200 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all placeholder:text-gray-500"
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                            <input
                                name="password"
                                type="password"
                                placeholder="Access Key"
                                required
                                className="w-full bg-dark-200 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all placeholder:text-gray-500"
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
                        className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:shadow-[0_0_20px_#7000ff] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Initiate Link <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-sm">
                    No identity found?{" "}
                    <Link href="/register" className="text-secondary hover:underline font-medium">
                        Create Protocol
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-dark-400" />}>
            <LoginForm />
        </Suspense>
    );
}
