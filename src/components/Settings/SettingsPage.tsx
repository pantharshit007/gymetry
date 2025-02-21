"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAccount } from "@/actions/settings";
import { toast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useClientSession";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const user = useCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleDeleteAccount = () => {
    try {
      startTransition(async () => {
        const res = await deleteAccount(user.id);
        if (!res.success) {
          throw new Error(res.message);
        }

        await signOut();

        setIsDeleteDialogOpen(false);
        toast({
          title: "Account deleted",
          description: "Your account has been deleted!",
          variant: "success",
        });
      });
    } catch (err: any) {
      console.log("Error deleting account:", err);
      toast({
        title: "Error deleting account",
        description:
          err.message ?? "Something went wrong, please try again later.",
        variant: "error",
      });
    }
  };

  return (
    <div className="mx-auto w-fit space-y-6 p-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about your progress
                </p>
              </div>
              <Switch disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Report</Label>
                <p className="text-sm text-muted-foreground">
                  Get a weekly summary of your workouts
                </p>
              </div>
              <Switch disabled />
            </div>
            <Button disabled>Save Preferences</Button>
          </CardContent>
        </Card>

        <Card className="max-w-2xl border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-destructive/30 p-2">
                <Trash2 className="h-5 w-5 text-rose-600" />
              </div>
              <CardTitle className="text-rose-600">Delete Account</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Would you like to delete your account? This action cannot be
              undone and will permanently delete your account and all related
              data from our database.
            </p>
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="destructive">
                  I want to delete my account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription className="pt-2">
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isPending}
                  >
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
