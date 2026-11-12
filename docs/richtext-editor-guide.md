# RG Rich Text Tools — Editor guide

Version 1.0.0

## How it works

Write your content in Webflow's normal Rich Text editor. Use its built-in tools for headings, paragraphs, bold, italic, links, images, bulleted lists and numbered lists.

Use the markers below for additional formatting. The markers remain visible while editing and are converted on the published site. Custom code must be enabled wherever you preview the result; the Designer editing canvas is not the formatted preview.

The processor works on every native Webflow Rich Text element, including existing components and CMS content. Content without markers keeps its existing appearance. A regular text block or a plain-text prop is not a Rich Text element.

For the site's prepared typography, use the existing Text Section / Rich Text components. Designers can apply the existing `text-rich-text` class to a new standalone Rich Text element; editors do not need to use the Style panel. The script does not replace existing typography classes.

## 1. Format words or a sentence: text

Put the opening and closing markers inside the same paragraph, heading, caption or list item.

```text
Vos données restent [[text color="rg"]]confidentielles[[/text]].
```

Combine settings inside one opening marker:

```text
[[text color="#004F85" size="20px" size-mobile="1rem" underline="true"]]Information importante[[/text]]
```

| Setting | Accepted values | Example |
| --- | --- | --- |
| `color` | A registered palette name or a six-digit HEX code from the table below | `color="rg"` or `color="#004F85"` |
| `size` | Non-negative `px`, `rem`, or `0` | `size="20px"`, `size="1.25rem"` |
| `size-mobile` | Optional mobile font size | `size-mobile="16px"` |
| `underline` | `true` to add an underline; `false` adds no extra underline | `underline="true"` |

Keep native bold, italic and links as usual. These elements and their link targets are retained. An underline already supplied by a link's own design remains in place.

Do not nest one `text` marker inside another. Put all required settings on one marker, or use separate consecutive ranges. A `text` range cannot start in one paragraph and end in another. A soft line break within the same paragraph is supported.

## 2. Align or space a group of content: block

Put the opening marker in its own normal paragraph. Put the closing marker in a separate normal paragraph after the content. Use Enter to create these paragraphs.

```text
[[block align="center" padding="16px 24px" margin-bottom="2rem"]]

Votre titre ou votre premier paragraphe.

Votre deuxième paragraphe.

[[/block]]
```

The text between the markers can be actual headings, paragraphs, native lists or images. Use Webflow's heading tool to create a heading; changing font size alone does not change its heading level.

| Setting | Meaning | Example |
| --- | --- | --- |
| `align` | Text alignment | `left`, `center`, `right` |
| `margin` | Outer space on all sides, or vertical/horizontal space | `margin="1rem"` or `margin="16px 24px"` |
| `padding` | Inner space on all sides, or vertical/horizontal space | `padding="1rem"` or `padding="16px 24px"` |
| `margin-top`, `margin-right`, `margin-bottom`, `margin-left` | Outer space on one side | `margin-bottom="32px"` |
| `padding-top`, `padding-right`, `padding-bottom`, `padding-left` | Inner space on one side | `padding-left="24px"` |
| `list` | Optional square markers for enclosed bulleted lists | `list="square"` |

One spacing value applies to all four sides. Two values mean vertical first, horizontal second. Three- and four-value shorthand are not supported in this version. An explicit side overrides the general shorthand regardless of the order in which it is written.

Spacing accepts non-negative `px`, `rem`, or `0`. A block wraps the content; its padding and margin are additional to the normal spacing of its child paragraphs and headings. Omitted settings retain their normal appearance. Use `space` below for a simple extra vertical gap.

Do not nest blocks inside other blocks. A block may contain `text` markers. The opening and closing block paragraphs must be at the same level in the editor.

### Optional mobile overrides

Add `-mobile` to alignment or spacing settings if needed. These overrides apply at 767 CSS pixels and below, matching Webflow Mobile landscape and Mobile portrait. Larger viewports use the main values.

```text
[[block align="center" align-mobile="left" padding="24px" padding-mobile="16px" margin-bottom="32px" margin-bottom-mobile="16px"]]

Votre contenu.

[[/block]]
```

Mobile overrides are optional. A main value applies on every viewport unless an explicit mobile value replaces it.

### Square blue bullets

1. Create the opening marker as a normal paragraph: `[[block list="square"]]`.
2. On the following line, create a **real bulleted list** with Webflow's built-in list tool.
3. After the list, return to a normal paragraph and enter `[[/block]]`.

Only the enclosed unordered lists receive the square markers. Nested unordered lists in that block receive the same square style. Numbered lists keep their numbering. Lists outside the block keep their existing design.

