import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const mediaItem = await db.mediaItem.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        scheduleItems: {
          include: {
            schedule: {
              select: { id: true, name: true, channel: { select: { id: true, name: true } } }
            }
          }
        }
      }
    })

    if (!mediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(mediaItem)
  } catch (error) {
    console.error('Error fetching media item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media item' },
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
      title,
      description,
      isActive
    } = body

    const existingMediaItem = await db.mediaItem.findUnique({
      where: { id: params.id }
    })

    if (!existingMediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      )
    }

    const mediaItem = await db.mediaItem.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(mediaItem)
  } catch (error) {
    console.error('Error updating media item:', error)
    return NextResponse.json(
      { error: 'Failed to update media item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const existingMediaItem = await db.mediaItem.findUnique({
      where: { id: params.id }
    })

    if (!existingMediaItem) {
      return NextResponse.json(
        { error: 'Media item not found' },
        { status: 404 }
      )
    }

    await db.mediaItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Media item deleted successfully' })
  } catch (error) {
    console.error('Error deleting media item:', error)
    return NextResponse.json(
      { error: 'Failed to delete media item' },
      { status: 500 }
    )
  }
}