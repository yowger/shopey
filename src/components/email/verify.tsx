import { Html, Heading, Text, Container } from "@react-email/components"

interface VerifyEmailTemplateProps {
    username: string
    otpCode: string
}

export default function VerifyEmailTemplate(props: VerifyEmailTemplateProps) {
    const { username, otpCode } = props

    return (
        <Html lang="en">
            <Container style={styles.container}>
                <Heading style={styles.heading}>Verify Your Email</Heading>
                <Text style={styles.text}>Hi {username},</Text>
                <Text style={styles.text}>
                    Your OTP code is <strong>{otpCode}</strong>. Please enter
                    this code to verify your email address.
                </Text>
                <Text style={styles.text}>
                    If you didn’t request this email, please ignore it.
                </Text>
            </Container>
        </Html>
    )
}

const styles = {
    container: {
        padding: "20px",
        fontFamily: "'Arial', sans-serif",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    text: {
        fontSize: "16px",
        lineHeight: "24px",
        marginBottom: "16px",
    },
}
