import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "primary" | "secondary" | "success" | "warning" | "error";
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  const getColorClasses = (color: string) => {
    const colors = {
      primary: "bg-primary/10 text-primary",
      secondary: "bg-secondary/10 text-secondary",
      success: "bg-green-500/10 text-green-600",
      warning: "bg-yellow-500/10 text-yellow-600",
      error: "bg-red-500/10 text-red-600",
    };
    return colors[color as keyof typeof colors] || colors.primary;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
