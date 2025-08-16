import { google } from "googleapis";

export async function readEmails(emailAddress, refreshToken, accessToken, subject) {
  try {
    const oAuth2Client = new google.auth.OAuth2(
       process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    let emails = [];
    let nextPageToken = null;

    // Gmail search query for subject
    const searchQuery = `subject:"${subject}"`;

    do {
      const listRes = await gmail.users.messages.list({
        userId: "me",
        labelIds: ["INBOX"],
        maxResults: 500, // max allowed
        pageToken: nextPageToken || undefined,
        q: searchQuery, // filter by subject
      });

      const messages = listRes.data.messages || [];

      for (const msg of messages) {
        const msgData = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "full",
        });

        const payload = msgData.data.payload;
        const headers = payload.headers || [];

        const from = headers.find(h => h.name.toLowerCase() === "from")?.value || "";
        const msgSubject = headers.find(h => h.name.toLowerCase() === "subject")?.value || "";
        const date = headers.find(h => h.name.toLowerCase() === "date")?.value || "";

        let body = "";
        if (payload.parts) {
          const part = payload.parts.find(p => p.mimeType === "text/plain");
          if (part?.body?.data) {
            body = Buffer.from(part.body.data, "base64").toString("utf-8");
          }
        } else if (payload.body?.data) {
          body = Buffer.from(payload.body.data, "base64").toString("utf-8");
        }

        emails.push({
          id: msg.id,
          threadId: msg.threadId,
          from,
          subject: msgSubject,
          to:emailAddress,
          date,
          body,
        });
      }

      nextPageToken = listRes.data.nextPageToken;
    } while (nextPageToken);

    console.log(`Fetched ${emails.length} emails for ${emailAddress} with subject "${subject}"`);
    return emails;
  } catch (error) {
    console.error(`Error reading emails for ${emailAddress}:`, error.message);
    return [];
  }
}
