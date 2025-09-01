"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Monitor, 
  Radio, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Pause,
  Play,
  Settings,
  Maximize,
  Volume2
} from "lucide-react"
import { useState, useEffect } from "react"

export function LiveMonitoring() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Mock data
  const activeChannels = [
    {
      id: "1",
      name: "News Channel",
      status: "live",
      viewers: 12543,
      currentProgram: "Breaking News",
      nextProgram: "Weather Report",
      timeRemaining: 180, // seconds
      streamHealth: 95,
      audioLevel: 75,
      isActive: true
    },
    {
      id: "2",
      name: "Sports Channel",
      status: "live",
      viewers: 8234,
      currentProgram: "Live Soccer Match",
      nextProgram: "Sports News",
      timeRemaining: 2400,
      streamHealth: 88,
      audioLevel: 82,
      isActive: true
    },
    {
      id: "3",
      name: "Entertainment",
      status: "scheduled",
      viewers: 0,
      currentProgram: "Offline",
      nextProgram: "Movie Night",
      timeRemaining: 3600,
      streamHealth: 0,
      audioLevel: 0,
      isActive: false
    },
    {
      id: "4",
      name: "Documentary",
      status: "offline",
      viewers: 0,
      currentProgram: "Offline",
      nextProgram: "Nature Special",
      timeRemaining: 7200,
      streamHealth: 0,
      audioLevel: 0,
      isActive: false
    }
  ]

  const systemAlerts = [
    { type: "warning", message: "High CPU usage on News Channel", time: "2 minutes ago" },
    { type: "info", message: "Sports Channel schedule updated", time: "5 minutes ago" },
    { type: "error", message: "Connection lost to backup encoder", time: "10 minutes ago" },
    { type: "success", message: "New media uploaded successfully", time: "15 minutes ago" }
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViewers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "destructive"
      case "scheduled": return "default"
      case "offline": return "secondary"
      default: return "secondary"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return AlertTriangle
      case "warning": return AlertTriangle
      case "info": return CheckCircle
      case "success": return CheckCircle
      default: return CheckCircle
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error": return "text-red-500"
      case "warning": return "text-yellow-500"
      case "info": return "text-blue-500"
      case "success": return "text-green-500"
      default: return "text-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Live Monitoring
            <Badge variant="destructive" className="animate-pulse">
              LIVE
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time monitoring of all channels and system status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleString()}
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>Current output preview</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center relative">
                <div className="text-center text-white">
                  <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Live Preview</p>
                  <p className="text-sm opacity-75">News Channel - Breaking News</p>
                </div>
                
                {/* Live indicator */}
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                </div>

                {/* Viewer count */}
                <div className="absolute top-4 right-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
                  <Users className="h-4 w-4 inline mr-1" />
                  12.5K viewers
                </div>

                {/* Time remaining */}
                <div className="absolute bottom-4 left-4 bg-black/75 text-white px-3 py-1 rounded-full text-sm">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {formatTime(180)} remaining
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Channel Status</CardTitle>
              <CardDescription>Real-time status of all channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChannels.map((channel) => (
                  <div key={channel.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Radio className="h-4 w-4" />
                        <span className="font-medium">{channel.name}</span>
                      </div>
                      <Badge variant={getStatusColor(channel.status)}>
                        {channel.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current:</span>
                        <span>{channel.currentProgram}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next:</span>
                        <span>{channel.nextProgram}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Viewers:</span>
                        <span>{formatViewers(channel.viewers)}</span>
                      </div>
                    </div>

                    {channel.isActive && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Stream Health:</span>
                          <span>{channel.streamHealth}%</span>
                        </div>
                        <Progress value={channel.streamHealth} className="h-1" />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Audio Level:</span>
                          <span>{channel.audioLevel}%</span>
                        </div>
                        <Progress value={channel.audioLevel} className="h-1" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Button 
                        variant={channel.isActive ? "destructive" : "default"}
                        size="sm" 
                        className="flex-1"
                      >
                        {channel.isActive ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Maximize className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemAlerts.map((alert, index) => {
                const Icon = getAlertIcon(alert.type)
                return (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Icon className={`h-4 w-4 mt-0.5 ${getAlertColor(alert.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Overall system performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memory</span>
                  <span className="text-sm text-muted-foreground">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-muted-foreground">34%</span>
                </div>
                <Progress value={34} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Viewers</span>
                <span className="font-medium">20.8K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Channels</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bandwidth</span>
                <span className="font-medium">45 Mbps</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}