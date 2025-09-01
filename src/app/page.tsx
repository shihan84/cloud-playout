"use client"

import { useState } from "react"

// Import the standalone channel management component
import ChannelManagement from "@/components/channel-management"

export default function Home() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome to the TV Playout System
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold">Active Channels</h3>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Currently running</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold">Media Items</h3>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">In library</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold">Schedules</h3>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Active playlists</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold">System Status</h3>
                <p className="text-2xl font-bold text-green-600">Online</p>
                <p className="text-sm text-muted-foreground">All systems operational</p>
              </div>
            </div>
          </div>
        )
      case "channels":
        return <ChannelManagement />
      case "content":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-muted-foreground">Upload and organize your media content</p>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p>Content management features will be available soon.</p>
            </div>
          </div>
        )
      case "schedules":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Schedule Management</h1>
            <p className="text-muted-foreground">Create and manage broadcast schedules</p>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p>Schedule management features will be available soon.</p>
            </div>
          </div>
        )
      case "overlays":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">CG Overlay Management</h1>
            <p className="text-muted-foreground">Create and manage character generator overlays</p>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p>Overlay management features will be available soon.</p>
            </div>
          </div>
        )
      case "monitoring":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Live Monitoring</h1>
            <p className="text-muted-foreground">Real-time monitoring of all channels</p>
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
              <p>Live monitoring features will be available soon.</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-muted-foreground">Welcome to the TV Playout System</p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 bg-card border-r p-4">
        <h1 className="text-xl font-bold mb-6">TV Playout</h1>
        <nav className="space-y-2">
          {["dashboard", "channels", "content", "schedules", "overlays", "monitoring"].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`w-full text-left p-2 rounded transition-colors ${
                activeView === view 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}