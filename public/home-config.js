/* ============================================================
   HOME PAGE CONTENT  --  this is the only file you need to edit
   ------------------------------------------------------------
   Add a tile:      copy one { name, url, icon, desc } line into a section's items
   Add a section:   copy a whole { title, items: [...] } block
   Custom HTML:     { title: "News", html: "<p>anything you want</p>" }
   Open without the URL bar:  add  direct: true  to a tile
   ============================================================ */
window.MATHLY_HOME = {
  title: "Mathly",
  tagline: "Search the web freely",
  placeholder: "Search the web freely",

  sections: [
    {
      title: "Quick links",
      items: [
        { name: "Google",    url: "https://www.google.com",    icon: "🔎" },
        { name: "YouTube",   url: "https://www.youtube.com",   icon: "▶️" },
        { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "📚" },
        { name: "Reddit",    url: "https://www.reddit.com",    icon: "💬" },
      ],
    },
    {
      title: "Games",
      items: [
        { name: "Poki",        url: "https://poki.com",             icon: "🎮", desc: "Browser games" },
        { name: "CrazyGames",  url: "https://www.crazygames.com",   icon: "🕹️", desc: "Browser games" },
        { name: "Coolmath",    url: "https://www.coolmathgames.com", icon: "🧮", desc: "Math-y games" },
      ],
    },
    // { title: "Your new section", items: [ { name: "Site", url: "https://example.com", icon: "⭐" } ] },
  ],
};
