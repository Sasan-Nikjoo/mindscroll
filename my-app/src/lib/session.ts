import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions = {
    password: "complex_password_at_least_32_characters_long",
    cookieName: "mindscroll_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession() {
    const cookieStore = await cookies();
    // specific fix: add "as any" to silence the type error
    return getIronSession(cookieStore as any, sessionOptions);
}