# Changelog

## 2.2.0

* When a post has an `image_header` parameter this image is set as an attachment
    to ActivityPub posts
* Fixed some poor CSS rendering for quote-box.
* The `figure` shortcode will now make images clickable to see the full size.
* The tags page now renders categories as the the title instead of the slug
    name.
* Added additional argument to `example` shortcode to turn off the copy button.
* Fixed pseudocode not rendering properly due to element `p` overflow setting.
* Added the ability for the `git-heatmap` to combine activity from multiple
    sources.

## 2.1.0

* Card shortcode will not longer render the horizontal rule when there is no
    bottom text to render.
* Added several shortcodes and CSS for rendering info-fields, for example for
    contact info. See `info-entry.html`, `info-field.html`, `info-key.html` and
    `info-value.html` under the `/layouts/shortcodes/` directory.
* Added the `container-split` short code which will split a container into two
    columns.
* Removed significant portions of unused CSS to load quicker.
* Improved responsive aspects of the CSS.
* Several root settings in `/hugo.toml` were being overridden such as `paginate`
    these should now be fixed.
* Fixed the CSS so the `navbar` wont overflow under very low resolutions.
* Fixed certain text inside `<p>` tags overflowing and distorting the layout.
* Updated CSS for `blockquote` and fonts to be more readable.
* Added additional parameter to `tab` shortcode allowing the `copy` button to be
    hidden.

## 2.0.0

* Removed content folder and moved out the Fedipage site into a separate repo.
    This should make it easier for people who use this site to update from the
    upstream here without needing to worry about conflicts due to content.
* Fixed links at the bottom of posts that direct people to the gitlab page for
    the post.
* Card shortcodes no longer need to be linkable. By leaving the url argument as
    an empty string it will not render as a clickable link.
* Fixed microblog submenu so it no longer extends past bottom of the page.
* Made `/layout/top_list_generic` site generic, it no longer mentions Fedipage.
* Made the `/layout/menu/html` dynamic so now there is no need to edit it when
    you customize sections.
* Created type `page` and moved `/content/_index.md` to be that type. This
    breaks backwards compatibility therefore we must bump major version
    according to semantic versioning.
* Minor improvement to CSS so `page` types dont get clipped by the menu header.
* Added a container shortcode for use on `page` types to get left and right
    margins.
* Adding new sections is now almost completely dynamic and requires much less
    modification of code. See updated `README.me`.
* Added MathJax support for rendering Latex and math.
* Added support for PseudocodeJS for rendering beautiful, standard, pseudocode.
* Table of contents will now render if frontmatter `toc` is set to `true`.
* Fixed a bug where backslashes in the summary of a post could break ActivityPub
    JSON endpoints.
* Fixed the paginator next and previous links, they were assigned backwards.
* Added a shortcode to render a GitLab based activity heatmap calander.
* Added `cal-heatmap` support along with `D3.js` and several related extensions.
* Opened up CORS headers since a static site shouldnt need any CORS protections.
* Added a `quote-box` shortcode useful for displaying pretty quotes.
* Improved the `tabs` shortcode so the title can be left off and it wont render
    a black empty square.

## 1.1.0

* Added the ability for Mastodon instances to find the associated post when
    searching for the link in the search bar.
* Fixed bad id in `/followers` ActivityPub endpoint.
* Created activity and status pages for each page independent from the outbox.
* Added header link alternates specifying the dual mime type of pages.
* In the comment section for a page if a user doesnt have a profile picture
    setup it will now default to a generic avatar rather than render text.
* Removed image alt text when rendering page comments. If an image profile link
    was broken the rendered text would not look right.
* The `activity` and `status` endpoints, when called with no extension, now
    return the correct `content-type` in header.
* Fixed a bug where notifications of newly created posts would get resent
    periodically.
* Now uses publication date set in post frontmatter when available otherwise
    will set the current date when sent out to followers.

## 1.0.1

* Summary text in ActivityPub Posts did not properly render new lines and other
    formatting. It should now render most basic formatting properly.

## 1.0.0

* Initial release
