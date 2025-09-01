import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const schedules = await db.schedule.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        channel: {
          select: { id: true, name: string }
        },
        items: {
          include: {
            mediaItem: {
              select: { 
                id: true, 
                title: true, 
                duration: true, 
                mimeType: true,
                thumbnail: true 
              }
            },
            overlays: {
              include: {
                overlay: {
                  select: { id: true, name: true, type: true }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      channelId,
      isLoop,
      userId = 'default-user-id' // In real app, get from auth
    } = body

    if (!name || !channelId) {
      return NextResponse.json(
        { error: 'Schedule name and channel are required' },
        { status: 400 }
      )
    }

    // Verify channel exists
    const channel = await db.channel.findUnique({
      where: { id: channelId }
    })

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      )
    }

    const schedule = await db.schedule.create({
      data: {
        name,
        description,
        channelId,
        isLoop: isLoop || false,
        userId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        channel: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule' },
      { status: 500 }
    )
  }
}