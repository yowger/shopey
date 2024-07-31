import { auth } from "@/server/auth"

export default async function page() {
    const session = await auth()

    return <div>page</div>
}
