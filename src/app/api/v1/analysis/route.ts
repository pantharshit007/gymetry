import { auth } from "@/server/auth/auth";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import sampleData from "@/utils/sample.json";

const GET = async (req: NextRequest): Promise<NextResponse> => {
  // const session = await auth();

  // if (!session || !session.user) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: "Not authenticated",
  //     },
  //     { status: 401 },
  //   );
  // }

  // const res = await db.dailyLog.findMany({
  //   where: {
  //     userId: session.user.id,
  //   },
  //   select: {
  //     date: true,
  //     workout: true,
  //     reps: true,
  //     weight: true,
  //     steps: true,
  //     distance: true,
  //   },
  // });

  return NextResponse.json(
    {
      sampleData,
    },
    { status: 200 },
  );
};

export { GET };
