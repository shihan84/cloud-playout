import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schedule = await db.schedule.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        channel: {
          select: { id: true, name: true, isActive: true }
        },
        items: {
          include: {
            mediaItem: {
              select: { 
                id: true, 
                title: true, 
                duration: true, 
                mimeType: true,
                thumbnail: true,
                filePath: true
              }
            },
            overlays: {
              include: {
                overlay: {
                  select: { 
                    id: true, 
                    name: true, 
                    type: true, 
                    content: true,
                    position: true,
                    size: true
                  }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Calculate total duration
    const totalDuration = schedule.items.reduce((total, item) => total + item.duration, 0)

    return NextResponse.json({
      ...schedule,
      totalDuration
    })
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      channelId,
      isLoop,
      isActive
    } = body

    const existingSchedule = await db.schedule.findUnique({
      where: { id: params.id }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // If channelId is changing, verify the new channel exists
    if (channelId && channelId !== existingSchedule.channelId) {
      const channel = await db.channel.findUnique({
        where: { id: channelId }
      })

      if (!channel) {
        return NextResponse.json(
          { error: 'Channel not found' },
          { status: 404 }
        )
      }
    }

    const schedule = await db.schedule.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(channelId && { channelId }),
        ...(isLoop !== undefined && { isLoop }),
        ...(isActive !== undefined && { isActive })
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

    return NextResponse.json(schedule)
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingSchedule = await db.schedule.findUnique({
      where: { id: params.id }
    })

    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    // Delete schedule items and overlay items first (cascade delete should handle this)
    await db.schedule.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Schedule deleted successfully' })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    )
  }
}