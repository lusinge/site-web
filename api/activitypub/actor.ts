import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  const { headers } = req;

  if ("accept" in headers) {
    const accept = headers["accept"];
    if (accept != null && accept.split(",").indexOf("text/html") > -1) {
      return res.redirect(302,  `${process.env.ACTIVITYPUB_URL}`).end();
    }
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    "type": "Person",
    "id": `${process.env.ACTIVITYPUB_URL}${process.env.ACTIVITYPUB_USER.toLowerCase()}`,
    "outbox": `${process.env.ACTIVITYPUB_URL}outbox`,
    "following": `${process.env.ACTIVITYPUB_URL}following`,
    "followers": `${process.env.ACTIVITYPUB_URL}followers`,
    "inbox": `${process.env.ACTIVITYPUB_URL}inbox`,
    "preferredUsername": `${process.env.ACTIVITYPUB_USER.toLowerCase()}`,
    "name": `${process.env.ACTIVITYPUB_NAME}`,
    "summary": `${process.env.ACTIVITYPUB_SUMMARY}`,
    "icon": {
      "type": "Image",
      "mediaType": "image/png",
      "url": `${process.env.ACTIVITYPUB_URL}images/logo.png`
    },
    "publicKey": {
      "@context": "https://w3id.org/security/v1",
      "@type": "Key",
      "id": `${process.env.ACTIVITYPUB_URL}${process.env.ACTIVITYPUB_USER.toLowerCase()}#main-key`,
      "owner": `${process.env.ACTIVITYPUB_URL}${process.env.ACTIVITYPUB_USER.toLowerCase()}`,
      "publicKeyPem": process.env.ACTIVITYPUB_PUBLIC_KEY
    }
  });
}
