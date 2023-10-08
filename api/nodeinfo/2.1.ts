import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/json`);
  res.json({
    "version": "2.1",
    "software": {
      "name": "flear.org",
      "repository": "https://git.qoto.org/flear/flear-site",
      "homepage": "https://flear.org/",
        "version": "0.0.1"
    },
    "protocols": [
      "activitypub"
    ],
    "services": {
      "inbound": ["atom1.0", "rss2.0"],
      "outbound": ["atom1.0", "rss2.0"]
    },
    "openRegistrations": false,
    "usage": {
      "users": {
        "total": 1,
        "activeHalfyear": 1,
        "activeMonth": 1
      }
    },
    "metadata": {
      "nodeName": "flear.org"
    }
  });
}
