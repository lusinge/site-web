# Changelog

## 1.0.2

* Fixed bad id in `/followers` ActivityPub endpoint.
* Created activity and status pages for each page independent from the outbox.
    This should enable searches for specific posts to work rather than simply
    pointing to the main user.
* In the comment section for a page if a user doesnt have a profile picture
    setup it will now default to a generic avatar rather than render text.

## 1.0.1

* Summary text in ActivityPosts did not properly render new lines and other
    formatting. It should now render most basic formatting properly.

## 1.0.0

* Initial release
