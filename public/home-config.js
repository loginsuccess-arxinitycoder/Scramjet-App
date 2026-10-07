/* ============================================================
   HOME PAGE CONTENT  --  this is the only file you need to edit
   ------------------------------------------------------------
   Each entry in "pages" becomes a big button on the home page that
   opens its own page (#apps, #games, ...).

   Page settings:
     id       short name used in the address (no spaces)
     title    name shown on the button and page
     icon     emoji
     direct   true  = tiles open with NO url bar (same as ?f=true)
              false = tiles open with the url bar (back / reload / home)
     items    the tiles

   Tile settings:
     name, url, icon, desc (hover text)
     direct   optional: overrides the page's setting for just this tile

   Add a tile:  copy one { ... } line into a page's items
   Add a page:  copy a whole page block into "pages"
   ============================================================ */
window.MATHLY_HOME = {
  title: "Mathly",
  tagline: "Search the web freely",
  placeholder: "Search the web freely",

  pages: [
    {
      id: "a",
      title: "Apps",
      icon: "🧩",
      direct: false,            // apps open WITH the url bar
      items: [
        { name: "Google",    url: "https://www.google.com",    icon: "🔎" },
        { name: "YouTube",   url: "https://www.youtube.com",   icon: "▶️" },
        { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "📚" },
        { name: "Reddit",    url: "https://www.reddit.com",    icon: "💬" },
      ],
    },
    {
      id: "g",
      title: "Games",
      icon: "🎮",
      direct: true,             // games open WITHOUT the url bar (f=true)
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