The marker follows the supplied Figma reference: RG darker (`#002F50`), 7 × 7 pixels at the usual 16-pixel root size, 1-pixel corner radius, 15-pixel text inset and 16-pixel item gap. The stylesheet expresses these dimensions in rem so they scale with the root font size. Existing list text sizes are retained.

## 3. Add an extra vertical gap: space

Put this marker in its own normal paragraph:

```text
[[space height="32px"]]
```

There is no closing marker. This adds an extra gap; normal paragraph spacing remains.

Optional mobile height:

```text
[[space height="2rem" height-mobile="16px"]]
```

## Color palette

Palette names use the site's existing Webflow variables and follow later changes to those variables. HEX codes are fixed values. HEX codes are case-insensitive, must contain six digits, and must be one of the registered values below.

| Name | Registered HEX |
| --- | --- |
| `rg` | `#004F85` |
| `rg-darker` | `#002F50` |
| `rg-dark` | `#003F6A` |
| `rg-darkest` | `#000D15` |
| `rg-light` | `#6695B6` |
| `rg-lighter` | `#CCDCE7` |
| `rg-lightest` | `#E5EDF3` |
| `rg-lightest-2` | `#F0F4F8` |
| `rg-button-light` | `#D6E3EB` |
| `rg-button-lighter` | `#EBF1F5` |
| `white` | `#FFFFFF` |
| `beige` | `#CFBAAF` |
| `grey300` | `#434D56` |
| `text` | Uses the default Color Scheme 1 text variable; currently `#434D56` |
| `neutral` | `#858585` |
| `neutral-light` | `#B6B6B6` |
| `neutral-lighter` | `#E6E7E7` |
| `neutral-lightest` | `#F9F9F9` |
| `neutral-dark` | `#545454` |
| `neutral-darker` | `#242424` |
| `neutral-darkest` | `#00101B` |
| `error` | `#C5192A` |

If the design palette changes, names continue to follow their variables. The developer should update the registered HEX values and this reference when new fixed color codes are required.

## Writing rules and troubleshooting

- Use lowercase marker and setting names, with double quotes around values. Straight quotes are recommended; copied typographic double quotes are also recognized.
- Decimal values use a period: `1.25rem`.
- Only `px`, `rem`, and unitless `0` are supported for lengths. Negative values, percentages, `em`, `calc()` and arbitrary CSS are not accepted.
- Keep the marker characters themselves in plain text when possible.
- The `text` opening and closing markers belong to the same text element. The `block` opening and closing markers belong to separate normal paragraphs.
- Only `text` and `block` have closing markers. `space` does not.
- Unknown settings, off-palette colors, invalid units, duplicate settings and malformed markers remain visible instead of consuming the content.
- Code examples inside native inline-code or code-block elements are kept literal and are not processed.
- The script runs on the published page and supports Rich Text added or replaced later by CMS loading. It does not save generated formatting back into the editor.

## Developer installation — external files

The CSS and JavaScript are distributed separately in the `rg-webflow-custom-code` repository package. Their formatting behavior is unchanged from the original combined snippet.

1. Upload the package contents to the public GitHub repository, with the `richtext` folder directly at the repository root.
2. Create the first GitHub release with tag `1.0.0` after both files have been committed.
3. Copy `webflow/head.html` into **Site settings → Custom code → Head code**, preserving the other existing code. It loads the stylesheet.
4. Copy `webflow/footer.html` into **Site settings → Custom code → Footer code / Before </body>**, preserving the other existing code. It loads the JavaScript.
5. If the old combined RG Rich Text Tools snippet was already installed, replace that one installation with these references. Load the module once site-wide.
6. Save and publish to staging, then review the sample content there.

The packaged references target `perbalu/rg-webflow-custom-code`, tag `1.0.0`, through jsDelivr. They will work after the repository files and release have been published. See the package README for the upload, versioning and migration steps.

For an update, create a new release such as `1.0.1` and update the affected Webflow references. Published exact-version files are cached by jsDelivr; do not reuse an existing version tag for changed content.

When the client repository is ready, preserve the `richtext` paths and publish the required version there. Change the two Webflow URLs to the new owner/repository and publish. The module itself contains no personal-repository URL.

`window.RGRichText.refresh()` reprocesses all Rich Text elements. `window.RGRichText.refresh(richTextElement)` processes that element and any nested Rich Text instances. Normal CMS insertion and replacement are detected automatically. Repeated refreshes do not duplicate generated elements.

## Local validation

24 automated DOM checks passed before delivery, covering untouched native content, all marker types, px/rem values, mobile setting generation, existing links and inline formatting, malformed input, nested Rich Text instances, repeated execution, and dynamically loaded/replaced CMS content. These are DOM checks, not a claim that the code has already been installed or visually tested on the Webflow staging site.
