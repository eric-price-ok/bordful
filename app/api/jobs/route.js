import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        // Get query parameters from the URL
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') || '50'
        const search = searchParams.get('search')

        // Build the query
        let whereClause = {
            approved: true,
            jobStatusId: 1
        }

        // Add search filter if provided
        if (search) {
            whereClause.OR = [
                { jobTitle: { contains: search, mode: 'insensitive' } },
                { jobDescription: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Fetch jobs with company information
        const jobs = await prisma.joblistings.findMany({
            where: whereClause,
            include: {
                company: {
                    select: {
                        commonName: true,
                        website: true
                    }
                }
            },
            orderBy: {
                datePosted: 'desc'
            },
            take: parseInt(limit)
        })

        // Transform the data
        const transformedJobs = jobs.map(job => ({
            id: job.id,
            title: job.jobTitle,
            company: job.company.commonName,
            description: job.jobDescription,
            url: job.postingUrl,
            date: job.datePosted,
            salary: job.minimumSalary ? `$${job.minimumSalary}` : null,
            website: job.company.website
        }))

        return NextResponse.json({
            jobs: transformedJobs,
            total: transformedJobs.length
        })

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch jobs', details: error.message },
            { status: 500 }
        )
    }
}