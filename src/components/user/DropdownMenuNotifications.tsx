"use client";

import React, { useEffect, useState } from "react";
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
import { getMyNotifications } from "@/api";
import { useMedia } from "@/hooks/useMedia";
import { useAuth } from "@/hooks/useAuth";
import type { NotificationItem } from "@/types/notification.types";
import { Bell, CheckCircle, ClipboardCheck, Info, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const getNotificationIcon = (kind: NotificationItem["kind"]) => {
  switch (kind) {
    case "COURSE_PURCHASE_APPROVED":
    case "COURSE_SALE_CONFIRMED":
    case "INSTRUCTOR_ROLE_APPROVED":
    case "INSTRUCTOR_COURSE_PUBLISHED":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "INSTRUCTOR_PRACTICE_REQUEST_ACTION_REQUIRED":
      return <ClipboardCheck className="h-5 w-5 text-amber-600" />;
    case "COURSE_PAYMENT_FAILED":
      return <XCircle className="h-5 w-5 text-red-600" />;
    default:
      return <Info className="h-5 w-5 text-slate-500" />;
  }
};

const getRelativeTime = (createdAt: string) => {
  try {
    return formatDistanceToNow(new Date(createdAt), {
      addSuffix: true,
      locale: es,
    });
  } catch {
    return "";
  }
};

export default function NotificationsMenu() {
  const { isActive } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMedia();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    const loadNotifications = async () => {
      setIsLoading(true);

      try {
        const response = await getMyNotifications();

        if (!cancelled && response?.success && response.data) {
          setNotifications(response.data.items ?? []);
          setUnreadCount(response.data.unreadCount ?? 0);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [isActive]);

  const visibleNotifications = notifications.slice(0, 5);

  const handleNotificationClick = (href: string | null) => {
    if (href) {
      navigate(href);
    }
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <button className="relative">
            <Bell className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Notificaciones</DrawerTitle>
            <DrawerDescription>
              {unreadCount} importante{unreadCount !== 1 && "s"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {visibleNotifications.map((notification) => (
              <button
                key={notification.id}
                className="flex w-full items-start gap-3 p-4 text-left hover:bg-accent"
                onClick={() => handleNotificationClick(notification.href)}
                type="button"
              >
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.kind)}
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-foreground">
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {getRelativeTime(notification.createdAt)}
                </span>
              </button>
            ))}

            {!isLoading && notifications.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                No hay notificaciones importantes por ahora
              </p>
            )}

            {isLoading && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                Cargando notificaciones...
              </p>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Dropdown>
        <DropdownTrigger className="cursor-pointer relative">
          <Bell className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
          {unreadCount > 0 && (
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
              {unreadCount} importante{unreadCount !== 1 && "s"}
            </p>
          </div>

          {isLoading && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Cargando notificaciones...
            </p>
          )}

          {!isLoading &&
            visibleNotifications.map((notification, idx) => (
              <React.Fragment key={notification.id}>
                <DropdownItem
                  className="flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                  onClick={() => handleNotificationClick(notification.href)}
                >
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.kind)}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium text-foreground">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {getRelativeTime(notification.createdAt)}
                  </span>
                </DropdownItem>
                {idx < visibleNotifications.length - 1 && <DropdownSeparator />}
              </React.Fragment>
            ))}

          {!isLoading && notifications.length === 0 && (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No hay notificaciones importantes por ahora
            </p>
          )}
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
