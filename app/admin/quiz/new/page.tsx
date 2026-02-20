"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuiz } from "@/actions/quiz";
import {
    Plus,
    Trash2,
    Save,
    ChevronLeft,
    PlusCircle,
    CheckCircle2,
    Zap,
    Loader2,
    Code2
} from "lucide-react";
import Link from "next/link";

export default function NewQuizPage() {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Security");
    const [difficulty, setDifficulty] = useState("Medium");
    const [questions, setQuestions] = useState([
        {
            text: "",
            code: "",
            showCode: false,
            options: [
                { text: "", isCorrect: true },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
                { text: "", isCorrect: false },
            ],
        },
    ]);

    const router = useRouter();

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: "",
                code: "",
                showCode: false,
                options: [
                    { text: "", isCorrect: true },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                    { text: "", isCorrect: false },
                ],
            },
        ]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const updateQuestionText = (index: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    const updateQuestionCode = (index: number, code: string) => {
        const newQuestions = [...questions];
        newQuestions[index].code = code;
        setQuestions(newQuestions);
    };

    const toggleCode = (index: number) => {
        const newQuestions = [...questions];
        newQuestions[index].showCode = !newQuestions[index].showCode;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = text;
        setQuestions(newQuestions);
    };

    const setCorrectOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options = newQuestions[qIndex].options.map((opt, i) => ({
            ...opt,
            isCorrect: i === oIndex,
        }));
        setQuestions(newQuestions);
    };

    const handleSave = async () => {
        if (!title || questions.some(q => !q.text || q.options.some(o => !o.text))) {
            alert("Please fill in all fields (Title, Question Text, and Options)");
            return;
        }

        setLoading(true);
        try {
            await createQuiz({
                title,
                description,
                category,
                difficulty,
                questions: questions.map(q => ({
                    text: q.text,
                    code: q.showCode ? q.code : null,
                    options: q.options
                })),
            });
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            alert("Failed to create quiz: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <Link href="/dashboard" className="text-primary flex items-center gap-2 text-sm hover:underline mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tighter text-glow flex items-center gap-3 lowercase">
                        new mission deployment
                    </h1>
                    <p className="text-gray-400">Configure parameters and question database.</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_#00f2ff] transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    DEPLOY MISSION
                </button>
            </div>

            <div className="space-y-12">
                {/* Mission Config */}
                <div className="glass p-8 rounded-3xl border border-white/10 grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. React Mastery"
                            className="w-full bg-dark-200 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Category</label>
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Programming"
                            className="w-full bg-dark-200 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full bg-dark-200 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all appearance-none"
                        >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>

                {/* Questions Area */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                            Question Database ({questions.length})
                        </h2>
                        <button
                            onClick={addQuestion}
                            className="flex items-center gap-2 px-6 py-3 bg-secondary/20 border border-secondary/50 text-secondary rounded-xl text-sm font-bold hover:bg-secondary/30 transition-all"
                        >
                            <PlusCircle className="w-4 h-4" /> Add Question
                        </button>
                    </div>

                    <div className="space-y-12">
                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="glass rounded-3xl border border-white/10 overflow-hidden">
                                {/* Header */}
                                <div className="bg-white/5 px-8 py-4 border-b border-white/10 flex items-center justify-between">
                                    <span className="text-xs font-bold font-mono text-gray-500 uppercase tracking-[0.2em]">Vector #{qIndex + 1}</span>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleCode(qIndex)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${question.showCode ? "bg-primary text-black" : "bg-white/5 text-gray-400 border border-white/10"
                                                }`}
                                        >
                                            <Code2 className="w-3.5 h-3.5" />
                                            {question.showCode ? "Include Code" : "Add Code"}
                                        </button>
                                        <button
                                            onClick={() => removeQuestion(qIndex)}
                                            className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-8 space-y-8">
                                    {/* Prompt */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-gray-500 uppercase font-bold">Question Text</label>
                                            <input
                                                value={question.text}
                                                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                                placeholder="What is the output of the following code?"
                                                className="w-full bg-dark-200 border border-white/10 rounded-xl p-4 focus:border-primary outline-none transition-all text-lg font-medium"
                                            />
                                        </div>

                                        {question.showCode && (
                                            <div className="space-y-2">
                                                <label className="text-xs text-gray-500 uppercase font-bold">Code Snippet (Optional)</label>
                                                <div className="relative group/code">
                                                    {/* Mac Header */}
                                                    <div className="h-10 bg-[#1e1e1e] border-x border-t border-white/10 rounded-t-2xl flex items-center px-4 gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                                        <div className="ml-4 text-[10px] text-gray-500 font-mono">mission_payload.bash</div>
                                                    </div>
                                                    <textarea
                                                        value={question.code || ""}
                                                        onChange={(e) => updateQuestionCode(qIndex, e.target.value)}
                                                        placeholder="const logic = async () => { ... };"
                                                        className="w-full bg-[#1e1e1e] border-x border-b border-white/10 rounded-b-2xl p-6 font-mono text-sm focus:border-primary/50 outline-none transition-all h-60 resize-none text-primary/80 selection:bg-primary/20"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Options */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="relative group/opt text-left">
                                                <div
                                                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer z-10 ${option.isCorrect ? "bg-primary border-primary text-black" : "border-white/20 text-gray-500 hover:border-white/50"
                                                        }`}
                                                    onClick={() => setCorrectOption(qIndex, oIndex)}
                                                >
                                                    {option.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs">{String.fromCharCode(65 + oIndex)}</span>}
                                                </div>
                                                <input
                                                    value={option.text}
                                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                    className={`w-full bg-dark-200 border rounded-2xl py-4 pl-16 pr-4 outline-none transition-all ${option.isCorrect ? "border-primary/50 bg-primary/5" : "border-white/10 focus:border-white/30"
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
