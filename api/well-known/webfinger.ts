import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  const { resource } = req.query;
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/jrd+json`);
  res.end(`{  
    "subject": "acct:flear@flear.org",
    "aliases": [
      "https://qoto.org/@flear"
    ],
    "links": [
      {
        "rel": "self",
        "type": "application/activity+json",
        "href": "https://flear.org/flear"
      }
    ]
  }`);
}
