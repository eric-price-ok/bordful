import { prisma } from '../../../lib/db/prisma.ts'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        // Get query parameters from the URL
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') || '50'
        const search = searchParams.get('search')

        // Build the query with correct field names
        let whereClause = {
            approved: true,
            job_status_id: 1  // Changed from jobStatusId to job_status_id
        }

        // Add search filter if provided
        if (search) {
            whereClause.OR = [
                { job_title: { contains: search, mode: 'insensitive' } },  // Changed from jobTitle
                { job_description: { contains: search, mode: 'insensitive' } }  // Changed from jobDescription
            ]
        }

        // Fetch jobs with company information
        const jobs = await prisma.joblistings.findMany({
            where: whereClause,
            include: {
                company: {
                    select: {
                        common_name: true,  // Changed from commonName
                        website: true
                    }
                }
            },
            orderBy: {
                date_posted: 'desc'  // Changed from datePosted
            },
            take: parseInt(limit)
        })

        // Transform the data to match what the frontend expects
        const transformedJobs = jobs.map(job => ({
            id: job.id,
            title: job.job_title,           // Updated field name
            company: job.company.common_name, // Updated field name
            description: job.job_description, // Updated field name
            url: job.posting_url,           // Updated field name
            date: job.date_posted,          // Updated field name
            salary: job.minimum_salary ? `$${job.minimum_salary}` : null, // Updated field name
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