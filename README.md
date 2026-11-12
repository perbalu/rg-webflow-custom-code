# Rentes Genevoises — Webflow custom code

Versioned browser-side CSS and JavaScript for the Rentes Genevoises Webflow website.

The first module is **RG Rich Text Tools 1.0.0**. It provides the agreed text, block and space markers in every native Webflow Rich Text element, including existing components and CMS content.

## Files

| Path | Purpose |
| --- | --- |
| `richtext/rg-richtext.css` | Styles for generated formatting and optional square bullets |
| `richtext/rg-richtext.js` | Rich Text marker processor, including dynamic CMS content |
| `docs/richtext-editor-guide.md` | Editor syntax, examples and supported colors |
| `webflow/head.html` | Copy this reference into Webflow's site-wide Head code |
| `webflow/footer.html` | Copy this reference into Webflow's site-wide Footer code |

The CSS and JavaScript were extracted from the previously validated combined snippet. Their code content is unchanged. The JavaScript needs no external library or build step. The files contain no personal-account hosting URL; the two Webflow references contain the hosting address.

## 1. Create the repository

Create a public repository under `perbalu`, named `rg-webflow-custom-code`. These settings match the prepared references below. If you choose another owner or name, update the references accordingly.

## 2. Upload the files

1. Extract `rg-webflow-custom-code.zip`.
2. Upload the **contents** of the extracted `rg-webflow-custom-code` folder to the repository. The `richtext`, `docs` and `webflow` folders must be directly at the repository root.
3. Use GitHub's **Add file → Upload files**, or the upload link shown for an empty repository, and commit the files to the default branch.
4. Check that GitHub shows `richtext/rg-richtext.css` and `richtext/rg-richtext.js` at these exact paths. Upload the extracted files, not the ZIP archive itself.

Do not include an extra enclosing folder in the repository, otherwise the prepared URLs will not match the uploaded paths.

## 3. Publish version 1.0.0

After both files are committed:

1. Open **Releases → Draft a new release**.
2. Choose/create the tag `1.0.0`.
3. Target the branch containing the uploaded files, usually `main`.
4. Set the release title to `Rich Text Tools 1.0.0`.
5. Publish the release.

The prepared jsDelivr URLs become usable after these files and this tag exist. The repository does not require a separate website deployment for this CDN route.

## 4. Connect Webflow

First check that these two versioned URLs return the actual CSS and JavaScript:

- https://cdn.jsdelivr.net/gh/perbalu/rg-webflow-custom-code@1.0.0/richtext/rg-richtext.css
- https://cdn.jsdelivr.net/gh/perbalu/rg-webflow-custom-code@1.0.0/richtext/rg-richtext.js

In **Site settings → Custom code → Head code**, add:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/perbalu/rg-webflow-custom-code@1.0.0/richtext/rg-richtext.css">
```

In **Site settings → Custom code → Footer code / Before </body>**, add:

```html
<script defer src="https://cdn.jsdelivr.net/gh/perbalu/rg-webflow-custom-code@1.0.0/richtext/rg-richtext.js"></script>
```

Preserve the other existing custom code. If the old combined RG Rich Text Tools installation is present, replace that installation with the two references. Load this module once site-wide.

Save and publish to staging. Add this sample as a normal paragraph in a Rich Text element or Rich Text prop and publish the content:

```text
Vos données restent [[text color="rg" size="20px" underline="true"]]confidentielles[[/text]].
```

On the published page, `confidentielles` should be RG blue, 20px and underlined. In the editing canvas, the markers remain visible. Use the existing prepared Rich Text components or `text-rich-text` class for the site's default typography.

The two Webflow references total approximately 240 characters, replacing the approximately 17.5k-character combined installation.

## Updates

1. Edit the relevant files and commit them.
2. Create a new release tag, for example `1.0.1`.
3. Update the version in the affected Webflow references.
4. Save and publish to staging, check the change, and then use the project's usual production publishing process.

jsDelivr caches exact-version files permanently. Treat a published version as fixed; publish changed content under a new version instead of moving/reusing the same tag. To roll back, restore the previous version in the affected references and publish.

Add future custom-code modules in their own folders, such as `forms/`. Keep their Webflow references separate so they can be updated independently.

## Move to the client account later

1. Copy the repository contents to the client's public repository, or transfer the repository when appropriate.
2. Preserve the `richtext/` paths and make the required version tag available there.
3. Check that the two new versioned CDN URLs return the correct files.
4. Change the owner/repository portion of the two Webflow references.
5. Save and publish, then check the staging page.

No Rich Text content, markers, component props or processor code needs to change. The editor guide continues to apply.

## Validation of this extraction

- The extracted CSS and JavaScript match the content of the original style/script blocks, apart from their enclosing HTML tags and surrounding whitespace.
- The extracted JavaScript passes Node's syntax check.
- The original processor passed 24 local DOM tests. This extraction has not yet been uploaded to GitHub or installed through the CDN on the Webflow staging site.

## References

- [Webflow — Custom code in head and body tags](https://help.webflow.com/hc/en-us/articles/33961357265299-Custom-code-in-head-and-body-tags)
- [jsDelivr — GitHub usage and version caching](https://github.com/jsdelivr/jsdelivr#github)
- [GitHub — Managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
