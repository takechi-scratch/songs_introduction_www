import { adminAuth } from "@/lib/auth/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        // カスタムクレームで管理者チェック
        if (decodedToken.admin !== true) {
            return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
        }

        revalidateTag("songs-all");
        const body = await request.json();
        for (const songID of body.songIDs) {
            revalidateTag(`song-${songID}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Token verification failed:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
