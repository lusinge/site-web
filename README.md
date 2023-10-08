## Generate Activity Pub key

```bash
npm install ts-node typescript '@types/node'
./node_modules/.bin/ts-node --esm generateKeys.mts
```

## Setup firebase

Setup the things

## Setup Vercel

Setup the things

## Trigger post deploy

```
curl -G -X POST --data-urlencode token="<token>" https://flear.org/send-note
```

# License

This project (excluding post content itself) is released under the Apache License v2

# Notes to reconcile later

* Set configuration in /hugo.toml (defaults are in /config/* dont touch)
* Set Gitlab CI ENV variables:
** VERCEL_ORG_ID
** VERCEL_PROJECT_ID
** VERCEL_TOKEN (mask this and make it availible to only protected)
** VERCEL_SCOPE (set to vercel team id, find with `vercel team ls` after creating)
