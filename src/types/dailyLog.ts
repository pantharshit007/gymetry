import type { DailyLog } from "@prisma/client";

// Type: data recieved via API from DB
export type rawDataType = Omit<DailyLog, "id" | "userId" | "createdAt">;
