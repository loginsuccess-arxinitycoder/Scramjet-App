/* ============================================================
   HOME PAGE CONTENT  --  this is the only file you need to edit
   ------------------------------------------------------------
   Each entry in "pages" becomes a big button on the home page that
   opens its own page (#apps, #games, ...).

   Page settings:
     id       short name used in the address (no spaces)
     title    name shown on the button and page
     icon     emoji
     direct   true  = hide the url bar (same as ?f=true)
              false = show the url bar (back / reload / home)
     embed    true  = site opens inside the Mathly page (iframe)   [default]
              false = browser goes straight to the proxied page
              (embed is separate from direct; with embed: false there is
               never a url bar, because the Mathly page isn't there anymore)
     items    the tiles

   Tile settings:
     name, url, icon, desc (hover text)
     direct, embed   optional: override the page's setting for just this tile

   What the combinations do:
     embed: true,  direct: false   iframe + url bar
     embed: true,  direct: true    iframe, NO url bar
     embed: false, (direct any)    straight to the proxied page, NO url bar

   Add a tile:  copy one { ... } line into a page's items
   Add a page:  copy a whole page block into "pages"
   ============================================================ */
window.MATHLY_HOME = {
  title: "Mathly",
  tagline: "Search the web freely",
  placeholder: "Search the web freely",

  pages: [
    {
      id: "apps",
      title: "Apps",
      icon: "🧩",
      direct: false,            // url bar shown
      embed: true,              // opens inside the page (iframe)
      items: [
        { name: "Google",    url: "https://www.google.com",    icon: "🔎" },
        { name: "YouTube",   url: "https://www.youtube.com",   icon: "▶️" },
        { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "📚" },
        { name: "Reddit",    url: "https://www.reddit.com",    icon: "💬" },
      ],
    },
    {
      id: "games",
      title: "Games",
      icon: "🎮",
      direct: true,             // no url bar
      embed: false,             // straight to the proxied page (set true to keep it in an iframe)
      items: [
        { name: "Poki",       url: "https://poki.com",              icon: "🎮", desc: "Browser games" },
        { name: "CrazyGames", url: "https://www.crazygames.com",    icon: "🕹️", desc: "Browser games" },
        { name: "Coolmath",   url: "https://www.coolmathgames.com", icon: "🧮", desc: "Math-y games" },
      ],
    },
  ],

  // Optional extra blocks shown on the home page under the buttons, e.g.
  // { title: "News", html: "<p>anything you want</p>" }
  sections: [],
};
