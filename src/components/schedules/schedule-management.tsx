"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  Repeat,
  Film,
  Layers
} from "lucide-react"
import { useState } from "react"

export function ScheduleManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const schedules = [
    {
      id: "1",
      name: "News Channel Schedule",
      description: "24/7 News programming",
      channel: "News Channel",
      isActive: true,
      isLoop: true,
      itemCount: 12,
      totalDuration: 21600, // 6 hours
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Sports Weekend",
      description: "Weekend sports programming",
      channel: "Sports Channel",
      isActive: true,
      isLoop: false,
      itemCount: 8,
      totalDuration: 14400, // 4 hours
      createdAt: "2024-01-14T15:45:00Z"
    },
    {
      id: "3",
      name: "Movie Night",
      description: "Evening movie schedule",
      channel: "Entertainment",
      isActive: false,
      isLoop: true,
      itemCount: 4,
      totalDuration: 7200, // 2 hours
      createdAt: "2024-01-13T09:20:00Z"
    },
    {
      id: "4",
      name: "Documentary Block",
      description: "Educational content block",
      channel: "Documentary",
      isActive: true,
      isLoop: true,
      itemCount: 6,
      totalDuration: 10800, // 3 hours
      createdAt: "2024-01-12T14:10:00Z"
    }
  ]

  const filteredSchedules = schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.channel.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage broadcast schedules
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search schedules..."
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

      {/* Schedules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{schedule.name}</CardTitle>
                  <CardDescription>{schedule.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={schedule.isActive ? "default" : "secondary"}>
                    {schedule.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {schedule.isLoop && (
                    <Badge variant="outline">
                      <Repeat className="h-3 w-3 mr-1" />
                      Loop
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Schedule Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Channel:</span>
                  <p className="font-medium">{schedule.channel}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Items:</span>
                  <p className="font-medium">{schedule.itemCount} items</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{formatDuration(schedule.totalDuration)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">
                    {new Date(schedule.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Schedule Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Schedule Preview
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Film className="h-3 w-3" />
                    <span>News Intro</span>
                    <Clock className="h-3 w-3 ml-auto" />
                    <span>00:30</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Film className="h-3 w-3" />
                    <span>Main News</span>
                    <Clock className="h-3 w-3 ml-auto" />
                    <span>25:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Film className="h-3 w-3" />
                    <span>Weather</span>
                    <Clock className="h-3 w-3 ml-auto" />
                    <span>05:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Layers className="h-3 w-3" />
                    <span>Commercial Break</span>
                    <Clock className="h-3 w-3 ml-auto" />
                    <span>02:00</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant={schedule.isActive ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                >
                  {schedule.isActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Schedule
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Schedule
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
        ))}
      </div>

      {filteredSchedules.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No schedules found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}