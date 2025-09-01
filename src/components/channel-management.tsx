"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Settings, Play, Pause, Edit, Trash2, Loader2 } from "lucide-react"

interface Channel {
  id: string
  name: string
  description?: string
  isActive: boolean
  streamUrl?: string
  outputUrl?: string
  resolution: string
  framerate: number
  logoUrl?: string
  createdAt: string
  updatedAt: string
  userId: string
  user?: {
    id: string
    name: string
    email: string
  }
  schedules?: Array<{
    id: string
    name: string
    isActive: boolean
  }>
  overlays?: Array<{
    id: string
    name: string
    isActive: boolean
  }>
  _count?: {
    schedules: number
    overlays: number
    playoutLogs: number
  }
}

interface ChannelFormData {
  name: string
  description?: string
  streamUrl?: string
  outputUrl?: string
  resolution: string
  framerate: number
  isActive: boolean
}

export default function ChannelManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ChannelFormData>({
    name: "",
    description: "",
    streamUrl: "",
    outputUrl: "",
    resolution: "1920x1080",
    framerate: 30,
    isActive: true
  })

  useEffect(() => {
    fetchChannels()
  }, [])

  const fetchChannels = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/channels")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setChannels(data)
    } catch (err) {
      console.error("Error fetching channels:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch channels")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return

    setIsSubmitting(true)
    setError(null)
    
    try {
      const url = editingChannel ? `/api/channels/${editingChannel.id}` : "/api/channels"
      const method = editingChannel ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchChannels()
      setIsDialogOpen(false)
      resetForm()
    } catch (err) {
      console.error("Error saving channel:", err)
      setError(err instanceof Error ? err.message : "Failed to save channel")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      description: channel.description || "",
      streamUrl: channel.streamUrl || "",
      outputUrl: channel.outputUrl || "",
      resolution: channel.resolution,
      framerate: channel.framerate,
      isActive: channel.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (channelId: string) => {
    try {
      const response = await fetch(`/api/channels/${channelId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchChannels()
    } catch (err) {
      console.error("Error deleting channel:", err)
      setError(err instanceof Error ? err.message : "Failed to delete channel")
    }
  }

  const resetForm = () => {
    setEditingChannel(null)
    setFormData({
      name: "",
      description: "",
      streamUrl: "",
      outputUrl: "",
      resolution: "1920x1080",
      framerate: 30,
      isActive: true
    })
  }

  const filteredChannels = channels.map(channel => ({
    ...channel,
    status: channel.isActive ? "live" : "offline",
    viewers: "0"
  })).filter(channel =>
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Channel Management</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your TV channels
            </p>
          </div>
        </div>
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-600 font-medium mb-2">Error Loading Channels</div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchChannels} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Channel Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your TV channels
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Channel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingChannel ? "Edit Channel" : "Create New Channel"}
              </DialogTitle>
              <DialogDescription>
                {editingChannel 
                  ? "Update the channel settings below."
                  : "Create a new TV channel for broadcasting."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Channel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter channel name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter channel description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resolution">Resolution</Label>
                  <Select 
                    value={formData.resolution} 
                    onValueChange={(value) => setFormData({ ...formData, resolution: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                      <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                      <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="framerate">Framerate (fps)</Label>
                  <Select 
                    value={formData.framerate.toString()} 
                    onValueChange={(value) => setFormData({ ...formData, framerate: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="streamUrl">Stream URL</Label>
                <Input
                  id="streamUrl"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  placeholder="rtmp://example.com/live"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outputUrl">Output URL</Label>
                <Input
                  id="outputUrl"
                  value={formData.outputUrl}
                  onChange={(e) => setFormData({ ...formData, outputUrl: e.target.value })}
                  placeholder="https://example.com/stream"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name.trim()}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingChannel ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
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
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.map((channel) => (
          <Card key={channel.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{channel.name}</CardTitle>
                  <CardDescription>{channel.description}</CardDescription>
                </div>
                <Badge 
                  variant={channel.status === "live" ? "destructive" : 
                          channel.status === "scheduled" ? "default" : "secondary"}
                >
                  {channel.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Channel Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Resolution:</span>
                  <p className="font-medium">{channel.resolution}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Framerate:</span>
                  <p className="font-medium">{channel.framerate} fps</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Viewers:</span>
                  <p className="font-medium">{channel.viewers}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Active:</span>
                  <p className="font-medium">{channel.isActive ? "Yes" : "No"}</p>
                </div>
                {channel._count && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Schedules:</span>
                      <p className="font-medium">{channel._count.schedules}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Overlays:</span>
                      <p className="font-medium">{channel._count.overlays}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant={channel.status === "live" ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                >
                  {channel.status === "live" ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEdit(channel)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Channel</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{channel.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(channel.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No channels found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}