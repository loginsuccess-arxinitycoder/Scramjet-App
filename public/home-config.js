/* ============================================================
   HOME PAGE CONTENT  --  this is the only file you need to edit
   ------------------------------------------------------------
   Each entry in "pages" becomes a big button on the home page that
   opens its own page (#apps, #games, ...).

   Page settings:   id (no spaces), title, icon, items

   ICONS (for pages and tiles) can be any of:
     an emoji            icon: "🎮"
     short text          icon: "2048"   or   icon: "YT"
     an image file       icon: "/icons/poki.png"   (png, jpg, svg, webp, ico)
   For images: put the file in the repo's public/icons/ folder and use the
   path above. Images from other websites often get blocked by the browser,
   so downloading them into public/icons/ is the reliable way. If an image
   can't load, the first letter of the name is shown instead.

   EVERY TILE (app / game / service) has its own settings:
     name     shown under the icon
     url      the site to open
     icon     emoji
     desc     optional hover text
     direct   true  = hide the url bar              (default: false)
     embed    true  = open inside the Mathly page (iframe)   (default: true)
              false = browser goes straight to the proxied page

   What the combinations do:
     embed: true,  direct: false   iframe + url bar
     embed: true,  direct: true    iframe, NO url bar
     embed: false, (direct any)    straight to the proxied page, NO url bar

   Add a tile:  copy one { ... } line into a page's items
   Add a page:  copy a whole page block into "pages"
   ============================================================ */
window.MATHLY_HOME = {
  title: "Surfboard",
  tagline: "Search the web freely",
  placeholder: "Search the web freely",

  // The "Cloak" button at the bottom of the page: reopens the site inside an about:blank tab.
  cloak: {
    enabled: true,                       // false = hide the button
    label: "Cloak",                      // text on the button
    closeOriginal: true,                 // close (or redirect) the tab you clicked it from
    exitUrl: "https://www.google.com",   // where that tab goes if the browser won't let it close
  },

  pages: [
    {
      id: "apps",
      title: "Apps",
      icon: "🧩",
      items: [
        { name: "Google",    url: "https://www.google.com",    icon: "🔎", direct: false, embed: false },
        { name: "YouTube",   url: "https://www.youtube.com",   icon: "▶️", direct: false, embed: false },
        { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "W", direct: false, embed: false },
        { name: "Reddit",    url: "https://www.reddit.com",    icon: "💬", direct: false, embed: false },
      ],
    },
    {
      id: "games",
      title: "Games",
      icon: "🎮",
      items: [
        { name: "Roblox",       url: "https://nowgg.fun/apps/a/19900/b.html", icon: "https://img.icons8.com/forma-light-filled/1200/roblox.jpg", desc: "Browser games", direct: false,  embed: false},
        { name: "CrazyGames", url: "https://www.crazygames.com",    icon: "🕹️", desc: "Browser games", direct: false,  embed: false  },
        { name: "Coolmath",   url: "https://www.coolmathgames.com", icon: "🧮", desc: "Math-y games",  direct: false, embed: false  },
      ],
    },
  ],

  // Optional extra blocks shown on the home page under the buttons, e.g.
  // { title: "News", html: "<p>anything you want</p>" }
  sections: [],
};
