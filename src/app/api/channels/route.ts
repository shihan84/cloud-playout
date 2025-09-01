import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const channels = await db.channel.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        schedules: {
          select: { id: true, name: true, isActive: true }
        },
        overlays: {
          select: { id: true, name: true, isActive: true }
        },
        _count: {
          select: {
            schedules: true,
            overlays: true,
            playoutLogs: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(channels)
  } catch (error) {
    console.error('Error fetching channels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch channels' },
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
      streamUrl,
      outputUrl,
      resolution,
      framerate,
      userId = 'default-user-id' // In real app, get from auth
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Channel name is required' },
        { status: 400 }
      )
    }

    const channel = await db.channel.create({
      data: {
        name,
        description,
        streamUrl,
        outputUrl,
        resolution: resolution || '1920x1080',
        framerate: framerate || 30,
        userId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(channel, { status: 201 })
  } catch (error) {
    console.error('Error creating channel:', error)
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    )
  }
}