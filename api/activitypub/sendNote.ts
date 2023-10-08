import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AP } from 'activitypub-core-types';
import * as admin from 'firebase-admin';
import { OrderedCollection } from 'activitypub-core-types/lib/activitypub/index.js';
import { sendSignedRequest } from '../../lib/activitypub/utils/sendSignedRequest.js';
import { fetchActorInformation } from '../../lib/activitypub/utils/fetchActorInformation.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

if (!admin.default.apps.length) {
  admin.default.initializeApp({
    credential: admin.default.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const db = admin.default.firestore();

/*
  Sends the latest not that hasn't yet been sent.
*/
export default async function (req: VercelRequest, res: VercelResponse) {
  const { body, query, method, url, headers } = req;
  const { token } = query;

  if (method != "GET") {
    console.log("Invalid Method, must be GET");
    res.status(401).end("Invalid Method, must be GET");
    return;
  }

  const configCollection = db.collection('config');
  const configRef = configCollection.doc("config");
  const config = await configRef.get();

  if (config.exists == false) {
    // Config doesn't exist, make something
    configRef.set({
      "sentIds": [],
      "lastEpoch": ""
    });
  }

  const configData = config.data();
  let sentIds = [];
  if (configData != undefined) {
    sentIds.push(...configData.sentIds);
    let lastEpoch = configData.lastEpoch;
    let currentEpoch = new Date().getTime();
    let elapsed = currentEpoch - lastEpoch;

    if (elapsed < process.env.POLL_MILLISECONDS) {
      console.log("Function called too often, doing nothing");
      res.status(401).end("Function is rate limited, please wait")
      return;
    }
  }

  // Get my outbox because it contains all my notes.
  const outboxResponse = await fetch('https://flear.org/outbox');
  const outbox = <OrderedCollection>(await outboxResponse.json());

  const followersCollection = db.collection('followers');
  const followersQuerySnapshot = await followersCollection.get();

  let sendingIds = new Set();

  for (const followerDoc of followersQuerySnapshot.docs) {
    const follower = followerDoc.data();
    try {
      const actorUrl = (typeof follower.actor == "string") ? follower.actor : follower.actor.id;
      const actorInformation = await fetchActorInformation(actorUrl);
      if (actorInformation == undefined) {
        // We can't send to this actor, so skip it. We should log it.
        continue;
      }

      const actorInbox = new URL(<URL>actorInformation.inbox);

      for (const iteIdx in (<AP.EntityReference[]>outbox.orderedItems)) {
        // We have to break somewhere... do it after the first.
        const item = (<AP.EntityReference[]>outbox.orderedItems)[iteIdx];
        console.log(`Checking ID ${item.id}, ${sentIds}`);
        if (!sentIds.includes(item.id)) {
          if (item.object != undefined) {
            // We might not need this.
            item.object.published = (new Date()).toISOString();
          }

          console.log(`Sending to ${actorInbox}`);

          // Item will be an entity, i.e, { Create { Note } }
          const response = await sendSignedRequest(actorInbox, <AP.Activity> item);
          console.log(`Send result: ${actorInbox}`, response.status, response.statusText, await response.text());

          sendingIds.add(item.id)
        }
      }
    } catch (ex) {
      console.log("Error", ex);
    }
  }

  sentIds.push(...sendingIds);
  configRef.set({
    "sentIds": sentIds,
    "lastEpoch": new Date().getTime()
  });

  console.log("sendNode successful")

  res.status(200).end("ok");
};
