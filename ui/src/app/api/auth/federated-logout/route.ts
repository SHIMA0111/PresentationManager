import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (!token || !token.idToken) {
        return NextResponse.json(
            { error: "No session present" },
            { status: 400 }
        );
    }

    const endSessionEndpoint = new URL(`${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`);

    const params = new URLSearchParams({
        id_token_hint: token.idToken as string,
        post_logout_redirect_uri: process.env.KEYCLOAK_POST_LOGOUT_REDIRECT_URI as string,
    });

    endSessionEndpoint.search = params.toString();

    return NextResponse.json({ url: endSessionEndpoint.href });
}