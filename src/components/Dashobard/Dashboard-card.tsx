import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  content: string;
  description: string;
}

function DashboardCard({
  title,
  icon: Icon,
  content,
  description,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
