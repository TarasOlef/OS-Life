import {
  Activity,
  BarChart3,
  CircleUserRound,
  Dumbbell,
  Ellipsis,
  Home,
  Landmark,
  LineChart,
  Moon,
  Settings,
  Target,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export type AppRoute = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const appRoutes: AppRoute[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Daily command center",
  },
  {
    title: "Nutrition",
    href: "/nutrition",
    icon: Utensils,
    description: "Calories, protein, and meals",
  },
  {
    title: "Training",
    href: "/training",
    icon: Dumbbell,
    description: "Workouts and progression",
  },
  {
    title: "Sleep",
    href: "/sleep",
    icon: Moon,
    description: "Duration and recovery",
  },
  {
    title: "Body",
    href: "/body",
    icon: Activity,
    description: "Check-ins and measurements",
  },
  {
    title: "Focus",
    href: "/focus",
    icon: Target,
    description: "Deep work and projects",
  },
  {
    title: "Finances",
    href: "/finances",
    icon: Landmark,
    description: "Spending and categories",
  },
  {
    title: "Investments",
    href: "/investments",
    icon: LineChart,
    description: "Portfolio positions",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Profile and preferences",
  },
];

export const mobileRoutes = appRoutes.filter((route) =>
  ["/dashboard", "/nutrition", "/training", "/body"].includes(route.href),
);

mobileRoutes.push({
  title: "More",
  href: "/settings",
  icon: Ellipsis,
  description: "Sleep, focus, money, investments, and settings",
});

export const overviewRoutes: AppRoute[] = [
  {
    title: "Profile",
    href: "/settings",
    icon: CircleUserRound,
    description: "Account readiness",
  },
  {
    title: "Signals",
    href: "/dashboard",
    icon: BarChart3,
    description: "Cross-module trends",
  },
];
