import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function (req: VercelRequest, res: VercelResponse) {
  const { resource } = req.query;
  res.statusCode = 200;
  res.setHeader("Content-Type", `application/jrd+json`);
  const apDomain = (new URL(`${process.env.ACTIVITYPUB_URL}`)).hostname;
  let apAlias;
  if( process.env.ACTIVITYPUB_URL_ALIAS && process.env.ACTIVITYPUB_USER_ALIAS ) {
    apAlias = `${process.env.ACTIVITYPUB_URL_ALIAS}${process.env.ACTIVITYPUB_USER_ALIAS.toLowerCase()}`;
  } else {
    apAlias = ""
  }
  res.end(`{
    "subject": `acct:${process.env.ACTIVITYPUB_USER.toLowerCase()}@${apDomain}`,
    "aliases": [
      `${apAlias}`
    ],
    "links": [
      {
        "rel": "self",
        "type": "application/activity+json",
        "href": `${process.env.ACTIVITYPUB_URL}${process.env.ACTIVITYPUB_USER.toLowerCase()}`
      }
    ]
  }`);
}
