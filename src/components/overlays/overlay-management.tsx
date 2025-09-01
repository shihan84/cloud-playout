"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Layers, 
  Type, 
  Image as ImageIcon, 
  Clock, 
  Cloud,
  Zap,
  Edit,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"

export function OverlayManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const overlays = [
    {
      id: "1",
      name: "News Ticker",
      type: "NEWS_TICKER",
      content: '{"text": "Breaking News updates scroll here...", "speed": "medium", "color": "#ffffff"}',
      position: "bottom",
      size: "medium",
      isActive: true,
      channel: "News Channel",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Clock Overlay",
      type: "CLOCK",
      content: '{"format": "HH:mm:ss", "showDate": true, "timezone": "local"}',
      position: "top-right",
      size: "small",
      isActive: true,
      channel: "All Channels",
      createdAt: "2024-01-14T15:45:00Z"
    },
    {
      id: "3",
      name: "Weather Widget",
      type: "WEATHER",
      content: '{"location": "New York", "units": "celsius", "showIcon": true}',
      position: "top-left",
      size: "medium",
      isActive: false,
      channel: "News Channel",
      createdAt: "2024-01-13T09:20:00Z"
    },
    {
      id: "4",
      name: "Channel Logo",
      type: "IMAGE",
      content: '{"imageUrl": "/logos/channel-logo.png", "opacity": 0.8, "animation": "none"}',
      position: "top-right",
      size: "small",
      isActive: true,
      channel: "All Channels",
      createdAt: "2024-01-12T14:10:00Z"
    },
    {
      id: "5",
      name: "Lower Third",
      type: "TEXT",
      content: '{"title": "Guest Speaker", "subtitle": "John Doe - Expert", "style": "modern"}',
      position: "bottom",
      size: "large",
      isActive: false,
      channel: "Entertainment",
      createdAt: "2024-01-11T16:25:00Z"
    }
  ]

  const filteredOverlays = overlays.filter(overlay =>
    overlay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    overlay.channel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getOverlayIcon = (type: string) => {
    switch (type) {
      case "TEXT": return Type
      case "IMAGE": return ImageIcon
      case "CLOCK": return Clock
      case "WEATHER": return Cloud
      case "NEWS_TICKER": return Zap
      default: return Layers
    }
  }

  const getOverlayTypeName = (type: string) => {
    switch (type) {
      case "TEXT": return "Text"
      case "IMAGE": return "Image"
      case "CLOCK": return "Clock"
      case "WEATHER": return "Weather"
      case "NEWS_TICKER": return "News Ticker"
      case "CUSTOM": return "Custom"
      default: return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CG Overlay Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage character generator overlays
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Overlay
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search overlays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Sort</Button>
          </div>
        </CardContent>
      </Card>

      {/* Overlays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOverlays.map((overlay) => {
          const Icon = getOverlayIcon(overlay.type)
          return (
            <Card key={overlay.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <CardTitle className="text-lg">{overlay.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {getOverlayTypeName(overlay.type)} • {overlay.channel}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={overlay.isActive ? "default" : "secondary"}>
                      {overlay.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="bg-muted rounded-lg p-4 aspect-video flex items-center justify-center relative">
                  <div className="text-center">
                    <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Overlay Preview</p>
                  </div>
                  
                  {/* Position indicator */}
                  <div className={`absolute ${
                    overlay.position === "top-left" ? "top-2 left-2" :
                    overlay.position === "top-right" ? "top-2 right-2" :
                    overlay.position === "bottom-left" ? "bottom-2 left-2" :
                    overlay.position === "bottom-right" ? "bottom-2 right-2" :
                    "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  }`}>
                    <div className={`w-2 h-2 bg-primary rounded-full ${
                      overlay.size === "small" ? "" :
                      overlay.size === "medium" ? "w-3 h-3" : "w-4 h-4"
                    }`} />
                  </div>
                </div>

                {/* Overlay Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Position:</span>
                    <p className="font-medium capitalize">{overlay.position.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <p className="font-medium capitalize">{overlay.size}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Channel:</span>
                    <p className="font-medium">{overlay.channel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <p className="font-medium">
                      {new Date(overlay.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    {overlay.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOverlays.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No overlays found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}