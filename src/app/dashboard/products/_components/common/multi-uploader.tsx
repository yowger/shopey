import imageCompression from "browser-image-compression"
import { useDropzone } from "@uploadthing/react"
import { useCallback, useEffect, useState } from "react"
import {
    generateClientDropzoneAccept,
    generatePermittedFileTypes,
} from "uploadthing/client"

import { cn } from "@/lib/utils"

import { useUploadThing } from "@/lib/uploadthing/hooks"

import ImagePreview from "./image-preview"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface MultiUploaderProps {
    maxImageFiles?: number
    isUploading?: boolean
    onChange?: (files: File[]) => void
    onError?: (error: Error) => void
    onBlur?: () => void
}

export default function MultiUploader(props: MultiUploaderProps) {
    const { isUploading, maxImageFiles, onChange, onError } = props

    const [status, setStatus] = useState<
        "default" | "compressing" | "uploading"
    >("default")
    const [files, setFiles] = useState<File[]>([])

    const compressImage = async (file: File): Promise<File> => {
        try {
            const compressedBlob = await imageCompression(file, {
                maxSizeMB: 1,
                useWebWorker: true,
            })

            const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: Date.now(),
            })

            return compressedFile
        } catch (error) {
            if (onError) onError(error as Error)

            return file
        }
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setStatus("compressing")
            const compressedFiles = await Promise.all(
                acceptedFiles.map(async (file) => await compressImage(file))
            )
            setStatus("default")

            setFiles((prevFiles) => {
                const totalFiles = prevFiles.length + compressedFiles.length

                let newFiles: File[] = []
                if (maxImageFiles && totalFiles > maxImageFiles) {
                    const remainingSlots = maxImageFiles - prevFiles.length
                    newFiles = compressedFiles
                        .filter(
                            (file) =>
                                !prevFiles.some(
                                    (prevFile) => prevFile.name === file.name
                                )
                        )
                        .slice(0, remainingSlots)
                } else {
                    newFiles = compressedFiles.filter(
                        (file) =>
                            !prevFiles.some(
                                (prevFile) => prevFile.name === file.name
                            )
                    )
                }

                const updatedFiles = [...prevFiles, ...newFiles]
                if (onChange) onChange(updatedFiles)

                return updatedFiles
            })
        },
        [maxImageFiles, onChange]
    )

    const { routeConfig } = useUploadThing("variantProductUploader", {
        onClientUploadComplete: () => {
            setStatus("default")
        },
        onUploadError: (error) => {
            if (onError) onError(error)
        },
        onUploadBegin: () => {
            setStatus("uploading")
        },
    })

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: generateClientDropzoneAccept(
            generatePermittedFileTypes(routeConfig).fileTypes
        ),
    })

    useEffect(() => {
        if (isUploading) {
            setStatus("uploading")
        } else {
            setStatus("default")
        }
    }, [isUploading])

    function renderStatus() {
        switch (status) {
            case "compressing": {
                return (
                    <span className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                        <LoadingSpinner className="mr-2 w-5 h-5" />
                        Compressing images...
                    </span>
                )
            }
            case "uploading": {
                return (
                    <span className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                        <LoadingSpinner className="mr-2 w-5 h-5" />
                        Uploading images...
                    </span>
                )
            }
            default: {
                return (
                    <>
                        <UploadIcon />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                                Click to upload
                            </span>{" "}
                            or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {files.length > 0 ? (
                                <span>{files.length} files selected</span>
                            ) : (
                                `SVG, PNG, JPG or WEBP ${
                                    maxImageFiles
                                        ? `(${maxImageFiles} max)`
                                        : ""
                                }`
                            )}
                        </p>
                    </>
                )
            }
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div
                {...getRootProps()}
                className={"flex items-center justify-center w-full"}
            >
                <input {...getInputProps()} />
                <label
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500",
                        isDragActive && "bg-gray-100"
                    )}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {renderStatus()}
                    </div>
                </label>
            </div>
            <ImagePreview images={files} />
        </div>
    )
}

function UploadIcon() {
    return (
        <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
        </svg>
    )
}
