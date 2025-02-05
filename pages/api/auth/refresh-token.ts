import { NextApiRequest, NextApiResponse } from 'next';
import nc from "next-connect";
import jwt from 'jsonwebtoken';
import { postRefreshToken } from '../../../lib/types/helpers/backendHelpers';

const TokenIsExpired = (token: string | undefined): boolean => {
    if (!token) return true;

    try {
        const decoded: DecodedToken | null = jwt.decode(token) as DecodedToken;
        if (!decoded || typeof decoded.exp !== 'number') return true;

        return Date.now() > decoded.exp * 1000;
    } catch (err) {
        console.error('Error decoding token:', err);
        return true;
    }
};

interface DecodedToken {
    exp?: number;
    [key: string]: any;
}

const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const userInfoCookie = req.cookies.userInfo;
    if (!userInfoCookie) {
        return res.status(401).json({ error: "No userInfo provided" });
    }

    const userInfo = JSON.parse(userInfoCookie);
    const { access_token, refresh_token } = userInfo || {};

    // Vérifier si le refresh token est aussi expiré
    if (TokenIsExpired(refresh_token)) {
        res.setHeader('Set-Cookie', 'userInfo=; Path=/; Max-Age=0;');
        return res.status(401).json({ error: "Session expired" });
    }

    try {
        const response = await postRefreshToken({ refresh: refresh_token });
        const newAccessToken = response?.access;
        const newRefreshToken = response?.refresh;

        if (!newAccessToken) {
            throw new Error("Failed to refresh token.");
        }

        userInfo.access_token = newAccessToken;
        userInfo.refresh_token = newRefreshToken;

        res.setHeader('Set-Cookie', `userInfo=${encodeURIComponent(JSON.stringify(userInfo))}; Path=/; Max-Age=5184000; SameSite=Strict; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`);

        return res.status(200).json({ userInfo:userInfo });
    } catch (error) {
        console.error(error);
        res.setHeader('Set-Cookie', 'userInfo=; Path=/; Max-Age=0;');
        return res.status(401).json({ error: "Failed to refresh token" });
    }
});

export default handler;
