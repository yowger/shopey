import { createUploadthing } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { auth } from "@/server/auth"

import type { FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
    avatarUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 10 },
    })
        .middleware(async ({ req }) => {
            const session = await auth()

            if (!session || !session.user.sub) {
                throw new UploadThingError("Unauthorized")
            }

            return { userId: session.user.sub }
        })
        .onUploadError(({ error }) => {
            console.log("error uploading avatar", error)
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Avatar Upload complete for userId:", metadata.userId)

            return { uploadedBy: metadata.userId }
        }),

    variantProductUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 10 },
    })
        .middleware(async ({ req }) => {
            const session = await auth()

            if (!session || !session.user.sub) {
                throw new UploadThingError("Unauthorized")
            }

            return { userId: session.user.sub }
        })
        .onUploadError(({ error }) => {
            console.log("error uploading product variant", error)
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Variant Upload complete for userId:", metadata.userId)

            return { uploadedBy: metadata.userId }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
