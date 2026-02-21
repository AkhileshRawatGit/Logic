"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllQuizzes, toggleQuizStatus } from "@/actions/quiz";
import { deleteQuiz } from "@/actions/quiz";
import {
    PlusCircle,
    Trash2,
    Edit,
    ChevronLeft,
    Database,
    Clock,
    Shield,
    AlertTriangle,
    Loader2,
    Search,
    MoreVertical,
    Eye,
    Power,
    Trophy
} from "lucide-react";

interface Quiz {
    id: string;
    title: string;
    description: string | null;
    category: string;
    difficulty: string;
    isActive: boolean;
    createdAt: Date;
    _count: {
        questions: number;
    };
}

export default function AdminQuizListPage() {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; quizId: string | null; quizTitle: string }>({
        show: false,
        quizId: null,
        quizTitle: ""
    });
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Load quizzes on mount
    useEffect(() => {
        async function loadQuizzes() {
            try {
                const data = await getAllQuizzes();
                setQuizzes(data as unknown as Quiz[]);
            } catch (error) {
                console.error("Failed to load quizzes:", error);
            } finally {
                setLoading(false);
            }
        }
        loadQuizzes();
    }, []);

    const handleToggleStatus = async (quizId: string, currentStatus: boolean) => {
        try {
            await toggleQuizStatus(quizId, !currentStatus);
            setQuizzes(quizzes.map(q => q.id === quizId ? { ...q, isActive: !currentStatus } : q));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleDeleteClick = (quizId: string, quizTitle: string) => {
        setDeleteModal({ show: true, quizId, quizTitle });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.quizId) return;

        setDeleting(true);
        try {
            await deleteQuiz(deleteModal.quizId);
            setQuizzes(quizzes.filter(q => q.id !== deleteModal.quizId));
            setDeleteModal({ show: false, quizId: null, quizTitle: "" });
        } catch (error: any) {
            alert("Failed to delete quiz: " + (error.message || "Unknown error"));
        } finally {
            setDeleting(false);
        }
    };

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="space-y-1">
                    <Link href="/dashboard" className="text-primary flex items-center gap-2 text-sm hover:underline mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tighter text-glow flex items-center gap-3 lowercase">
                        mission command
                    </h1>
                    <p className="text-gray-400">Manage and deploy quiz missions.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <Link
                        href="/admin/leaderboard"
                        className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                    >
                        <Trophy className="w-5 h-5 text-primary" />
                        LIVE LEADERBOARD
                    </Link>
                    <Link
                        href="/admin/quiz/new"
                        className="flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_20px_#00f2ff] transition-all"
                    >
                        <PlusCircle className="w-5 h-5" />
                        NEW MISSION
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search missions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark-200 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Quiz List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredQuizzes.length === 0 ? (
                <div className="glass p-20 rounded-3xl border border-dashed border-white/10 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                        {searchTerm ? "No missions match your search" : "Sector Clear. No missions detected."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="glass p-6 rounded-3xl border border-white/10 hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10 text-gray-400 w-fit">
                                            {quiz.category}
                                        </span>
                                        <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                            {quiz.difficulty}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold tracking-tight">{quiz.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">{quiz.description || "No description"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-600">
                                        <span className="flex items-center gap-1.5">
                                            <Database className="w-3 h-3" /> {quiz._count.questions} Vectors
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" /> {new Date(quiz.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/quiz/${quiz.id}`}
                                            className="p-3 text-gray-400 hover:text-primary hover:bg-white/5 rounded-xl transition-all"
                                            title="View Quiz"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(quiz.id, quiz.isActive)}
                                            className={`p-3 rounded-xl transition-all ${quiz.isActive ? 'text-green-400 hover:bg-green-500/10' : 'text-gray-600 hover:bg-white/5'}`}
                                            title={quiz.isActive ? "Disable Mission" : "Enable Mission"}
                                        >
                                            <Power className="w-4 h-4" />
                                        </button>
                                        <Link
                                            href={`/admin/quiz/${quiz.id}/edit`}
                                            className="p-3 text-gray-400 hover:text-primary hover:bg-white/5 rounded-xl transition-all"
                                            title="Edit Quiz"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(quiz.id, quiz.title)}
                                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            title="Delete Quiz"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="glass p-8 rounded-3xl border border-red-500/30 max-w-md w-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Confirm Deletion</h3>
                                <p className="text-gray-400 text-sm">This action cannot be undone</p>
                            </div>
                        </div>

                        <p className="text-gray-300 mb-8">
                            Are you sure you want to delete <span className="text-white font-bold">"{deleteModal.quizTitle}"</span>?
                            All questions and results associated with this quiz will also be deleted.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteModal({ show: false, quizId: null, quizTitle: "" })}
                                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {deleting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" /> DELETING...
                                    </span>
                                ) : (
                                    "DELETE MISSION"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
