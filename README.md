# My blog

https://kimmo.blog



## Get started

* `npm i`

    Shipped to browsers -> `dependencies`.
    Used only dev-time -> `devDependencies`.

* `npm start` to start dev mode

## Tech stack

* MDX
* Custom build pipeline with CLI tools, aiming for simplicity


### Build pipeline

The aim was a build pipeline that is a bunch of CLI commands. Lack of hot reloading makes the iteration somewhat slow (5-10s after each file change).

Production build with approximate times:

1. (11.8s) `Render pages` stage. Generates entrypoint files for each page

    * For each "regular" page under [src/pages](src/pages)
        * `index.html` the main HTML for the page.
        * `hydrate.tsx` the script that `React.hydrate`s the given page when loaded at frontend

            [src/pages/_exports.ts](src/pages/_exports.ts) has information that tells which
            React component file we should import (e.g. Index.tsx).

            The static parts of the page work just well without this script.

    * For each MDX "post" page under [posts](posts)
        * `index.html`  same as above
        * `<postName>-post-hydrate.tsx` same as above, except it imports `PostPage` component that is also generated dynamically
        * `<postName>-post.tsx` which is is responsible for hydrating the MDX content

            Note that hydrate is *not* the same as `React.hydrate`. Instead it uses [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote/)'s
            hydrate. The flow is:

            * Node.js process renders MDX content to HTML string, and also transpiles the MDX content into a React component code. The code is quite short and well commented: https://github.com/hashicorp/next-mdx-remote/blob/main/render-to-string.js
            * Frontend takes in the rendered HTML, and babel transpiled component code and starts the dynamic components in frontend. See [next-mdx-remote/blob/main/hydrate.js)](https://github.com/hashicorp/next-mdx-remote/blob/main/hydrate.js)

        * `compiledSource.txt` The MDX component source code transpiled with Babel, mentioned above

            We need to be able to transfer the text contents exactly as-is to the frontend. A good way to do this
            was using a rollup text plugin, which is used in the next steps. `.txt` extension is used just to make
            configuring the rollup plugin easier.

            It used to be just a simple regex
            replacement in `<postName>-post.tsx` file, but it broke with line breaks.

        * `renderedOutput.txt` The HTML content of the MDX blog post.

    * `site-data.json` file that contains all metadata of the site, including pages
    * `prism-theme.css` contains dynamically rendered Prism theme CSS, based on [tailwind.config.js](tailwind.config.js)

1. (11.98s) `Bundle modules` stage. Bundles the dynamically created files for each page to one JS bundle per page

    Rollup seemed like a good fit for this type of setup where we want absolute
    control over the build. Rollup requires quite precise configuration, the following plugins are used:

    * `replace` module to e.g. take either dev or prod version of React
    * `nodeResolve` module to make rollup follow `require('react')` calls into node_modules and include them into the bundle
    * `string` to include the text files in JS code
    * `commonjs`
    * `json` to be able to import json file (site data)
    * `typescript`

1. (9.9s) `CSS` stage. Generate distributable CSS file with PostCSS

    Tailwind is used as the main CSS framework.

1. `Static files` stage. Copies everything from [public/](public/) to the root of output

1. `RSS` stage. Generates RSS feed of the content.

1. `HTML` stage. Lints accessibility and minifies the HTML.

1. `Lighthouse` stage. Builds a Lighthouse CI report which is deployed to https://kimmo.blog/perf. It is being ran in Netlify's slow build machine, so performance shows lower than it should.



## Testing features

* Light / dark mode
* Initial page load vs state update
* JS disabled

### Editing an existing post

* Grammar check: `zx tools/mdxToText.mjs posts/2-making-diy-gatsby-part-i.mdx | pbcopy` and copy to Google Docs.
* Date?
* Title changed?

    * Update slug
    * Add Netlify redirect. ID number is meant to be permanent, while the slug
    * Update cover image
    * Test with `squint http://localhost:8080 https://kimmo.blog`

## Tips

### Presentic

See https://presentic.co for introduction.

When exporting presentics from Figma, use "Include id" option. After the export, set `#viewport` rectangles to have `stroke-width="0"` from the SVG output. Presentic needs them for slides.

# License

The code is MIT licensed. MIT license **does not apply** to any other content such as images and text content for the blog.
