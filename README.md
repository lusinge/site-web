# License

This project (excluding post content itself) is released under the Apache License v2

# Fresh install

## Changing Default Sections

By default this site contains the following three blog sections: `news`,
`projects`, and `resource`. Unfortunately the sections arent easily configurable
just yet.

### Renaming

1. Modify `./clean-build.cjs` at the bottom of the file to include the name of
the new section.
1. Change or create a new directory for section content under
`/content/<new_section>`

## Update /hugo.toml

You can use `/hugo.toml.example` as a starting point. Copy this file (dont move
it) to `/hugo.toml` and then edit it.

This is the main configuration file. All of the setting in this file need to be
set. There are other settings, the defaults, set in /config/hugo.toml, there is
no need to touch this file, only the settings int he configuration at the root.

For some of the values in this file you can leave the defaults, but for most
the values will need to be updated to match your site.

The file is commented to help understand the various variables.

## Setup Firebase

First go to Firebase and sign up for an account here:
https://console.firebase.google.com/

Then go to create new project, select a unique project name, follow the prompts
and it will generate a project space for you. The only service you care about
though is Firebase so from the dashboard select Firebase and then click the
"create database" button. When prompted make sure you choose production server
and not test. Withing a few minutes you should have a Firebase instance ready.

Next all that is left is to get your API access info which we will use later.

To start go to your `project settings` and under the `General` tab you should
see a field labeled `Project ID`. Save this for later.

Next go to the `Service Accounts` tab and select `Generate new private key`.
This will download a json file containing your keys. In the JSON open it up and
find the value of the `private_key` field, and the `client_email` field These
will be used later.

Firebase should now be ready to go! You can come back here to see the DB
populate once the app starts running.

## Setup Vercel

First go to the Vercel website and create a team to use when deploying if you'd
like. This will be used in the next step during linking, be sure to use this
team.

Then from the root of the project run the following:

```bash
vercel login
vercel link
```

When asked to "link to existing project" select no since this is your first time
deploying.

This will then build and upload your project. It may take a few minutes. You may
see the following error in the end `Error: Failed to detect project settings.
Please try again`. If you see it but there are no other errors then it probably
worked. Check your dashboard at Vercel.com and you should see an empty project
was created.

After it is created you have to first make sure you updated `/clean-build.cjs`,
if you changed the name or number of any of the sections. If not make that
change now. Finally go to the settings for the newly created project and in the
general section add the following as an "override" to the build command:

```bash
hugo --gc && node clean-build.cjs
```

This is a huge hack but the only solution I could find, if someone has a better
way to do this please let me know or submit a PR.

### Populate Vercel Env Variables

Next go to your Vercel dashboard then navigate to to your new project. In the
settings tab there should be an `Environment Variables` section. Here is where
we will populate those.

First generate your public and private keys used for ActivityPub. It is
important you dont loose these as they identify your site. So save them.

```bash
npm install ts-node typescript '@types/node'
./node_modules/.bin/ts-node --esm generateKeys.mts
```

We will use these keys to set the values in the next step.

Now lets set the environment values to be used in Vercel (this mostly only effect the stuff under /api).

* POLL_MILLISECONDS: Set to 250000 or higher. This sets the minimum wait time between calls to the send-note endpoint. You may wish to adjust the cronjob in vercel.json as well.
* ACTIVITYPUB_PRIVATE_KEY: Get this value from generating the keys in the previous step. Note: When you paste in the key vercel will warn about newlines, you must ignore the warning.
* ACTIVITYPUB_PUBLIC_KEY: Get this value from generating the keys in the previous step. Note: When you paste in the key vercel will warn about newlines, you must ignore the warning.
* FIREBASE_PRIVATE_KEY: The value from earlier when setting up Firebase contained in the json. This is **not** the same as the ACTIVITYPUB_PRIVATE_KEY we generated a moment ago.
* FIREBASE_CLIENT_EMAIL: The value from earlier when setting up Firebase contained in the json
* NEXT_PUBLIC_FIREBASE_PROJECT_ID: The value shown in Firebase from the easlier step.
* ACTIVITYPUB_URL: This should be the same as the `BaseURL` setting for your sight. For example `https://fedipage.com/`. The trailing slash is very important dont forget it.
* ACTIVITYPUB_USER: The username of the ActivityPub user. This can have any capitalization you want and will be made lower when needed.
* ACTIVITYPUB_ALIAS: Optional if you dont want to set it. This should be a url to a fediverse account you want to designate as an alias. For example `https://qoto.org/@fedipage`
* ACTIVITYPUB_NAME: The full display name of the ActivityPub user. It can contain spacing and punctuation.
* ACTIVITYPUB_SUMMARY: The ActivityPub summary for the user. It appears right under their handle usually

Finally open the `/vercel.json` file and find the line that has `/fedipage` on it and change that to the name of your user ActivityPub username (apUser), but in all lowercase.

### Configure domains

In the project settings go to the Domains section. Here you can add custom domains and it shows you how to configure them. These steps shouldnt effect the source code.

## Setup Gitlab CI

First look at the content of the `/.vercel/project.json` file, this was created earlier from the `vercel link` command. This contains the org id and project id values. We will set these in GitLab's CI.

Go to your GitLab project and find the settings on CI/CD and under there you will find variables. Here we will add a few relevant variables.

* VERCEL_ORG_ID: Get this from `/.vercel/project.json` under orgId
* VERCEL_PROJECT_ID: Get this from `/.vercel/project.json` under projectId
* VERCEL_TOKEN: This can be generated under your vercel's account settings under the token submenu. Mask this and make it availible to only protected.
* VERCEL_SCOPE: Set to vercel team id you want to use, find with `vercel team ls` after the team is created, or if it already exists.

## Customize your content

The content directory is currently empty to make it easier for projects to maintain updates. If you need an example of a working content directory see our live page's content here [https://git.qoto.org/fedipage/fedipage/-/tree/master/content](https://git.qoto.org/fedipage/fedipage/-/tree/master/content).

Make sure to do the following:

* Add a `/content/_index.md`, see the example above for the format of shortcodes for use in the index.
* Modify /layouts/partials/top_list_* to represent the section titles you want to use.
* Add a folder for each section you configured (by default `news`, `projects`, and `resource`) and fill it with content.

### Microblog Side Menu

We also need to configure the sidebar's microblog to point to your alias account. If you dont have one you may want to disable this entirely.

It is pretty simpler first just go here and fill out the form: https://www.mastofeed.com/ . Feel free to set the UI scale to whatever you want but I find 80 works best. Also select the light theme to it matches. Make sure you uncheck show header as well. Finally set the width to a value of 100%.

Just copy and paste the iframe result into the /layouts/partials/microblog_iframe.html

## Final steps

All that is left now is to push your code to your GitLab repo. At that point the .gitlab-ci.yaml file should automatically do the rest. After a few minutes you should have a running static site with full ActivityPub support. Enjoy.

# Development

Please see the `CONTRIBUTING.md` file for instructions regarding development and contribution.
