# Changelog

## 1.1.0

* Fixed bad id in `/followers` ActivityPub endpoint.
* Created activity and status pages for each page independent from the outbox.
    This should enable searches for specific posts to work rather than simply
    pointing to the main user.
* Added header link alternates specifying the dual mime type of pages. This
    should further help with searching for pages as AP status.
* In the comment section for a page if a user doesnt have a profile picture
    setup it will now default to a generic avatar rather than render text.
* Removed image alt text when rendering page comments. If an image profile link
    wqs broken the rendered text would not look right.

## 1.0.1

* Summary text in ActivityPosts did not properly render new lines and other
    formatting. It should now render most basic formatting properly.

## 1.0.0

* Initial release
