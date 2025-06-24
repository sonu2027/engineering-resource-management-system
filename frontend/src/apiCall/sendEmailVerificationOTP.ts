async function sendEmailVerificationOTP(email: string): Promise<number> {
    const OTP = Math.floor(Math.random() * 9000) + 1000;
    console.log("Generated code: ", OTP);

    const data = { OTP, email };

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/sendemailverificationotp`,
            {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg || "Failed to send OTP");
        }

        return OTP;
    } catch (error) {
        throw new Error("Something went wrong while sending OTP");
    }
}

export { sendEmailVerificationOTP }