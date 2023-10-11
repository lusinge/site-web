---
slug: fedipage-v1-released
date: '2023-10-11T16:13:05Z'
title: Fedipage, ActivityPub for Static Sites, has Released v1
tags:
- Release
draft: false
---

The moment you have all been waiting for, v1 of Fedipage has just been released.
This is our first version, so consider it as a beta, but it is fully functional.

You can find the release on our GitLab here:
https://git.qoto.org/fedipage/fedipage/-/tags/v1.0.0

Here is what we have accomplished so far:

* Moved almost all site-specific stuff into configuration variables to make form
    easier install.
* Organized the layouts/partials so that it is very easy to update the
    the templates.
* Requires Vercel and Firebase for *full* ActivityPub support but will provide
    limited support as a purely static site as well. Limited support means the
    account can be seen, and its posts, but following wont be confirmed.
* Wrote detailed step-by-step install instructions to make it easy for everyone.
* Supports the following ActivityPub features:
** Following confirmation
** Notifications in your feed when new posts are made
** The various pages show content from the fediverse interacting with it like
     reboosts, likes, and even replies which show up as comments on the page.
* Tags are supported with a few options:
** Tags can be configured to automatically be added to every post.
** The tags added int he front-matter of a post can be added as fedivese tags.
     This can be set independently of any default tags.
** Tags can be rendered invisibly, not showing in the text of the post on the
     fediverse yet still contain the tag metadata for searches
* An ActivityPub alias can be set if you have other accounts across the
    fediverse. The alias can also allow you to migrate existing followers to
    the web page (untested, proceed at your own risk).
* Microblog side-panel can be configured to show content from your alias
    fediverse account.
* Multiple categories of blogs can be handled simultaniously and categorized and
    tagged independently.
* Front page is constructed from markdown and broken up into short codes. So
    the front page can be modified without touching the html.
