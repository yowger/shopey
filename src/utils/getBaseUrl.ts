export default function getBaseUrl() {
    if (typeof window !== "undefined") {
        return ""
    } else if (process.env.VERCEL_URL) {
        return `https://${process.env.DOMAIN_URL}`
    }

    return process.env.LOCAL_URL || "http://localhost:3000"
}
