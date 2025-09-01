"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { DashboardOverview } from "@/components/dashboard/overview"
import { ChannelManagement } from "@/components/channels/channel-management"
import { ContentManagement } from "@/components/content/content-management"
import { ScheduleManagement } from "@/components/schedules/schedule-management"
import { OverlayManagement } from "@/components/overlays/overlay-management"
import { LiveMonitoring } from "@/components/monitoring/live-monitoring"

type ActiveView = "dashboard" | "channels" | "content" | "schedules" | "overlays" | "monitoring"

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard")

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardOverview />
      case "channels":
        return <ChannelManagement />
      case "content":
        return <ContentManagement />
      case "schedules":
        return <ScheduleManagement />
      case "overlays":
        return <OverlayManagement />
      case "monitoring":
        return <LiveMonitoring />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}