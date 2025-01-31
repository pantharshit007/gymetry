import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/lib/useClientSession";

function UserAvatar() {
  const user = useCurrentUser();
  const imgUrl = user?.image;
  const fallbackImgUrl =
    "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Ryan";
  return (
    <Avatar className="h-8 w-8 ring-2 ring-orange-500">
      <AvatarImage src={imgUrl || fallbackImgUrl} alt="User" />
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
