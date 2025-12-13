import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const firebaseToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!firebaseToken) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // CSRF対策用のランダムなstate生成
    const csrfState = crypto.randomUUID();

    // stateをcookieに保存（検証用）
    const response = NextResponse.json({ authUrl: generateAuthUrl(csrfState) });

    response.cookies.set("oauth_state", csrfState, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 120, // 2分
        path: "/",
    });

    response.cookies.set("firebase_auth_token", firebaseToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 120, // 2分
        path: "/",
    });

    return response;
}

function generateAuthUrl(state: string): string {
    const redirectUri = `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/service-account/callback/`;

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "https://www.googleapis.com/auth/youtube.force-ssl",
        access_type: "offline",
        prompt: "consent",
        state: state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
