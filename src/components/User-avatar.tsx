import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function UserAvatar({
  imgUrl,
  className,
}: {
  imgUrl: string | null | undefined;
  className?: string;
}) {
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
