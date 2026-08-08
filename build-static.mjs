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
    <meta name="description" content="FastClass brings ready-made activities, video calls, and a virtual whiteboard into one classroom for tutors and schools.">
    <link rel="canonical" href="/">
    <meta property="og:site_name" content="FastClass">
    <meta property="og:locale" content="en_US">
    <meta property="og:type" content="website">
    <meta property="og:title" content="FastClass - a platform for English teachers">
    <meta property="og:description" content="Ready-made activities, video calls, and a virtual whiteboard in one classroom for tutors and schools.">
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
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KB8LFJ4C');</script>
    <!-- End Google Tag Manager -->
    <!-- Yandex.Metrika counter -->
    <script type="text/javascript">
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=111423285', 'ym');

        ym(111423285, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
    </script>
    <!-- /Yandex.Metrika counter -->
</head>
<body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KB8LFJ4C"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <!-- Yandex.Metrika counter (noscript) -->
    <noscript><div><img src="https://mc.yandex.ru/watch/111423285" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter (noscript) -->
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
                    <button type="button" class="fc-landing-nav-cta js-open-invite-modal">Get Started</button>
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
    <script src="assets/js/landing-runtime.js?v=3" defer></script>
</body>
</html>
`;

await mkdir(root, { recursive: true });
await writeFile(path.join(root, "index.html"), html, "utf8");
