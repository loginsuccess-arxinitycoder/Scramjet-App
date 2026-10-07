/* Builds the home page + the Apps/Games pages from home-config.js. You shouldn't need to edit this. */
(function () {
  var C = window.MATHLY_HOME || {};
  var $ = function (id) { return document.getElementById(id); };
  var root = $("mh-sections");

  document.title = C.title || document.title;
  $("mh-title").textContent = C.title || "Mathly";
  if (C.placeholder) $("sj-address").placeholder = C.placeholder;

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Icons can be an emoji, short text (like "2048" or "YT"), or an image
  // (a path like "/icons/poki.png", or any .png/.jpg/.svg/.webp/.ico address)
  function icon(spec, cls, name) {
    var wrap = el("span", cls);
    spec = spec || "";
    if (/[/]|[.](png|jpe?g|gif|webp|svg|ico)([?#].*)?$/i.test(spec)) {
      var img = el("img");
      img.src = spec; img.alt = ""; img.loading = "lazy"; img.draggable = false;
      if (/^(https?:)?[/][/]/i.test(spec)) img.crossOrigin = "anonymous";
      img.onerror = function () {          // image missing: fall back to the first letter
        wrap.textContent = (name || "?").charAt(0).toUpperCase();
        wrap.classList.add("mh-txt");
      };
      wrap.appendChild(img);
    } else if (/[A-Za-z0-9]/.test(spec)) {
      wrap.classList.add("mh-txt");
      wrap.textContent = spec;
    } else {
      wrap.textContent = spec || "\uD83C\uDF10";
    }
    return wrap;
  }

  // Open a site.
  //  embed: true  = inside the Mathly page (iframe)      false = browser goes straight to the proxied page
  //  direct: true = hide the url bar                      false = show the url bar (only possible when embedded)
  function launch(url, direct, embed) {
    if (embed && !direct) {            // normal: same as typing it in the search box
      $("sj-address").value = url;
      var f = $("sj-form");
      if (f.requestSubmit) f.requestSubmit();
      else f.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      return;
    }
    location.href = "/l?url=" + encodeURIComponent(url) +
      "&f=" + (direct ? "true" : "false") + "&embed=" + (embed ? "true" : "false");
  }

  // Each tile has its own direct / embed settings (see home-config.js)
  function tile(it) {
    var direct = !!it.direct;
    var embed = it.embed !== undefined ? !!it.embed : true;
    var b = el("button", "mh-tile");
    b.type = "button";
    b.appendChild(icon(it.icon, "mh-ico", it.name));
    b.appendChild(el("span", "mh-name", it.name));
    if (it.desc) { b.title = it.desc; b.appendChild(el("span", "mh-desc", it.desc)); }
    b.onclick = function () { launch(it.url, direct, embed); };
    return b;
  }

  function section(sec) {
    var s = el("section", "mh-sec" + (sec.wide ? " mh-wide" : ""));
    if (sec.title) s.appendChild(el("h2", "", sec.title));
    if (sec.html) { var x = el("div"); x.innerHTML = sec.html; s.appendChild(x); }
    if (sec.items) {
      var g = el("div", "mh-grid");
      sec.items.forEach(function (it) { g.appendChild(tile(it)); });
      s.appendChild(g);
    }
    return s;
  }

  function renderHome() {
    var pages = C.pages || [];
    if (pages.length) {
      var nav = el("nav", "mh-nav");
      pages.forEach(function (p) {
        var a = el("a", "mh-navcard");
        a.href = "#" + p.id;
        a.appendChild(icon(p.icon, "mh-navico", p.title));
        a.appendChild(el("span", "mh-navname", p.title));
        a.appendChild(el("span", "mh-navcount", (p.items || []).length + " items"));
        nav.appendChild(a);
      });
      root.appendChild(nav);
    }
    (C.sections || []).forEach(function (sec) { root.appendChild(section(sec)); });
  }

  function renderPage(p) {
    var bar = el("div", "mh-bar");
    var back = el("a", "mh-back", "\u2190 Home");
    back.href = "#";
    bar.appendChild(back);
    var ph = el("h2", "mh-ptitle");
    ph.appendChild(icon(p.icon, "mh-pico", p.title));
    ph.appendChild(document.createTextNode(" " + p.title));
    bar.appendChild(ph);
    var filter = el("input", "mh-filter");
    filter.type = "search";
    filter.placeholder = "Filter " + p.title.toLowerCase() + "...";
    bar.appendChild(filter);
    root.appendChild(bar);

    var grid = el("div", "mh-grid mh-pgrid"), tiles = [];
    (p.items || []).forEach(function (it) {
      var t = tile(it);
      t._n = (it.name + " " + (it.desc || "")).toLowerCase();
      tiles.push(t);
      grid.appendChild(t);
    });
    filter.addEventListener("input", function () {
      var q = filter.value.trim().toLowerCase();
      tiles.forEach(function (t) { t.style.display = (!q || t._n.indexOf(q) >= 0) ? "" : "none"; });
    });
    root.appendChild(grid);
  }

  function render() {
    var id = location.hash.slice(1);
    var page = (C.pages || []).filter(function (p) { return p.id === id; })[0];
    root.textContent = "";
    root.className = page ? "mh-single" : "";
    // search bar + tagline only on the home view (the form stays in the page so launching still works)
    $("sj-form").style.display = page ? "none" : "";
    $("mh-tag").textContent = page ? "" : (C.tagline || "");
    if (page) renderPage(page); else renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);
  render();

  // Hide the home page once a site is open in the proxy
  new MutationObserver(function () {
    if (document.querySelector("iframe")) $("home").style.display = "none";
  }).observe(document.body, { childList: true });
})();
