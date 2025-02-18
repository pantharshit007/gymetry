"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Dumbbell, TrendingUp, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserAction } from "@/actions/admin";
import { toast } from "@/hooks/use-toast";
import UserAvatar from "../User-avatar";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  streak: { current_streak: number; longest_streak: number } | null;
}

// const userStats = [
//   { month: "Jan", users: 120 },
//   { month: "Feb", users: 150 },
//   { month: "Mar", users: 200 },
//   { month: "Apr", users: 180 },
//   { month: "May", users: 220 },
//   { month: "Jun", users: 250 },
// ];

const totalWorkouts = 1500;
const activeUsers = 180;
const reportedIssues = 5;

export default function AdminPage() {
  const [userData, setUserData] = useState<UserData[]>([]);

  async function fetchUserData() {
    const { data, success, message } = await getUserAction();
    if (!success) {
      console.error("> [ERROR-ADMIN] fetchAdminData ", message);
      toast({
        title: "Error",
        description: message || "Something went wrong",
        variant: "error",
      });
    }

    setUserData(data ?? []);
    return;
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Users" value={userData.length} icon={Users} />
        <MetricCard
          title="Total Workouts"
          value={totalWorkouts}
          icon={Dumbbell}
        />
        <MetricCard
          title="Active Users"
          value={activeUsers}
          icon={TrendingUp}
        />
        <MetricCard
          title="Reported Issues"
          value={reportedIssues}
          icon={AlertCircle}
        />
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {userData.length <= 1 && (
        <div className="text-center">
          <h2 className="text-xl font-bold">
            You have no users{" "}
            <span className="text-orange-500">Chigga! 😢</span>
          </h2>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Streak (Current)</TableHead>
                <TableHead>Streak (Longest)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-2">
                    <UserAvatar
                      imgUrl={user.image}
                      className="ring-2 ring-orange-500"
                    />
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.streak?.current_streak ?? 0}</TableCell>
                  <TableCell>{user.streak?.longest_streak ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
