import { NextApiRequest, NextApiResponse } from 'next';
import nc from "next-connect";
import { checkSession } from '../../../lib/types/helpers/backendHelpers';

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const userInfoCookie = req.cookies.userInfo;
    if (!userInfoCookie) {
        return res.status(401).json({ error: "No userInfo provided" });
    }

    const userInfo = JSON.parse(userInfoCookie);
    const { access_token } = userInfo || {};

    // Check if the access token exists
    if (!access_token) {
        return res.status(401).json({ error: "Access token is missing" });
    }

    try {
        // Check if the session is active using the access token
        const response = await checkSession({}, access_token);

        if (!response?.session_active) {
            return res.status(401).json({ error: "Session expired" });
        }

        return res.status(200).json({ session_status: response?.session_active });
    } catch (error) {
        console.error("Error checking session:", error);
        return res.status(500).json({ error: "Failed to check session" });
    }
});

export default handler;
