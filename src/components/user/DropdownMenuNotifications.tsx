"use client";

import React from "react";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/basic-dropdown";
import { Bell, CheckCircle, XCircle, Info } from "lucide-react";

export default function DropdownMenuNotifications() {
  const notifications = [
    {
      id: 1,
      title: "New course available",
      message: "Check out the latest CPR course.",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      time: "2h ago",
    },
    {
      id: 2,
      title: "Payment failed",
      message: "Your last payment could not be processed.",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      time: "5h ago",
    },
    {
      id: 3,
      title: "Subscription expiring",
      message: "Renew your Pro Plan to continue uninterrupted access.",
      icon: <Info className="h-5 w-5 text-yellow-500" />,
      time: "1d ago",
    },
    {
      id: 4,
      title: "New message from instructor",
      message: "You have a new message from John Doe.",
      icon: <Info className="h-5 w-5 text-blue-500" />,
      time: "1d ago",
    },
    {
      id: 5,
      title: "Certificate ready",
      message: "Your completion certificate is now available.",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      time: "2d ago",
    },
    {
      id: 6,
      title: "System update",
      message: "Scheduled maintenance at 12:00 AM.",
      icon: <Info className="h-5 w-5 text-gray-500" />,
      time: "3d ago",
    },
  ];

  const newNotificationsCount = notifications.length;
  const visibleNotifications = notifications.slice(0, 5);

  return (
    <div className="flex items-center justify-center">
      <Dropdown>
        {/* Trigger */}
        <DropdownTrigger className="cursor-pointer relative">
          <Bell className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
          {newNotificationsCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </DropdownTrigger>

        {/* Dropdown Content */}
        <DropdownContent
          align="end"
          className="w-80 max-h-96 overflow-y-auto bg-background shadow-lg rounded-md p-2"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-border text-sm font-semibold text-foreground flex justify-between">
            <p>Notificationes</p>
            <p>
              {newNotificationsCount} nueva
              {newNotificationsCount !== 1 && "s"}
            </p>
          </div>

          {/* Notifications */}
          {visibleNotifications.map((n, idx) => (
            <React.Fragment key={n.id}>
              <DropdownItem className="flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors">
                <div className="flex-shrink-0">{n.icon}</div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {n.time}
                </span>
              </DropdownItem>
              {idx < visibleNotifications.length - 1 && <DropdownSeparator />}
            </React.Fragment>
          ))}

          {/* View all notifications */}
          {notifications.length > 5 && (
            <>
              <DropdownSeparator />
              <DropdownItem className="justify-center text-sm text-primary font-medium hover:bg-accent">
                Ver todas las notificaciones
              </DropdownItem>
            </>
          )}

          {/* Empty state */}
          {notifications.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No hay nuevas notivicaciones
            </p>
          )}
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
