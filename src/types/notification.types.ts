export type NotificationKind =
  | "COURSE_PURCHASE_APPROVED"
  | "COURSE_PAYMENT_FAILED"
  | "COURSE_SALE_CONFIRMED"
  | "INSTRUCTOR_ROLE_APPROVED"
  | "INSTRUCTOR_COURSE_PUBLISHED"
  | "INSTRUCTOR_PRACTICE_REQUEST_ACTION_REQUIRED";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: string;
  href: string | null;
  priority: "HIGH" | "MEDIUM";
  channel: "IN_APP" | "IN_APP_AND_EMAIL";
}

export interface NotificationsResponseData {
  items: NotificationItem[];
  unreadCount: number;
}
