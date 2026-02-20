"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getQuizzes() {
    return await prisma.quiz.findMany({
        include: {
            _count: {
                select: { questions: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
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
}

export async function getAllResults() {
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
