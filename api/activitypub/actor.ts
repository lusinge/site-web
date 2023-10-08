import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  const { headers } = req;

  if ("accept" in headers) {
    const accept = headers["accept"];
    if (accept != null && accept.split(",").indexOf("text/html") > -1) {
      return res.redirect(302, "https://flear.org/").end();
    }
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", `application/activity+json`);
  res.json({
    "@context": ["https://www.w3.org/ns/activitystreams", { "@language": "en- GB" }],
    "type": "Person",
    "id": "https://flear.org/flear",
    "outbox": "https://flear.org/outbox",
    "following": "https://flear.org/following",
    "followers": "https://flear.org/followers",
    "inbox": "https://flear.org/inbox",
    "preferredUsername": "flear",
    "name": "FLEAR (Free & Libre Engineers for Amateur Radio)",
    "summary": "FLEAR is non-profit promoting open-source and open-standards in Amateur Radio",
    "icon": {
      "type": "Image",
      "mediaType": "image/png",
      "url": "https://flear.org/images/logo.png"
    },
    "publicKey": {
      "@context": "https://w3id.org/security/v1",
      "@type": "Key",
      "id": "https://flear.org/flear#main-key",
      "owner": "https://flear.org/flear",
      "publicKeyPem": process.env.ACTIVITYPUB_PUBLIC_KEY
    }
  });
}
