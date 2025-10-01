"use client";

import React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@/components/ui/basic-dropdown";
import { Bell, CheckCircle, XCircle, Info } from "lucide-react";
import { useMedia } from "@/hooks/useMedia";

export default function NotificationsMenu() {
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

  const isMobile = useMedia();

  if (isMobile) {
    // 👉 Drawer en mobile
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <button className="relative">
            <Bell className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
            {newNotificationsCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Notificaciones</DrawerTitle>
            <DrawerDescription>
              {newNotificationsCount} nueva
              {newNotificationsCount !== 1 && "s"}
            </DrawerDescription>
          </DrawerHeader>

          {/* 👇 Ahora el scroll está solo acá */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {visibleNotifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 p-4 hover:bg-accent"
              >
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
              </div>
            ))}

            {notifications.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No hay nuevas notificaciones
              </p>
            )}
          </div>

          {/* 👇 Footer fijo, último elemento visible */}
          {notifications.length > 5 && (
            <button className="w-full py-3 text-sm text-primary font-medium hover:bg-accent border border-border">
              Ver todas las notificaciones
            </button>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  // 👉 Dropdown en desktop
  return (
    <div className="flex items-center justify-center">
      <Dropdown>
        <DropdownTrigger className="cursor-pointer relative">
          <Bell className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
          {newNotificationsCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </DropdownTrigger>

        <DropdownContent
          align="end"
          className="w-80 max-h-96 overflow-y-auto bg-background shadow rounded-md p-2"
        >
          <div className="px-3 py-2 border-b border-border text-sm font-semibold text-foreground flex justify-between">
            <p>Notificaciones</p>
            <p>
              {newNotificationsCount} nueva
              {newNotificationsCount !== 1 && "s"}
            </p>
          </div>

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

          {notifications.length > 5 && (
            <>
              <DropdownSeparator />
              <DropdownItem className="justify-center text-sm text-primary font-medium hover:bg-accent">
                Ver todas las notificaciones
              </DropdownItem>
            </>
          )}

          {notifications.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No hay nuevas notificaciones
            </p>
          )}
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
