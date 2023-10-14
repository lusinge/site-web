---
slug: new-activitypub-features-and-fixes
date: '2023-10-14T01:10:47Z'
title: New ActivityPub Features and Fixes
tags:
- Bugs
- Features
draft: false
---

We have recently implemented several new Fedipage features as well as fixed a
few critical bugs.

Here are the new features from the `CHANGELOG.md`:

* Added the ability for Mastodon instances to find the associated post when
    searching for the link in the search bar.
* Created activity and status pages for each page independent from the outbox.
* Added header link alternates specifying the dual mime type of pages.
* Now uses publication date set in post frontmatter when available otherwise
    will set the current date when sent out to followers.

And here are some of the bug fixes:

* Fixed bad id in `/followers` ActivityPub endpoint.
* In the comment section for a page if a user doesnt have a profile picture
    setup it will now default to a generic avatar rather than render text.
* Removed image alt text when rendering page comments. If an image profile link
    was broken the rendered text would not look right.
* The `activity` and `status` endpoints, when called with no extension, now
    return the correct `content-type` in header.
* Fixed a bug where notifications of newly created posts would get resent
    periodically.

This has caused us to bump the version for the next release to `v1.1.0` due to
our semantic versioning. The new version will be released shortly.
