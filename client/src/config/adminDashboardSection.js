import {
  Users,
  Settings,
  Shield,
  BarChart3,
  FileText,
  Bell,
  ClipboardList,
  Calendar,
  MessageCircle,
  Upload,
  TrendingUp,
} from "lucide-react";

// Admin Dashboard Sections
export const adminDashboardSections = (navigate, openUploadModal) => [
  {
    id: "user-management",
    title: "User Management",
    description:
      "Manage patients, doctors, frontline workers, and admin accounts.",
    icon: Users,
    color: "blue",
    stats: "247 users",
    onClick: () => navigate("/admin/users"),
  },
  {
    id: "system-settings",
    title: "System Settings",
    description:
      "Configure platform settings, roles, permissions, and access control.",
    icon: Settings,
    color: "purple",
    onClick: () => navigate("/admin/settings"),
  },
  {
    id: "compliance",
    title: "Compliance & Audit",
    description:
      "Monitor platform compliance, regulatory adherence, and audit logs.",
    icon: Shield,
    color: "red",
    onClick: () => navigate("/admin/compliance"),
  },
  {
    id: "analytics",
    title: "Analytics & Reports",
    description:
      "View system analytics, user activity, platform performance metrics, and generate reports.",
    icon: BarChart3,
    color: "green",
    onClick: () => navigate("/admin/analytics"),
  },
  {
    id: "content-management",
    title: "Content Management",
    description:
      "Manage announcements, guidelines, notifications, and resources.",
    icon: FileText,
    color: "indigo",
    onClick: () => navigate("/admin/content"),
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Send critical alerts, system updates, and announcements.",
    icon: Bell,
    color: "amber",
    stats: "5 pending",
    onClick: () => navigate("/admin/notifications"),
  },
  {
    id: "audit-logs",
    title: "Audit Logs",
    description: "View system activity, admin actions, and security events.",
    icon: ClipboardList,
    color: "teal",
    onClick: () => navigate("/admin/audit-logs"),
  },
  {
    id: "calendar",
    title: "Platform Calendar",
    description: "View and manage important dates, deadlines, and events.",
    icon: Calendar,
    color: "blue",
    onClick: () => navigate("/admin/calendar"),
  },
  {
    id: "messages",
    title: "Secure Messages",
    description: "Communicate with staff, doctors, and other admins securely.",
    icon: MessageCircle,
    color: "purple",
    stats: "7 new",
    onClick: () => navigate("/admin/messages"),
  },
];

// Admin Quick Actions
export const adminQuickActions = (navigate) => [
  {
    id: "verifiy-doctors",
    title: "Verify Doctors",
    description: "Verify Goverment Ids for authenticity of the doctor",
    icon: Upload,
    color: "blue",
    onClick: () => navigate("/admin/doctor-verification"),
  },
  {
    id: "update-profile",
    title: "Update Profile",
    description: "Update your admin profile and preferences",
    icon: Users,
    color: "green",
    onClick: () => navigate("/admin/profile"),
  },
];

// Admin Status
export const adminStatus = {
  role: "Admin",
  statusColor: "blue",
  statusText: "Active",
  animated: true,
  welcomeMessage: "Managing the platform and users efficiently",
};

// Admin Footer Links
export const adminFooterLinks = [
  {
    text: "Platform Guidelines",
    href: "/admin/guidelines",
  },
  {
    text: "IT Support",
    href: "/support",
  },
  {
    text: "Emergency Protocols",
    href: "/admin/emergency-protocols",
  },
  {
    text: "Audit Reports",
    href: "/admin/audit-reports",
  },
];
