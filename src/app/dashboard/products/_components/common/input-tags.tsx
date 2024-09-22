import { forwardRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import type { ChangeEvent, KeyboardEvent } from "react"
import { XIcon } from "lucide-react"

interface InputTagsProps {
    tags?: string[]
    onChange?: (tags: string[]) => void
    placeholder?: string
    maxTags?: number
}

const InputTags = forwardRef<HTMLInputElement, InputTagsProps>((props, ref) => {
    const { tags: initialTags = [], maxTags, placeholder, onChange } = props

    const [tags, setTags] = useState<string[]>(initialTags)
    const [inputValue, setInputValue] = useState("")
    const hasReachedMaxTags = maxTags && tags.length >= maxTags

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value)
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        const { key } = event

        if (key === "Enter" || key === ",") {
            event.preventDefault()

            const trimmedValue = inputValue.trim()

            if (trimmedValue) {
                addTag(trimmedValue)
                setInputValue("")
            }
        }

        if (key === "Backspace" && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1)
        }
    }

    function addTag(tag: string) {
        const isUniqueTag = tag && !tags.includes(tag)
        const hasReachedMaxTags = !maxTags || tags.length < maxTags

        if (isUniqueTag && hasReachedMaxTags) {
            const updatedTags = [...tags, tag]
            setTags(updatedTags)

            if (onChange) {
                onChange(updatedTags)
            }
        }
    }

    function removeTag(index: number) {
        const updatedTags = tags.filter((_tags, i) => i !== index)
        setTags(updatedTags)

        if (onChange) {
            onChange(updatedTags)
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                    {tag}

                    <button
                        className="w-3 ml-1"
                        onClick={() => removeTag(index)}
                    >
                        <XIcon className="w-3.5" />
                    </button>
                </Badge>
            ))}
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ""}
            />
            {hasReachedMaxTags && (
                <p className="text-sm text-muted-foreground">
                    You have reached the maximum of {maxTags} tags
                </p>
            )}
        </div>
    )
})

InputTags.displayName = "InputTags"

export default InputTags
