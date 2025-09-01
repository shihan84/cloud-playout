import { db } from '@/lib/db'

export default async function APItestPage() {
  try {
    // Test database connection
    const channels = await db.channel.findMany({
      take: 3,
      include: {
        _count: {
          select: {
            schedules: true,
            overlays: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold">API & Database Test</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-green-800 font-semibold">✅ Database Connection Successful</h2>
          <p className="text-green-600">Found {channels.length} channels in database</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sample Channels:</h2>
          {channels.length > 0 ? (
            <div className="grid gap-4">
              {channels.map((channel) => (
                <div key={channel.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span>Resolution: {channel.resolution}</span>
                    <span>Framerate: {channel.framerate}fps</span>
                    <span>Active: {channel.isActive ? 'Yes' : 'No'}</span>
                    {channel._count && (
                      <>
                        <span>Schedules: {channel._count.schedules}</span>
                        <span>Overlays: {channel._count.overlays}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">No channels found in database. Create your first channel!</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-blue-800 font-semibold">Next Steps:</h2>
          <ul className="text-blue-600 list-disc list-inside mt-2">
            <li>Navigate to the "Channels" tab in the main application</li>
            <li>Click "Create Channel" to add your first TV channel</li>
            <li>Test the full channel management functionality</li>
          </ul>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-bold text-red-600">API & Database Test Failed</h1>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">❌ Database Connection Error</h2>
          <p className="text-red-600">Error connecting to database:</p>
          <pre className="bg-red-100 p-4 rounded text-red-800 mt-2">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-yellow-800 font-semibold">Troubleshooting Steps:</h2>
          <ul className="text-yellow-600 list-disc list-inside mt-2">
            <li>Check if the database file exists at `/db/custom.db`</li>
            <li>Ensure Prisma client is generated (run `npm run db:generate`)</li>
            <li>Check database schema with `npm run db:push`</li>
            <li>Restart the development server</li>
          </ul>
        </div>
      </div>
    )
  }
}