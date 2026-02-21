
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking for orphaned results...')
    const results = await prisma.result.findMany({
        select: {
            id: true,
            quizId: true
        }
    })

    console.log(`Found ${results.length} results. Checking relations...`)

    let orphanedCount = 0
    for (const result of results) {
        const quiz = await prisma.quiz.findUnique({
            where: { id: result.quizId }
        })

        if (!quiz) {
            console.log(`Orphaned result found: ${result.id} (quizId: ${result.quizId})`)
            await prisma.result.delete({
                where: { id: result.id }
            })
            orphanedCount++
        }
    }

    console.log(`Cleanup complete. Deleted ${orphanedCount} orphaned results.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
