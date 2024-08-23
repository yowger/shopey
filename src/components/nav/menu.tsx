import type { Session } from "next-auth"

interface MenuProps {
    session: Session
}

export default function Menu(props: MenuProps) {
    const { session } = props

    if(session) {
        return session.user?.name
    }

    return <div>menu</div>
}
