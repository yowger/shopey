import Image from "next/image"
import { useEffect, useState } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ImagePreviewProps {
    images: File[]
    onImageChange?: (images: File[]) => void
    onImageDelete?: (id: number) => void
}

export default function ImagePreview(props: ImagePreviewProps) {
    const { images = [], onImageDelete } = props
    const [imageURLs, setImageURLs] = useState<string[]>([])

    useEffect(() => {
        const urls = images.map((image) => URL.createObjectURL(image))
        setImageURLs(urls)

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [images])

    function handleImageDelete(id: number) {
        if (onImageDelete) onImageDelete(id)
    }

    if (images.length === 0) return null

    return (
        <div className="flex gap-3 relative flex-wrap">
            {imageURLs.map((url, index) => {
                const key = `variant-image-${index}`

                return (
                    <div
                        key={key}
                        className="group relative flex w-[75px] h-[75px] rounded-md overflow-hidden"
                    >
                        <Image
                            src={url}
                            alt={images[index].name}
                            width={75}
                            height={75}
                            className="h-full w-full object-cover"
                        />
                        <Button
                            onClick={(event) => {
                                event.preventDefault()
                                handleImageDelete(index)
                            }}
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 absolute top-1 right-1 bg-gray-900/25 hover:bg-gray-900 duration-200 w-6 h-6 p-0 rounded-full"
                        >
                            <X className="w-4 h-4 text-white" />
                        </Button>
                    </div>
                )
            })}
        </div>
    )
}
