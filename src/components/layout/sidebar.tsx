"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  Settings, 
  Radio, 
  FolderOpen, 
  Calendar, 
  Layers, 
  Monitor,
  Menu
} from "lucide-react"
import { useState } from "react"

type ActiveView = "dashboard" | "channels" | "content" | "schedules" | "overlays" | "monitoring"

interface SidebarProps {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
}

const menuItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "channels" as const, label: "Channels", icon: Radio },
  { id: "content" as const, label: "Content", icon: FolderOpen },
  { id: "schedules" as const, label: "Schedules", icon: Calendar },
  { id: "overlays" as const, label: "CG Overlays", icon: Layers },
  { id: "monitoring" as const, label: "Live Monitor", icon: Monitor },
]

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "bg-card border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Radio className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">TV Playout</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => setActiveView(item.id)}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  !isCollapsed && "mr-2"
                )} />
                {!isCollapsed && item.label}
                {item.id === "monitoring" && !isCollapsed && (
                  <Badge variant="secondary" className="ml-auto">
                    LIVE
                  </Badge>
                )}
              </Button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Settings className={cn(
              "h-4 w-4",
              !isCollapsed && "mr-2"
            )} />
            {!isCollapsed && "Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}