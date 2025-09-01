import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scheduleItems = await db.scheduleItem.findMany({
      where: { scheduleId: params.id },
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
    })

    return NextResponse.json(scheduleItems)
  } catch (error) {
    console.error('Error fetching schedule items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedule items' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      mediaItemId,
      duration,
      transition = "cut",
      startTime
    } = body

    if (!mediaItemId) {
      return NextResponse.json(
        { error: 'Media item is required' },
        { status: 400 }
      )
    }

    // Verify schedule exists
    const schedule = await db.schedule.findUnique({
      where: { id: params.id }
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Verify media item exists
    const mediaItem = await db.mediaItem.findUnique({
      where: { id: mediaItemId }
    })

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      )
    }

    // Get the current highest order for this schedule
    const lastItem = await db.scheduleItem.findFirst({
      where: { scheduleId: params.id },
      orderBy: { order: 'desc' }
    })

    const order = lastItem ? lastItem.order + 1 : 0

    // Use media item duration if not specified
    const itemDuration = duration || mediaItem.duration

    const scheduleItem = await db.scheduleItem.create({
      data: {
        scheduleId: params.id,
        mediaItemId,
        duration: itemDuration,
        transition,
        startTime,
        order
      },
      include: {
        mediaItem: {
          select: { 
            id: true, 
            title: true, 
            duration: true, 
            mimeType: true,
            thumbnail: true
          }
        }
      }
    })

    return NextResponse.json(scheduleItem, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule item:', error)
    return NextResponse.json(
      { error: 'Failed to create schedule item' },
      { status: 500 }
    )
  }
}