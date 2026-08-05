import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(root, "src", "landing");
const sectionNames = ["hero", "compare", "examples", "features", "pricing", "cta", "preview-overlay", "invite-modal"];

function resolveStaticTags(source) {
    return source
        .replaceAll(/\{%\s*load\s+static\s*%\}\s*/g, "")
        .replaceAll(/\{%\s*static\s+['"]([^'"]+)['"]\s*%\}/g, "assets/$1")
        .replaceAll(/\{%[\s\S]*?%\}/g, "");
}

const sections = await Promise.all(
    sectionNames.map(async (name) => resolveStaticTags(await readFile(path.join(sourceRoot, `${name}.html`), "utf8"))),
);

const html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="google" content="notranslate">
    <meta http-equiv="Content-Language" content="en">
    <title>FastClass - a platform for English teachers</title>
    <meta name="description" content="FastClass is a teaching platform for English tutors with ready-made interactive lessons and a virtual classroom.">
    <link rel="canonical" href="/">
    <meta property="og:site_name" content="FastClass">
    <meta property="og:locale" content="en_US">
    <meta property="og:type" content="website">
    <meta property="og:title" content="FastClass - a platform for English teachers">
    <meta property="og:description" content="Ready-made activities, video calls, and a virtual whiteboard in one classroom.">
    <meta property="og:url" content="/">
    <meta property="og:image" content="assets/images/favicon/android-chrome-512x512.png">
    <link rel="icon" href="assets/images/favicon/favicon.ico">
    <link rel="manifest" href="assets/images/favicon/site.webmanifest">
    <link rel="preload" href="assets/fonts/Montserrat-Landing-VariableFont_wght.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="assets/css/landing-bootstrap.css">
    <link rel="stylesheet" href="assets/css/landing-shell.css">
    <link rel="stylesheet" href="assets/css/landing-nav.css">
    <link rel="stylesheet" href="assets/css/invite-modal.css">
    <link rel="stylesheet" href="assets/css/lesson-placeholders.css">
    <link rel="stylesheet" href="assets/css/pricing.css">
    <link rel="stylesheet" href="assets/css/no-shadows.css">
    <link rel="stylesheet" href="assets/css/hero-formula.css?v=2">
    <style>
        @font-face {
            font-family: "Montserrat Landing";
            src: url("assets/fonts/Montserrat-Landing-VariableFont_wght.woff2") format("woff2");
            font-weight: 400 700;
            font-style: normal;
            font-display: swap;
        }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "FastClass",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web",
      "description": "A platform for creating and teaching interactive lessons online."
    }
    </script>
</head>
<body>
    <nav class="navbar app-navbar">
        <div class="container app-navbar-inner">
            <a class="navbar-brand app-brand" href="#top" aria-label="FastClass">
                <img class="app-brand-icon" src="assets/images/fastclass-brand-icon.svg" alt="" aria-hidden="true">
                <span>FastClass</span>
            </a>

            <div class="fc-landing-nav-wrap">
                <nav class="fc-landing-nav" id="landingNav" aria-label="Main navigation">
                    <a href="#examples">Lessons</a>
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                </nav>

                <button
                    type="button"
                    class="navbar-toggler fc-landing-nav-toggle"
                    id="landingNavToggle"
                    aria-controls="landingNav"
                    aria-expanded="false"
                    aria-label="Open navigation">
                    <span class="navbar-toggler-icon" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    </nav>

    <main id="top" class="container app-main pb-4">
        <div class="fc-page">
            ${sections.join("\n")}
        </div>
    </main>

    <footer class="app-footer border-top">
        <div class="container app-footer__inner">
            <span>FastClass © 2026</span>
            <a href="mailto:arsenijtam@gmail.com">arsenijtam@gmail.com</a>
        </div>
    </footer>

    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js" defer></script>
    <script src="assets/js/landing-runtime.js?v=2" defer></script>
</body>
</html>
`;

await mkdir(root, { recursive: true });
await writeFile(path.join(root, "index.html"), html, "utf8");
