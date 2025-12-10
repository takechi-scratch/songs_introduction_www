import { google } from "googleapis";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    const cookieStore = await cookies();
    const savedState = cookieStore.get("oauth_state")?.value;
    const firebaseToken = cookieStore.get("firebase_auth_token")?.value;

    if (!code) {
        return NextResponse.redirect(new URL("/admin/service-account/?status=error", req.url));
    }

    // CSRF対策: stateを検証
    if (!state || !savedState || state !== savedState) {
        return NextResponse.redirect(
            new URL("/admin/service-account/?status=unauthorized", req.url)
        );
    }

    // Firebaseトークンの確認
    if (!firebaseToken) {
        return NextResponse.redirect(
            new URL("/admin/service-account/?status=unauthorized", req.url)
        );
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID!,
        process.env.GOOGLE_CLIENT_SECRET!,
        `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/service-account/callback/`
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // バックエンドAPIにYouTubeトークンとチャンネル情報を送信
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    const backendResponse = await fetch(`${apiBaseUrl}/admin/update-refresh-token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
            token: tokens.refresh_token,
        }),
    });

    if (!backendResponse.ok) {
        if (backendResponse.status === 403) {
            return NextResponse.redirect(
                new URL("/admin/service-account/?status=forbidden", req.url)
            );
        }
        return NextResponse.redirect(new URL("/admin/service-account/?status=error", req.url));
    }

    const result: { status: string } = await backendResponse.json();

    if (result.status !== "success") {
        return NextResponse.redirect(new URL("/admin/service-account/?status=error", req.url));
    }

    // 成功後、使用済みのcookieをクリア
    const successResponse = NextResponse.redirect(
        new URL("/admin/service-account/?status=success", req.url)
    );
    successResponse.cookies.delete("oauth_state");
    successResponse.cookies.delete("firebase_auth_token");

    return successResponse;
}
