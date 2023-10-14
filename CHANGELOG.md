# Changelog

## 1.1.0

* Added the ability for Mastodon instances to find the associated post when
    searching for the link in the search bar.
* Fixed bad id in `/followers` ActivityPub endpoint.
* Created activity and status pages for each page independent from the outbox.
* Added header link alternates specifying the dual mime type of pages.
* In the comment section for a page if a user doesnt have a profile picture
    setup it will now default to a generic avatar rather than render text.
* Removed image alt text when rendering page comments. If an image profile link
    wqs broken the rendered text would not look right.
* The `activity` and `status` endpoints, when called with no extension, now
    return the correct `content-type` in header.
* Fixed a bug where notifications of newly created posts would get resent
    periodically.

## 1.0.1

* Summary text in ActivityPub Posts did not properly render new lines and other
    formatting. It should now render most basic formatting properly.

## 1.0.0

* Initial release
