/* Builds the home page from home-config.js. You shouldn't need to edit this. */
(function () {
  var C = window.MATHLY_HOME || {};
  var $ = function (id) { return document.getElementById(id); };

  document.title = C.title || document.title;
  $("mh-title").textContent = C.title || "Mathly";
  $("mh-tag").textContent = C.tagline || "";
  if (C.placeholder) $("sj-address").placeholder = C.placeholder;

  // Open a site the same way typing it in the search box would
  function launch(url, direct) {
    if (direct) { location.href = "/l?url=" + encodeURIComponent(url) + "&f=true"; return; }
    $("sj-address").value = url;
    var f = $("sj-form");
    if (f.requestSubmit) f.requestSubmit();
    else f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  function tile(it) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "mh-tile";
    var i = document.createElement("span"); i.className = "mh-ico"; i.textContent = it.icon || "🌐";
    var n = document.createElement("span"); n.className = "mh-name"; n.textContent = it.name;
    b.appendChild(i); b.appendChild(n);
    if (it.desc) { var d = document.createElement("span"); d.className = "mh-desc"; d.textContent = it.desc; b.appendChild(d); }
    if (it.desc) b.title = it.desc;
    b.onclick = function () { launch(it.url, it.direct); };
    return b;
  }

  var root = $("mh-sections");
  (C.sections || []).forEach(function (sec) {
    var s = document.createElement("section"); s.className = "mh-sec" + (sec.wide ? " mh-wide" : "");
    if (sec.title) { var h = document.createElement("h2"); h.textContent = sec.title; s.appendChild(h); }
    if (sec.html) { var x = document.createElement("div"); x.innerHTML = sec.html; s.appendChild(x); }
    if (sec.items) {
      var g = document.createElement("div"); g.className = "mh-grid";
      sec.items.forEach(function (it) { g.appendChild(tile(it)); });
      s.appendChild(g);
    }
    root.appendChild(s);
  });

  // Hide the home page once a site is open in the proxy
  new MutationObserver(function () {
    if (document.querySelector("iframe")) $("home").style.display = "none";
  }).observe(document.body, { childList: true });
})();
