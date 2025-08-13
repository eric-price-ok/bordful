import { prisma } from '../../../lib/db/prisma.ts'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit') || '50'
        const search = searchParams.get('search')

        let whereClause = {
            approved: true,
            defunct: false
        }

        if (search) {
            whereClause.common_name = {
                contains: search,
                mode: 'insensitive'
            }
        }

        const companies = await prisma.company.findMany({
            where: whereClause,
            include: {
                _count: {
                    select: {
                        joblistings: {
                            where: {
                                job_status_id: 1,
                                approved: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                common_name: 'asc'
            },
            take: parseInt(limit)
        })

        const transformedCompanies = companies.map(company => ({
            id: company.id,
            name: company.common_name,
            website: company.website,
            jobBoard: company.jobboard,
            description: company.description,
            activeJobs: company._count.joblistings,
            founded: company.date_founded
        }))

        return NextResponse.json({
            companies: transformedCompanies,
            total: transformedCompanies.length
        })

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch companies', details: error.message },
            { status: 500 }
        )
    }
}