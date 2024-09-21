import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
    pdf: { maxFileSize: "16MB", maxFileCount: 10 },
    text: { maxFileSize: "16MB", maxFileCount: 10 },
    "text/html": { maxFileSize: "16MB", maxFileCount: 10 },
    "text/csv": { maxFileSize: "16MB", maxFileCount: 10 },
  })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthorized");
      const dbUser = await db.user.findFirst({ where: { clerkId: user.id } });
      return { userId: dbUser?.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      // console.log("Upload complete for userId:", metadata.userId);
      // console.log("file url", file.url);
      // console.log("file name", file.name);
      // console.log("file size", file.size);
      return { userId: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
