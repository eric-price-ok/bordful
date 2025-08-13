import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(request) {
    try {
        // Get query parameters from the URL
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') || '50'
        const search = searchParams.get('search')
        const company = searchParams.get('company')
        const location = searchParams.get('location')

        // Build the query
        let whereClause = {
            approved: true,
            jobStatusId: 1  // Active jobs only
        }

        // Add search filter if provided
        if (search) {
            whereClause.OR = [
                { jobTitle: { contains: search, mode: 'insensitive' } },
                { jobDescription: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Add company filter if provided
        if (company) {
            whereClause.company = {
                commonName: { contains: company, mode: 'insensitive' }
            }
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
                },
                cities: {
                    select: {
                        cityName: true
                    }
                }
            },
            orderBy: {
                datePosted: 'desc'
            },
            take: parseInt(limit)
        })

        // Transform the data to match what the frontend expects
        const transformedJobs = jobs.map(job => ({
            id: job.id,
            title: job.jobTitle,
            company: job.company.commonName,
            location: job.cities?.cityName || 'Remote',
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
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}