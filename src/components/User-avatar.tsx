"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/useClientSession";
import { cn } from "@/lib/utils";

function UserAvatar({ className }: { className?: string }) {
  const user = useCurrentUser();
  const imgUrl = user?.image;
  const fallbackImgUrl =
    "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Ryan";
  return (
    <Avatar className={cn("h-8 w-8 ring-orange-500 focus:ring-2", className)}>
      <AvatarImage src={imgUrl || fallbackImgUrl} alt="User" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
