import {
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Italic,
    List,
    ListOrdered,
} from "lucide-react"
import StarterKit from "@tiptap/starter-kit"
import { useEditor, EditorContent } from "@tiptap/react"

import { Toggle } from "@/components/ui/toggle"

import type { Editor } from "@tiptap/react"
import type { Level } from "@tiptap/extension-heading"
import type { LucideIcon } from "lucide-react"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    tabIndex?: number | undefined
}

export default function RichTextEditor(props: RichTextEditorProps) {
    const { tabIndex = undefined, value, onChange } = props

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                listItem: {
                    HTMLAttributes: {
                        class: "not-prose",
                    },
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const content = editor.getHTML()
            onChange(content)
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg min-h-20 w-full min-w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="border-input border rounded-md">
                <ToggleBold editor={editor} />
                <ToggleItalic editor={editor} />
                <ToggleBulletList editor={editor} />
                <ToggleOrderedList editor={editor} />
                <ToggleHeading editor={editor} level={1} Icon={Heading1} />
                <ToggleHeading editor={editor} level={2} Icon={Heading2} />
                <ToggleHeading editor={editor} level={3} Icon={Heading3} />
                <ToggleHeading editor={editor} level={4} Icon={Heading4} />
                <ToggleHeading editor={editor} level={5} Icon={Heading5} />
                <ToggleHeading editor={editor} level={6} Icon={Heading6} />
            </div>
            <EditorContent tabIndex={tabIndex} editor={editor} />
        </div>
    )
}

interface ToggleProps {
    editor: Editor
}

function ToggleBold(props: ToggleProps) {
    const { editor } = props

    const isActive = editor.isActive("bold")

    function toggleBold() {
        editor.chain().focus().toggleBold().run()
    }

    return (
        <Toggle pressed={isActive} onPressedChange={toggleBold} size="sm">
            <Bold className="w-4 h-4" />
        </Toggle>
    )
}

function ToggleItalic(props: ToggleProps) {
    const { editor } = props

    const isActive = editor.isActive("italic")

    function toggleItalic() {
        editor.chain().focus().toggleItalic().run()
    }

    return (
        <Toggle pressed={isActive} onPressedChange={toggleItalic} size="sm">
            <Italic className="w-4 h-4" />
        </Toggle>
    )
}

function ToggleBulletList(props: ToggleProps) {
    const { editor } = props

    const isActive = editor.isActive("bulletList")

    function toggleBulletList() {
        editor.chain().focus().toggleBulletList().run()
    }

    return (
        <Toggle pressed={isActive} onPressedChange={toggleBulletList} size="sm">
            <List className="w-4 h-4" />
        </Toggle>
    )
}

function ToggleOrderedList(props: ToggleProps) {
    const { editor } = props

    const isActive = editor.isActive("orderedList")

    function toggleOrderedList() {
        editor.chain().focus().toggleOrderedList().run()
    }

    return (
        <Toggle
            pressed={isActive}
            onPressedChange={toggleOrderedList}
            size="sm"
        >
            <ListOrdered className="w-4 h-4" />
        </Toggle>
    )
}

interface ToggleHeading extends ToggleProps {
    level: Level
    Icon: LucideIcon
}

function ToggleHeading(props: ToggleHeading) {
    const { editor, level, Icon } = props

    const isActive = editor.isActive("heading", { level })

    function toggleHeading() {
        editor.chain().focus().toggleHeading({ level }).run()
    }

    return (
        <Toggle pressed={isActive} onPressedChange={toggleHeading} size="sm">
            <Icon className="w-4 h-4" />
        </Toggle>
    )
}
