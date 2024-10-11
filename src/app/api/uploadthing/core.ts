import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
    pdf: { maxFileSize: "16MB", maxFileCount: 10 },
    text: { maxFileSize: "16MB", maxFileCount: 10 },
    "text/html": { maxFileSize: "16MB", maxFileCount: 10 },
    "text/csv": { maxFileSize: "16MB", maxFileCount: 10 },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("File upload complete:", file);
      return { uploadedFile: file };
    }),
  logoUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("Logo upload complete:", file);
      return { completed: true };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
