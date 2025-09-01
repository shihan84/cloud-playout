"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Radio, 
  FolderOpen, 
  Calendar, 
  Layers, 
  Play, 
  Pause, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Users
} from "lucide-react"

export function DashboardOverview() {
  // Mock data for demonstration
  const stats = [
    {
      title: "Active Channels",
      value: "8",
      change: "+2",
      icon: Radio,
      color: "text-blue-600"
    },
    {
      title: "Media Items",
      value: "156",
      change: "+12",
      icon: FolderOpen,
      color: "text-green-600"
    },
    {
      title: "Active Schedules",
      value: "24",
      change: "+3",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "CG Overlays",
      value: "32",
      change: "+5",
      icon: Layers,
      color: "text-orange-600"
    }
  ]

  const activeChannels = [
    { name: "News Channel", status: "live", viewers: "12.5K", next: "Breaking News at 6:00 PM" },
    { name: "Sports Channel", status: "live", viewers: "8.2K", next: "Live Soccer Match" },
    { name: "Entertainment", status: "scheduled", viewers: "0", next: "Movie Night at 8:00 PM" },
    { name: "Documentary", status: "offline", viewers: "0", next: "Nature Special at 7:00 PM" }
  ]

  const recentActivity = [
    { action: "Channel started", channel: "News Channel", time: "2 minutes ago", status: "success" },
    { action: "Schedule updated", channel: "Sports Channel", time: "15 minutes ago", status: "info" },
    { action: "Overlay added", channel: "Entertainment", time: "1 hour ago", status: "success" },
    { action: "Media uploaded", channel: "Documentary", time: "2 hours ago", status: "success" },
    { action: "Error occurred", channel: "News Channel", time: "3 hours ago", status: "error" }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome to TV Playout System</h1>
          <p className="text-muted-foreground mt-2">
            Manage your channels, content, schedules, and overlays from one central dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Start All Channels
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last week
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Status</CardTitle>
            <CardDescription>
              Current status of all your channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeChannels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Radio className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{channel.name}</p>
                    <p className="text-sm text-muted-foreground">{channel.next}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={channel.status === "live" ? "destructive" : 
                            channel.status === "scheduled" ? "default" : "secondary"}
                  >
                    {channel.status.toUpperCase()}
                  </Badge>
                  {channel.viewers !== "0" && (
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3" />
                      {channel.viewers}
                    </div>
                  )}
                  <Button variant="ghost" size="icon">
                    {channel.status === "live" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`mt-0.5 h-2 w-2 rounded-full ${
                  activity.status === "success" ? "bg-green-500" :
                  activity.status === "error" ? "bg-red-500" : "bg-blue-500"
                }`} />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.channel} • {activity.time}
                  </p>
                </div>
                {activity.status === "error" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Overall system performance and resource usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}