"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getQuizzes() {
    try {
        return await prisma.quiz.findMany({
            where: { isActive: true } as any,
            include: {
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("GET_QUIZZES_ERROR:", error);
        return [];
    }
}

export async function getAllQuizzes() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        return await prisma.quiz.findMany({
            include: {
                _count: {
                    select: { questions: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("GET_ALL_QUIZZES_ERROR:", error);
        return [];
    }
}

export async function getQuizById(id: string) {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    return await prisma.quiz.findUnique({
        where: { id },
        include: {
            questions: {
                include: {
                    options: isAdmin ? true : {
                        select: {
                            id: true,
                            text: true,
                        }
                    }
                }
            }
        }
    });
}

export async function submitQuiz(quizId: string, answers: Record<string, string>, timeTaken?: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("Authentication required to submit quiz");

    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    if (!quiz) throw new Error("Target quiz not found");
    if (!(quiz as any).isActive) throw new Error("This mission is currently disabled by HQ");
    if (quiz.questions.length === 0) throw new Error("This quiz has no questions and cannot be submitted");

    let score = 0;
    const total = quiz.questions.length;

    quiz.questions.forEach((question: any) => {
        const selectedOptionId = answers[question.id];
        const correctOption = question.options.find((opt: any) => opt.isCorrect);

        if (selectedOptionId === correctOption?.id) {
            score++;
        }
    });

    const percentage = (score / total) * 100;
    const status = percentage >= 60 ? "PASS" : "FAIL";

    const result = await prisma.result.create({
        data: {
            userId: session.user.id,
            quizId,
            score,
            total,
            percentage,
            status,
            timeTaken: typeof timeTaken === 'number' ? timeTaken : null,
        }
    });

    revalidatePath("/dashboard");
    return result;
}

export async function getUserResults() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return [];

        return await prisma.result.findMany({
            where: { userId: session.user.id },
            include: {
                quiz: {
                    select: { title: true, category: true }
                }
            },
            orderBy: [
                { createdAt: "desc" }
            ]
        });
    } catch (error) {
        console.error("GET_USER_RESULTS_ERROR:", error);
        return [];
    }
}

export async function getAllResults() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            throw new Error("Unauthorized: Admin access required");
        }

        return await prisma.result.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                },
                quiz: {
                    select: { title: true }
                }
            },
            orderBy: [
                { score: "desc" },
                { timeTaken: "asc" },
                { createdAt: "desc" }
            ]
        });
    } catch (error) {
        console.error("GET_ALL_RESULTS_ERROR:", error);
        return [];
    }
}

export async function createQuiz(data: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    questions: {
        text: string;
        code?: string | null;
        options: { text: string; isCorrect: boolean }[];
    }[];
}) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    if (!data.title || data.questions.length === 0) {
        throw new Error("Invalid quiz data: Title and at least one question are required");
    }

    try {
        console.log("Deploying new mission payload...");

        const quiz = await prisma.quiz.create({
            data: {
                title: data.title,
                description: data.description || null,
                category: data.category,
                difficulty: data.difficulty,
                questions: {
                    create: data.questions.map((q: any) => ({
                        text: q.text,
                        code: q.code || null,
                        options: {
                            create: q.options.map((o: any) => ({
                                text: o.text,
                                isCorrect: o.isCorrect,
                            })),
                        },
                    })),
                },
            },
        });

        console.log("Mission deployed successfully:", quiz.id);
        revalidatePath("/dashboard");
        return quiz;
    } catch (error: any) {
        console.error("CRITICAL ERROR IN CREATE_QUIZ:", error);
        throw new Error(error.message || "Failed to deploy mission to database");
    }
}

export async function deleteQuiz(quizId: string) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    try {
        // Delete the quiz (cascade will delete questions and options)
        await prisma.quiz.delete({
            where: { id: quizId },
        });

        console.log("Quiz deleted successfully:", quizId);
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: any) {
        console.error("CRITICAL ERROR IN DELETE_QUIZ:", error);
        throw new Error(error.message || "Failed to delete quiz");
    }
}

