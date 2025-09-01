"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Loader2 } from "lucide-react"

interface SimpleChannel {
  id: string
  name: string
  description?: string
  isActive: boolean
  resolution: string
  framerate: number
  createdAt: string
}

export function SimpleChannelManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [channels, setChannels] = useState<SimpleChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching channels...")
      
      const response = await fetch("/api/channels")
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log("Channels data:", data)
      setChannels(data)
    } catch (error) {
      console.error("Error fetching channels:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading channels...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Channels</h2>
          <p className="text-red-600">{error}</p>
        </div>
        <Button onClick={fetchChannels} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Channel Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your TV channels
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Channel
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{channel.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                </div>
                <Badge variant={channel.isActive ? "default" : "secondary"}>
                  {channel.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution:</span>
                  <span>{channel.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Framerate:</span>
                  <span>{channel.framerate} fps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(channel.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              {channels.length === 0 ? "No channels found. Create your first channel to get started." : "No channels found matching your search."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}