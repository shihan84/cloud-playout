import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const mediaItems = await db.mediaItem.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        scheduleItems: {
          select: { id: true, schedule: { select: { id: true, name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(mediaItems)
  } catch (error) {
    console.error('Error fetching media items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const userId = formData.get('userId') as string || 'default-user-id'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Upload the file to a cloud storage (S3, Cloudinary, etc.)
    // 2. Generate a thumbnail
    // 3. Get file metadata (duration for video, etc.)
    
    // For demo purposes, we'll simulate the upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Simulate file processing and metadata extraction
    const duration = file.type.startsWith('video/') ? Math.floor(Math.random() * 300) + 30 : 0 // Random duration for demo
    const filePath = `/uploads/${file.name}`
    const thumbnailPath = file.type.startsWith('video/') ? `/uploads/thumbnails/${file.name}.jpg` : null

    const mediaItem = await db.mediaItem.create({
      data: {
        title,
        description: description || null,
        filename: file.name,
        filePath,
        fileSize: file.size,
        duration,
        mimeType: file.type,
        thumbnail: thumbnailPath,
        userId
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(mediaItem, { status: 201 })
  } catch (error) {
    console.error('Error creating media item:', error)
    return NextResponse.json(
      { error: 'Failed to create media item' },
      { status: 500 }
    )
  }
}