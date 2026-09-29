// mathly-auth.js  -- put this in src/ next to your server file.
// Server-side gate: until someone logs in (math / game), the server only ever
// returns the fake Mathly page. Real files, /scram/, /baremux/ and the Wisp
// websocket are all refused, so there is nothing to bypass.
import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE = "mathly_auth";
const SESSION_MS = 12 * 60 * 60 * 1000; // 12 hours
// SHA-256 of "username:password". Override with the MATHLY_HASH env var.
const CRED_HASH =
	process.env.MATHLY_HASH ||
	"0b28742f984d7e038d784854d070cdd3e3c2c40f9ef4fe5ee5b71536f79e9a00";
// Signing key: the SAME on every restart and every server instance, so a valid login
// never randomly stops working. For extra safety, set SESSION_SECRET (any long random
// string) on your host.
const SECRET = createHash("sha256")
	.update("mathly:" + (process.env.SESSION_SECRET || CRED_HASH))
	.digest("hex");

const sign = (exp) => createHmac("sha256", SECRET).update(String(exp)).digest("hex");
const safeEq = (a, b) => {
	const x = Buffer.from(a), y = Buffer.from(b);
	return x.length === y.length && timingSafeEqual(x, y);
};

// Browsers can send several cookies with the same name; accept the request if ANY is valid.
function readCookies(req) {
	return (req.headers.cookie || "")
		.split(";").map((s) => s.trim())
		.filter((s) => s.startsWith(COOKIE + "="))
		.map((s) => s.slice(COOKIE.length + 1));
}

// "ok" | "none" | "expired" | "badsig"
export function authState(req) {
	const all = readCookies(req);
	if (!all.length) return "none";
	let why = "badsig";
	for (const c of all) {
		const [exp, sig] = c.split(".");
		if (!exp || !sig || !safeEq(sig, sign(exp))) continue;
		if (Number(exp) > Date.now()) return "ok";
		why = "expired";
	}
	return why;
}

// Works on Fastify requests AND raw Node requests (use it in the websocket upgrade handler).
export const isAuthed = (req) => authState(req) === "ok";

const isHttps = (req) => req.headers["x-forwarded-proto"] === "https" || !!req.socket?.encrypted;
const cookieStr = (val, req, maxAge) =>
	`${COOKIE}=${val}; Path=/; HttpOnly; ` +
	(isHttps(req) ? "SameSite=None; Secure; Partitioned" : "SameSite=Lax") +
	(maxAge !== undefined ? `; Max-Age=${maxAge}` : "");

// crude brute-force limit: 10 login attempts per IP per minute
const attempts = new Map();
function limited(ip) {
	const now = Date.now(), a = attempts.get(ip);
	if (!a || a.reset < now) { attempts.set(ip, { n: 1, reset: now + 60000 }); return false; }
	return ++a.n > 10;
}

const PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Mathly – Practice Math</title>
<style>
:root{--bg:#f6f8fb;--ink:#1d2433;--muted:#5b667a;--brand:#2f5bea;--card:#fff;--line:#dde3ee}
@media (prefers-color-scheme:dark){:root{--bg:#141a26;--ink:#eef1f7;--muted:#9aa6bd;--brand:#7c9bff;--card:#1d2535;--line:#2c3650}}
*{box-sizing:border-box}body{margin:0;font-family:"Trebuchet MS","Segoe UI",sans-serif;background:var(--bg);color:var(--ink)}
header{display:flex;justify-content:space-between;align-items:center;padding:16px 28px;border-bottom:1px solid var(--line);background:var(--card)}
.logo{font-size:1.4rem;font-weight:700;color:var(--brand)}button{font:inherit;cursor:pointer}
.btn{background:var(--brand);color:#fff;border:0;border-radius:8px;padding:10px 20px;font-weight:600}
.btn:focus-visible,input:focus-visible{outline:3px solid var(--brand);outline-offset:2px}
main{max-width:900px;margin:0 auto;padding:56px 24px}h1{font-size:clamp(2rem,5vw,3.2rem);margin:0 0 12px}
.lead{color:var(--muted);font-size:1.15rem;max-width:52ch;line-height:1.55}
.topics{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-top:40px}
.topic{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:20px}
.topic b{display:block;font-size:1.6rem;color:var(--brand);margin-bottom:6px}.topic span{color:var(--muted);font-size:.95rem}
#modal{position:fixed;inset:0;background:rgba(10,15,30,.6);display:none;align-items:center;justify-content:center;padding:20px}
#modal.open{display:flex}.box{background:var(--card);border-radius:12px;padding:28px;width:100%;max-width:360px}
.box h2{margin:0 0 16px}label{display:block;font-size:.9rem;margin-bottom:12px;color:var(--muted)}
input{display:block;width:100%;margin-top:4px;padding:10px;font:inherit;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)}
#err{color:#d13b3b;min-height:1.2em;font-size:.9rem;margin:0 0 10px}.row{display:flex;gap:10px}.row .btn{flex:1}
.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
</style></head><body>
<header><div class="logo">Mathly</div><button class="btn" id="open">Log in</button></header>
<main><h1>Math practice that sticks.</h1>
<p class="lead">Short lessons and quick drills in algebra, geometry, and more. Log in to pick up where you left off.</p>
<div class="topics"><div class="topic"><b>x + 2 = 5</b><span>Algebra basics</span></div>
<div class="topic"><b>a² + b² = c²</b><span>Geometry</span></div>
<div class="topic"><b>3/4 × 2/3</b><span>Fractions</span></div>
<div class="topic"><b>f(x) = 2x</b><span>Functions</span></div></div></main>
<div id="modal" role="dialog" aria-modal="true" aria-labelledby="ttl"><div class="box"><h2 id="ttl">Log in</h2>
<label>Username <input id="u" autocomplete="off"></label>
<label>Password <input id="p" type="password" autocomplete="off"></label>
<p id="err" role="alert"></p>
<div class="row"><button class="btn ghost" id="cancel">Cancel</button><button class="btn" id="go">Log in</button></div></div></div>
<script>
var m=document.getElementById("modal"),u=document.getElementById("u"),p=document.getElementById("p"),e=document.getElementById("err");
document.getElementById("open").onclick=function(){m.classList.add("open");u.focus()};
document.getElementById("cancel").onclick=function(){m.classList.remove("open");e.textContent=""};
function login(){
  fetch("/_mathly/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({u:u.value,p:p.value})})
   .then(function(r){ if(r.ok) location.reload(); else e.textContent = r.status===429 ? "Too many tries. Wait a minute." : "Wrong username or password."; })
   .catch(function(){ e.textContent="Something went wrong."; });
}
document.getElementById("go").onclick=login;
[u,p].forEach(function(el){el.addEventListener("keydown",function(ev){if(ev.key==="Enter")login()})});
</script></body></html>`;

// Only ever sent to logged-in users. Adds the "Return to fake site" button.
// While a website is open in the proxy the button hides; hover (or tap) the bottom-right
// corner to bring it back.
const RETURN_JS = `(function(){
var host=document.createElement("div");
host.style.cssText="all:initial;position:fixed;right:0;bottom:0;z-index:2147483647;";
var s=host.attachShadow({mode:"open"});
s.innerHTML='<style>button{position:absolute;right:8px;bottom:8px;font:600 13px "Trebuchet MS","Segoe UI",sans-serif;background:#2f5bea;color:#fff;border:0;border-radius:999px;padding:9px 16px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.35);white-space:nowrap}button:focus-visible{outline:3px solid #fff;outline-offset:2px}.corner button{visibility:hidden}</style><div id="w"><button id="b">Return to fake site</button></div>';
var w=s.getElementById("w"),last="",hover=false,timer=0;
function browsing(){
  var f=document.querySelectorAll("iframe");
  for(var i=0;i<f.length;i++){
    var r=f[i].getBoundingClientRect(),c=getComputedStyle(f[i]);
    if(r.width>50&&r.height>50&&c.display!=="none"&&c.visibility!=="hidden")return true;
  }
  return false;
}
function update(){
  var mode=(!browsing()||hover)?"full":"corner";
  if(mode===last)return;
  last=mode;
  host.style.width=mode==="full"?"190px":"28px";
  host.style.height=mode==="full"?"56px":"28px";
  w.className=mode==="full"?"":"corner";
}
host.addEventListener("mouseenter",function(){hover=true;update()});
host.addEventListener("mouseleave",function(){hover=false;update()});
host.addEventListener("click",function(){
  if(last==="corner"){hover=true;update();clearTimeout(timer);timer=setTimeout(function(){hover=false;update()},4000)}
});
s.getElementById("b").onclick=function(){
  fetch("/_mathly/logout",{method:"POST"}).finally(function(){location.replace("/?"+Date.now())});
};
document.documentElement.appendChild(host);
new MutationObserver(update).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["style","class","hidden","src"]});
setInterval(update,1000);
update();
})();`;

export function mathlyAuth(fastify) {
	// 1) The gate. Added first so it covers every route registered after it.
	fastify.addHook("onRequest", async (req, reply) => {
		const path = req.url.split("?")[0];
		if (path === "/_mathly/login" || path === "/_mathly/logout") return;
		const state = authState(req);
		if (state === "ok") return;
		if (state !== "none") console.log(`[mathly] ${state} cookie on ${req.method} ${path}`);
		const wantsHtml = req.method === "GET" && (req.headers.accept || "").includes("text/html");
		reply
			.code(wantsHtml ? 200 : 404)
			.header("Cache-Control", "no-store")
			.type("text/html")
			.send(wantsHtml ? PAGE : "");
		return reply;
	});

	// 2) Login / logout / return button script
	fastify.post("/_mathly/login", async (req, reply) => {
		if (limited(req.ip)) return reply.code(429).send({ ok: false });
		const { u = "", p = "" } = req.body || {};
		const h = createHash("sha256").update(`${u}:${p}`).digest("hex");
		if (!safeEq(h, CRED_HASH)) return reply.code(401).send({ ok: false });
		const exp = Date.now() + SESSION_MS;
		reply.header("Set-Cookie", cookieStr(`${exp}.${sign(exp)}`, req));
		return { ok: true };
	});

	fastify.post("/_mathly/logout", async (req, reply) => {
		reply.header("Set-Cookie", cookieStr("", req, 0));
		return { ok: true };
	});

	fastify.get("/_mathly/return.js", async (req, reply) =>
		reply.header("Cache-Control", "no-store").type("text/javascript").send(RETURN_JS),
	);
}