export async function updateQuiz(quizId: string, data: {
    title: string;
    description: string;
    category: string;
    difficulty: string;
    questions: {
        id?: string;
        text: string;
        code?: string | null;
        options: { id?: string; text: string; isCorrect: boolean }[];
    }[];
}) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    if (!data.title || data.questions.length === 0) {
        throw new Error("Invalid quiz data: Title and at least one question are required");
    }

    try {
        console.log("Updating quiz:", quizId);

        // First get existing quiz with questions
        const existingQuiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        if (!existingQuiz) {
            throw new Error("Quiz not found");
        }

        // Separate questions into existing and new
        const existingQuestionIds = new Set(existingQuiz.questions.map(q => q.id));
        const updatedQuestionIds = new Set(data.questions.filter(q => q.id).map(q => q.id));

        // Questions to delete (exist in DB but not in updated data)
        const questionsToDelete = existingQuiz.questions
            .filter(q => !updatedQuestionIds.has(q.id))
            .map(q => q.id);

        // Delete questions that are not in the updated data
        if (questionsToDelete.length > 0) {
            await prisma.question.deleteMany({
                where: {
                    id: { in: questionsToDelete }
                }
            });
        }

        // Update or create questions
        for (const questionData of data.questions) {
            if (questionData.id && existingQuestionIds.has(questionData.id)) {
                // Update existing question
                const existingQuestion = existingQuiz.questions.find(q => q.id === questionData.id);

                await prisma.question.update({
                    where: { id: questionData.id },
                    data: {
                        text: questionData.text,
                        code: questionData.code || null,
                    }
                });

                // Update options for this question
                const existingOptionIds = new Set(existingQuestion?.options.map(o => o.id) || []);
                const updatedOptionIds = new Set(questionData.options.filter(o => o.id).map(o => o.id));

                // Delete options not in updated data
                const optionsToDelete = [...existingOptionIds].filter(id => !updatedOptionIds.has(id));
                if (optionsToDelete.length > 0) {
                    await prisma.option.deleteMany({
                        where: { id: { in: optionsToDelete } }
                    });
                }

                // Update or create options
                for (const optionData of questionData.options) {
                    if (optionData.id && existingOptionIds.has(optionData.id)) {
                        // Update existing option
                        await prisma.option.update({
                            where: { id: optionData.id },
                            data: {
                                text: optionData.text,
                                isCorrect: optionData.isCorrect,
                            }
                        });
                    } else {
                        // Create new option
                        await prisma.option.create({
                            data: {
                                questionId: questionData.id,
                                text: optionData.text,
                                isCorrect: optionData.isCorrect,
                            }
                        });
                    }
                }
            } else {
                // Create new question
                const newQuestion = await prisma.question.create({
                    data: {
                        quizId: quizId,
                        text: questionData.text,
                        code: questionData.code || null,
                        options: {
                            create: questionData.options.map((o: any) => ({
                                text: o.text,
                                isCorrect: o.isCorrect,
                            })),
                        },
                    }
                });
            }
        }

        // Update quiz metadata
        await prisma.quiz.update({
            where: { id: quizId },
            data: {
                title: data.title,
                description: data.description || null,
                category: data.category,
                difficulty: data.difficulty,
            }
        });

        console.log("Quiz updated successfully:", quizId);
        revalidatePath("/dashboard");
        revalidatePath(`/quiz/${quizId}`);
        return { success: true };
    } catch (error: any) {
        console.error("CRITICAL ERROR IN UPDATE_QUIZ:", error);
        throw new Error(error.message || "Failed to update quiz");
    }
}

export async function toggleQuizStatus(quizId: string, isActive: boolean) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    try {
        await prisma.quiz.update({
            where: { id: quizId },
            data: { isActive } as any,
        });

        revalidatePath("/dashboard");
        revalidatePath("/admin/quiz");
        return { success: true };
    } catch (error: any) {
        throw new Error("Failed to update status");
    }
}
