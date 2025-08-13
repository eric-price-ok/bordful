const { PrismaClient } = require('./lib/generated/prisma')

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Testing database connection...')

        // Test basic connection
        await prisma.$connect()
        console.log('✅ Connected to database!')

        // Count records
        const companyCount = await prisma.company.count()
        const jobCount = await prisma.joblistings.count()

        console.log(`📊 Found ${companyCount} companies`)
        console.log(`📊 Found ${jobCount} job listings`)

        // Test a simple query
        const activeJobs = await prisma.joblistings.count({
            where: {
                job_status_id: 1,
                approved: true
            }
        })

        console.log(`✅ Found ${activeJobs} active jobs`)

        // Show sample job
        const sampleJob = await prisma.joblistings.findFirst({
            where: {
                job_status_id: 1,
                approved: true
            },
            include: {
                company: true
            }
        })

        if (sampleJob) {
            console.log(`📝 Sample job: "${sampleJob.job_title}" at ${sampleJob.company.common_name}`)
        }

        console.log('🎉 Database test successful!')

    } catch (error) {
        console.error('❌ Database test failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()