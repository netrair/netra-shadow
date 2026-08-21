import{connect}from'cloudflare:sockets';const BRAND={name:'Netra',telegram:'https://t.me/NetraIR',github:'https://github.com/netrair/netra-shadow'};const THEME={gradFrom:'#7c5cff',gradMid:'#a855f7',gradVia:'#c026d3',gradTo:'#ec4899',bg:'#0b0510',card:'#150a1f',text:'#f5f3ff',muted:'#c7b8e6'};const SS_METHODS={'aes-128-gcm':{keyLen:16,saltLen:16,aesBits:128},'aes-256-gcm':{keyLen:32,saltLen:32,aesBits:256}};const AEAD_TAG_LEN=16;const NONCE_LEN=12;const MAX_CHUNK=16383;const WS_PATH='/ws';const MIN_PASSWORD_LEN=8;const ALLOWED_PROXY_PORTS=[443,2053,2083,2087,2096,8443];const PROXY_HOST_RE=/^[A-Za-z0-9.:-]{1,253}$/;const enc=new TextEncoder();const dec=new TextDecoder();function toU8(x){if(x instanceof Uint8Array)return x;if(x instanceof ArrayBuffer)return new Uint8Array(x);if(ArrayBuffer.isView(x))return new Uint8Array(x.buffer,x.byteOffset,x.byteLength);return new Uint8Array(x||0);}function concatBytes(...arrs){const total=arrs.reduce((n,a)=>n+a.byteLength,0);const out=new Uint8Array(total);let off=0;for(const a of arrs){out.set(a,off);off+=a.byteLength;}return out;}async function sha256Hex(input){const data=typeof input==='string'?enc.encode(input):input;const digest=await crypto.subtle.digest('SHA-256',data);return[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');}function b64url(bytes){let bin='';for(const b of bytes)bin+=String.fromCharCode(b);return btoa(bin);}function esc(str){return String(str??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));}const masterKeyCache=new Map();async function deriveMasterKey(password,keyLen){const cacheKey=keyLen+':'+password;if(masterKeyCache.has(cacheKey))return masterKeyCache.get(cacheKey);const pwBytes=enc.encode(password||'');let prev=new Uint8Array(0),result=new Uint8Array(0);while(result.byteLength<keyLen){const input=concatBytes(prev,pwBytes);prev=new Uint8Array(await crypto.subtle.digest('MD5',input));result=concatBytes(result,prev);}const key=result.slice(0,keyLen);masterKeyCache.set(cacheKey,key);return key;}async function deriveSessionKey(methodCfg,masterKey,salt,usages){const hmacOpts={name:'HMAC',hash:'SHA-1'};const saltKey=await crypto.subtle.importKey('raw',salt,hmacOpts,false,['sign']);const prk=new Uint8Array(await crypto.subtle.sign('HMAC',saltKey,masterKey));const prkKey=await crypto.subtle.importKey('raw',prk,hmacOpts,false,['sign']);const info=enc.encode('ss-subkey');const out=new Uint8Array(methodCfg.keyLen);let written=0,prev=new Uint8Array(0),counter=1;while(written<methodCfg.keyLen){const input=concatBytes(prev,info,new Uint8Array([counter]));prev=new Uint8Array(await crypto.subtle.sign('HMAC',prkKey,input));const n=Math.min(prev.byteLength,methodCfg.keyLen-written);out.set(prev.subarray(0,n),written);written+=n;counter++;}return crypto.subtle.importKey('raw',out,{name:'AES-GCM',length:methodCfg.aesBits},false,usages);}function bumpNonce(nonce){for(let i=0;i<nonce.length;i++){nonce[i]=nonce[i]+1&255;if(nonce[i]!==0)return;}}async function aeadSeal(key,nonce,plaintext){const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv:nonce,tagLength:128},key,plaintext);bumpNonce(nonce);return new Uint8Array(ct);}async function aeadOpen(key,nonce,ciphertext){const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:nonce,tagLength:128},key,ciphertext);bumpNonce(nonce);return new Uint8Array(pt);}function randomSaltHex(len=16){const b=crypto.getRandomValues(new Uint8Array(len));return[...b].map(x=>x.toString(16).padStart(2,'0')).join('');}async function hashPassword(password){const salt=randomSaltHex();const hash=await sha256Hex(`${salt}:${password}`);return`${salt}:${hash}`;}function timingSafeEqual(a,b){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}async function verifyPassword(password,stored){if(!stored)return false;const sep=stored.indexOf(':');if(sep===-1)return false;const salt=stored.slice(0,sep);const expected=stored.slice(sep+1);const actual=await sha256Hex(`${salt}:${password}`);return timingSafeEqual(actual,expected);}const LANG_ORDER=['en','zh','fa','ru'];const LANG_NAMES={en:'English',zh:'中文',fa:'فارسی',ru:'Русский'};const LANGS={en:{dir:'ltr',htmlLang:'en',loginTitle:'Admin Login',passwordLabel:'Admin Password',loginBtn:'Login',wrongPassword:'Incorrect password',setupTitle:'Initial Setup',setupDesc:'This is your first time here. Please create an admin password to secure the panel.',newPasswordLabel:'New Admin Password',confirmPasswordLabel:'Confirm Password',setupBtn:'Create & Login',passwordTooShort:`Password must be at least ${MIN_PASSWORD_LEN} characters`,passwordMismatch:'Passwords do not match',panelTitle:'Admin Panel',ssLinkLabel:'Shadowsocks Connection Link',copyBtn:'Copy Link',copiedMsg:'Copied!',methodLabel:'Encryption Method',remarkLabel:'Node Remark',ssPasswordLabel:'Shadowsocks Password',newAdminPasswordLabel:'New Admin Password (optional)',newAdminPasswordPlaceholder:'Leave blank to keep unchanged',saveBtn:'Save Changes',savedMsg:'Saved \u2014 reloading...',saveError:'Error saving',logoutLink:'Log out',langLabel:'Language',running:'This service is running.',manageAt:'Visit',toManage:'to manage.',proxySectionTitle:'Connection / Proxy IP',proxyHostLabel:'Custom Connect IP (optional)',proxyHostPlaceholder:'Leave blank to use the Worker\'s own domain',proxyHostHint:'Changes only the IP/host the client connects to at the network level \u2014 TLS/SNI and the WebSocket Host stay this Worker\'s real domain. Useful if your ISP throttles Cloudflare\'s default IPs. It does not change which country your traffic exits from.',proxyPortLabel:'Connect Port',invalidProxyHost:'Invalid IP/hostname'},zh:{dir:'ltr',htmlLang:'zh-CN',loginTitle:'管理员登录',passwordLabel:'管理员密码',loginBtn:'登录',wrongPassword:'密码错误',setupTitle:'初始设置',setupDesc:'这是您首次访问本面板\uFF0C请创建管理员密码以保护面板安全\u3002',newPasswordLabel:'新管理员密码',confirmPasswordLabel:'确认密码',setupBtn:'创建并登录',passwordTooShort:`密码长度至少为 ${MIN_PASSWORD_LEN} 个字符`,passwordMismatch:'两次输入的密码不一致',panelTitle:'管理面板',ssLinkLabel:'Shadowsocks 连接链接',copyBtn:'复制链接',copiedMsg:'已复制\uFF01',methodLabel:'加密方式',remarkLabel:'节点备注',ssPasswordLabel:'Shadowsocks 密码',newAdminPasswordLabel:'新管理员密码\uFF08可选\uFF09',newAdminPasswordPlaceholder:'留空则不更改',saveBtn:'保存更改',savedMsg:'已保存\uFF0C正在重新加载...',saveError:'保存出错',logoutLink:'退出登录',langLabel:'语言',running:'该服务正在运行\u3002',manageAt:'请访问',toManage:'进行管理\u3002',proxySectionTitle:'连接 / 代理 IP',proxyHostLabel:'自定义连接 IP\uFF08可选\uFF09',proxyHostPlaceholder:'留空则使用 Worker 自身域名',proxyHostHint:'仅更改客户端在网络层连接的 IP/主机\uFF1BTLS/SNI 和 WebSocket Host 仍是本 Worker 的真实域名\u3002适用于运营商限速 Cloudflare 默认 IP 的情况\uFF0C不会改变流量的出口国家\u3002',proxyPortLabel:'连接端口',invalidProxyHost:'无效的 IP/主机名'},fa:{dir:'rtl',htmlLang:'fa',loginTitle:'ورود به پنل',passwordLabel:'رمز عبور مدیریت',loginBtn:'ورود',wrongPassword:'رمز عبور اشتباه است',setupTitle:'راه‌اندازی اولیه',setupDesc:'این اولین باری است که وارد می‌شوید. لطفاً یک رمز عبور برای مدیریت پنل تعیین کنید.',newPasswordLabel:'رمز عبور مدیریت (جدید)',confirmPasswordLabel:'تکرار رمز عبور',setupBtn:'ایجاد و ورود',passwordTooShort:`رمز عبور باید حداقل ${MIN_PASSWORD_LEN} کاراکتر باشد`,passwordMismatch:'رمزهای عبور با هم مطابقت ندارند',panelTitle:'پنل مدیریت',ssLinkLabel:'لینک اتصال Shadowsocks',copyBtn:'کپی لینک',copiedMsg:'کپی شد!',methodLabel:'روش رمزنگاری',remarkLabel:'نام نود (Remark)',ssPasswordLabel:'رمز عبور Shadowsocks',newAdminPasswordLabel:'رمز عبور مدیریت جدید (اختیاری)',newAdminPasswordPlaceholder:'خالی بگذارید تا تغییر نکند',saveBtn:'ذخیره تغییرات',savedMsg:'ذخیره شد \u2014 در حال بارگذاری مجدد...',saveError:'خطا در ذخیره‌سازی',logoutLink:'خروج از حساب',langLabel:'زبان',running:'این سرویس در حال اجراست.',manageAt:'برای مدیریت به',toManage:'مراجعه کنید.',proxySectionTitle:'اتصال / آی‌پی پروکسی',proxyHostLabel:'آی‌پی اتصال سفارشی (اختیاری)',proxyHostPlaceholder:'خالی بگذارید تا از دامنه‌ی خود Worker استفاده شود',proxyHostHint:'فقط آی‌پی/هاستی که کلاینت در سطح شبکه بهش وصل می‌شود عوض می‌کند\u061B SNI/TLS و Host وب‌سوکت همچنان دامنه‌ی واقعی همین Worker می‌ماند. برای دور زدن کندی/محدودیت روی آی‌پی‌های پیش‌فرض Cloudflare مفید است\u060C اما کشور خروجی ترافیک را عوض نمی‌کند.',proxyPortLabel:'پورت اتصال',invalidProxyHost:'آی‌پی/هاست نامعتبر است'},ru:{dir:'ltr',htmlLang:'ru',loginTitle:'Вход в панель',passwordLabel:'Пароль администратора',loginBtn:'Войти',wrongPassword:'Неверный пароль',setupTitle:'Первоначальная настройка',setupDesc:'Вы впервые заходите в панель. Пожалуйста, задайте пароль администратора для защиты панели.',newPasswordLabel:'Новый пароль администратора',confirmPasswordLabel:'Подтвердите пароль',setupBtn:'Создать и войти',passwordTooShort:`Пароль должен содержать не менее ${MIN_PASSWORD_LEN} символов`,passwordMismatch:'Пароли не совпадают',panelTitle:'Панель управления',ssLinkLabel:'Ссылка подключения Shadowsocks',copyBtn:'Скопировать ссылку',copiedMsg:'Скопировано!',methodLabel:'Метод шифрования',remarkLabel:'Название узла',ssPasswordLabel:'Пароль Shadowsocks',newAdminPasswordLabel:'Новый пароль администратора (необязательно)',newAdminPasswordPlaceholder:'Оставьте пустым, чтобы не менять',saveBtn:'Сохранить изменения',savedMsg:'Сохранено \u2014 перезагрузка...',saveError:'Ошибка сохранения',logoutLink:'Выйти',langLabel:'Язык',running:'Сервис запущен.',manageAt:'Перейдите в',toManage:'для управления.',proxySectionTitle:'Подключение / Proxy IP',proxyHostLabel:'Пользовательский IP подключения (необязательно)',proxyHostPlaceholder:'Оставьте пустым, чтобы использовать домен самого Worker',proxyHostHint:'Меняет только IP/хост, к которому клиент подключается на сетевом уровне; TLS/SNI и Host для WebSocket остаются реальным доменом этого Worker. Полезно, если провайдер замедляет IP-адреса Cloudflare по умолчанию \u2014 страну выхода трафика это не меняет.',proxyPortLabel:'Порт подключения',invalidProxyHost:'Недопустимый IP/имя хоста'}};function detectLang(request){const cookieLang=readCookie(request,'lang');if(cookieLang&&LANGS[cookieLang])return cookieLang;const al=(request.headers.get('Accept-Language')||'').toLowerCase();if(al.includes('fa'))return'fa';if(al.includes('zh'))return'zh';if(al.includes('ru'))return'ru';return'en';}async function loadConfig(env,defaults){if(!env.KV)return defaults;try{const raw=await env.KV.get('config.json');if(!raw)return defaults;return{...defaults,...JSON.parse(raw)};}catch(e){return defaults;}}async function saveConfig(env,cfg){if(!env.KV)throw new Error('KV binding is not configured');await env.KV.put('config.json',JSON.stringify(cfg,null,2));}function buildDefaults(env){return{password:env.PASSWORD||'change-me-please',method:SS_METHODS[env.METHOD]?env.METHOD:'aes-128-gcm',remark:env.REMARK||BRAND.name,adminAuth:null,proxyHost:'',proxyPort:443};}function buildSSLink(host,cfg){const userinfo=b64url(enc.encode(`${cfg.method}:${cfg.password}`));const connectHost=cfg.proxyHost&&String(cfg.proxyHost).trim()?String(cfg.proxyHost).trim():host;const connectPort=ALLOWED_PROXY_PORTS.includes(Number(cfg.proxyPort))?Number(cfg.proxyPort):443;const pluginOpts=`v2ray-plugin;mode=websocket;tls;host=${host};path=${encodeURIComponent(WS_PATH)}`;return`ss://${userinfo}@${connectHost}:${connectPort}?plugin=${encodeURIComponent(pluginOpts)}#${encodeURIComponent(cfg.remark)}`;}function langSwitcherHtml(lang,t){const items=LANG_ORDER.map(code=>`<a href="#" class="langItem ${code===lang?'active':''}" data-lang="${code}">${esc(LANG_NAMES[code])}</a>`).join('');return`<div class="langSwitch">
<button type="button" class="langBtn" aria-label="${esc(t.langLabel)}" title="${esc(t.langLabel)}" onclick="this.nextElementSibling.classList.toggle('open')">🌐</button>
<div class="langMenu">${items}</div>
</div>
<script>
(function(){
	document.querySelectorAll('.langItem').forEach(function(a){
		a.addEventListener('click', function(e){
			e.preventDefault();
			document.cookie = 'lang=' + a.dataset.lang + '; path=/; max-age=31536000';
			location.reload();
		});
	});
	document.addEventListener('click', function(e){
		if (!e.target.closest('.langSwitch')) {
			document.querySelectorAll('.langMenu.open').forEach(function(m){ m.classList.remove('open'); });
		}
	});
})();
</script>`;}function pageShell(title,body,lang,t){return`<!DOCTYPE html><html lang="${t.htmlLang}" dir="${t.dir}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${BRAND.name}</title>
<style>
:root{--from:${THEME.gradFrom};--mid:${THEME.gradMid};--via:${THEME.gradVia};--to:${THEME.gradTo};}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:${THEME.bg};color:${THEME.text};
font-family:-apple-system,Segoe UI,Roboto,Vazirmatn,"Noto Sans SC","Noto Sans",sans-serif;
display:flex;align-items:center;justify-content:center;padding:24px}
.card{width:100%;max-width:440px;background:${THEME.card};border-radius:20px;padding:32px;
box-shadow:0 20px 60px rgba(124,92,255,.25);border:1px solid rgba(255,255,255,.06);position:relative}
.langSwitch{position:absolute;top:14px;${t.dir==='rtl'?'left':'right'}:14px}
.langBtn{width:36px;height:36px;padding:0;margin:0;border-radius:50%;font-size:17px;line-height:1;
background:#0d0616;border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
.langBtn:hover{filter:brightness(1.15)}
.langMenu{display:none;position:absolute;top:42px;${t.dir==='rtl'?'left':'right'}:0;min-width:140px;
background:${THEME.card};border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:6px;
box-shadow:0 12px 30px rgba(0,0,0,.4);z-index:10}
.langMenu.open{display:block}
.langMenu a{display:block;padding:8px 10px;border-radius:7px;color:${THEME.text};text-decoration:none;font-size:13px}
.langMenu a:hover{background:rgba(255,255,255,.06)}
.langMenu a.active{color:var(--via);font-weight:700}
.logo{width:64px;height:64px;border-radius:50%;margin:0 auto 16px;
background:linear-gradient(135deg,var(--from),var(--mid) 40%,var(--via) 70%,var(--to));
display:flex;align-items:center;justify-content:center;font-weight:800;font-size:28px;color:#fff}
h1{font-size:20px;text-align:center;margin:0 0 24px}
p.desc{font-size:13px;color:${THEME.muted};text-align:center;margin:-10px 0 20px;line-height:1.7}
label{font-size:13px;color:${THEME.muted};display:block;margin:14px 0 6px}
input,select.field{width:100%;padding:11px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.12);
background:#0d0616;color:${THEME.text};font-size:14px}
button{width:100%;margin-top:20px;padding:12px;border:0;border-radius:10px;font-weight:700;font-size:14px;
color:#fff;cursor:pointer;background:linear-gradient(135deg,var(--from),var(--via))}
button:hover{filter:brightness(1.08)}
.linkbox{margin-top:10px;padding:12px;border-radius:10px;background:#0d0616;border:1px solid rgba(255,255,255,.1);
font-size:12px;word-break:break-all;color:${THEME.muted}}
.row{display:flex;gap:10px}
.row>div{flex:1}
a.ghost{display:block;text-align:center;margin-top:14px;color:${THEME.muted};font-size:13px;text-decoration:none}
.msg{font-size:13px;text-align:center;margin-top:10px;min-height:16px}
.msg.err{color:#f87171}
.msg.ok{color:#4ade80}
.footer{margin-top:22px;text-align:center;font-size:12px;color:${THEME.muted}}
.footer a{color:${THEME.muted}}
</style></head><body><div class="card">
${langSwitcherHtml(lang,t)}
<div class="logo">N</div>
<h1>${esc(title)}</h1>
${body}
<div class="footer">${BRAND.name} · <a href="${BRAND.telegram}" target="_blank">Telegram</a> · <a href="${BRAND.github}" target="_blank">GitHub</a></div>
</div></body></html>`;}function loginPage(t,lang){return pageShell(t.loginTitle,`
<form id="f">
<label>${esc(t.passwordLabel)}</label>
<input type="password" name="password" required autofocus>
<button type="submit">${esc(t.loginBtn)}</button>
<div class="msg" id="m"></div>
</form>
<script>
document.getElementById('f').addEventListener('submit', async (e) => {
	e.preventDefault();
	const password = e.target.password.value;
	const m = document.getElementById('m');
	try {
		const r = await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'password=' + encodeURIComponent(password) });
		const j = await r.json().catch(() => ({}));
		if (r.ok && j.success) { location.href = '/panel'; return; }
		m.textContent = j.error || ${JSON.stringify(t.wrongPassword)};
		m.className = 'msg err';
	} catch (err) {
		m.textContent = ${JSON.stringify(t.wrongPassword)};
		m.className = 'msg err';
	}
});
</script>`,lang,t);}function setupPage(t,lang){return pageShell(t.setupTitle,`
<p class="desc">${esc(t.setupDesc)}</p>
<form id="f">
<label>${esc(t.newPasswordLabel)}</label>
<input type="password" name="password" minlength="${MIN_PASSWORD_LEN}" required autofocus>
<label>${esc(t.confirmPasswordLabel)}</label>
<input type="password" name="confirmPassword" minlength="${MIN_PASSWORD_LEN}" required>
<button type="submit">${esc(t.setupBtn)}</button>
<div class="msg" id="m"></div>
</form>
<script>
document.getElementById('f').addEventListener('submit', async (e) => {
	e.preventDefault();
	const password = e.target.password.value;
	const confirmPassword = e.target.confirmPassword.value;
	const m = document.getElementById('m');
	try {
		const r = await fetch('/setup', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'password=' + encodeURIComponent(password) + '&confirmPassword=' + encodeURIComponent(confirmPassword) });
		const j = await r.json().catch(() => ({}));
		if (r.ok && j.success) { location.href = '/panel'; return; }
		m.textContent = j.error || ${JSON.stringify(t.saveError)};
		m.className = 'msg err';
	} catch (err) {
		m.textContent = ${JSON.stringify(t.saveError)};
		m.className = 'msg err';
	}
});
</script>`,lang,t);}function panelPage(host,cfg,t,lang){const link=buildSSLink(host,cfg);return pageShell(t.panelTitle,`
<label>${esc(t.ssLinkLabel)}</label>
<div class="linkbox" id="sslink">${esc(link)}</div>
<button type="button" id="copyBtn">${esc(t.copyBtn)}</button>

<form id="cfgForm">
<div class="row">
<div><label>${esc(t.methodLabel)}</label>
<select name="method" class="field">
<option value="aes-128-gcm" ${cfg.method==='aes-128-gcm'?'selected':''}>aes-128-gcm</option>
<option value="aes-256-gcm" ${cfg.method==='aes-256-gcm'?'selected':''}>aes-256-gcm</option>
</select></div>
<div><label>${esc(t.remarkLabel)}</label>
<input name="remark" value="${esc(cfg.remark)}"></div>
</div>
<label>${esc(t.ssPasswordLabel)}</label>
<input name="password" value="${esc(cfg.password)}">

<label style="margin-top:22px;padding-top:14px;border-top:1px solid rgba(255,255,255,.08)">${esc(t.proxySectionTitle)}</label>
<div class="row">
<div><label>${esc(t.proxyHostLabel)}</label>
<input name="proxyHost" value="${esc(cfg.proxyHost||'')}" placeholder="${esc(t.proxyHostPlaceholder)}"></div>
<div><label>${esc(t.proxyPortLabel)}</label>
<select name="proxyPort" class="field">
${ALLOWED_PROXY_PORTS.map(p=>`<option value="${p}" ${Number(cfg.proxyPort)===p?'selected':''}>${p}</option>`).join('')}
</select></div>
</div>
<p class="desc" style="margin:8px 0 0;text-align:${'start'}">${esc(t.proxyHostHint)}</p>

<label>${esc(t.newAdminPasswordLabel)}</label>
<input name="adminPassword" type="password" minlength="${MIN_PASSWORD_LEN}" placeholder="${esc(t.newAdminPasswordPlaceholder)}">
<button type="submit">${esc(t.saveBtn)}</button>
<div class="msg" id="m"></div>
</form>
<a class="ghost" href="/logout">${esc(t.logoutLink)}</a>
<script>
document.getElementById('copyBtn').addEventListener('click', () => {
	navigator.clipboard.writeText(document.getElementById('sslink').textContent);
	const b = document.getElementById('copyBtn');
	const original = b.textContent;
	b.textContent = ${JSON.stringify(t.copiedMsg)};
	setTimeout(() => { b.textContent = original; }, 1500);
});
document.getElementById('cfgForm').addEventListener('submit', async (e) => {
	e.preventDefault();
	const fd = new FormData(e.target);
	const body = Object.fromEntries(fd.entries());
	if (!body.adminPassword) delete body.adminPassword;
	const m = document.getElementById('m');
	try {
		const r = await fetch('/panel/config.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
		const j = await r.json().catch(() => ({}));
		if (r.ok && j.success) { m.textContent = ${JSON.stringify(t.savedMsg)}; m.className = 'msg ok'; setTimeout(() => location.reload(), 700); }
		else { m.textContent = j.error || ${JSON.stringify(t.saveError)}; m.className = 'msg err'; }
	} catch (err) {
		m.textContent = ${JSON.stringify(t.saveError)}; m.className = 'msg err';
	}
});
</script>`,lang,t);}function closeQuiet(ws){try{if(ws.readyState===WebSocket.OPEN||ws.readyState===WebSocket.CLOSING)ws.close();}catch(e){}}async function wsSendAwait(ws,payload){const r=ws.send(payload);if(r&&typeof r.then==='function')await r;}async function handleShadowsocksWS(request,cfg){const pair=new WebSocketPair();const [client,server]=Object.values(pair);server.accept();server.binaryType='arraybuffer';const methodCfg=SS_METHODS[cfg.method]||SS_METHODS['aes-128-gcm'];const inboundCandidates=[methodCfg,...Object.values(SS_METHODS).filter(c=>c!==methodCfg)];let remoteSocket=null,remoteWriter=null;let inBuffer=new Uint8Array(0);let decryptKey=null,decryptNonce=null,waitLen=null,negotiated=false;let firstPacketParsed=false;let outEncryptKey=null,outNonce=null,outSalt=null,outSaltSent=false;let masterKeyCacheLocal=new Map();const getMasterKey=async c=>{if(!masterKeyCacheLocal.has(c.keyLen))masterKeyCacheLocal.set(c.keyLen,await deriveMasterKey(cfg.password,c.keyLen));return masterKeyCacheLocal.get(c.keyLen);};async function tryNegotiate(){const lengthCipherLen=2+AEAD_TAG_LEN;for(const c of inboundCandidates){const need=c.saltLen+lengthCipherLen;if(inBuffer.byteLength<need)continue;const salt=inBuffer.subarray(0,c.saltLen);const lengthCipher=inBuffer.subarray(c.saltLen,need);try{const masterKey=await getMasterKey(c);const key=await deriveSessionKey(c,masterKey,salt,['decrypt']);const nonce=new Uint8Array(NONCE_LEN);const lengthPlain=await aeadOpen(key,nonce,lengthCipher);if(lengthPlain.byteLength!==2)continue;const len=lengthPlain[0]<<8|lengthPlain[1];if(len<0||len>MAX_CHUNK)continue;inBuffer=inBuffer.subarray(need);decryptKey=key;decryptNonce=nonce;waitLen=len;negotiated=true;return true;}catch(e){}}return false;}async function decryptStream(){const out=[];if(!negotiated){const ok=await tryNegotiate();if(!ok)return out;}while(true){if(waitLen===null){const need=2+AEAD_TAG_LEN;if(inBuffer.byteLength<need)break;const cipher=inBuffer.subarray(0,need);inBuffer=inBuffer.subarray(need);const plain=await aeadOpen(decryptKey,decryptNonce,cipher);waitLen=plain[0]<<8|plain[1];if(waitLen<0||waitLen>MAX_CHUNK)throw new Error('bad SS chunk length');}const need=waitLen+AEAD_TAG_LEN;if(inBuffer.byteLength<need)break;const cipher=inBuffer.subarray(0,need);inBuffer=inBuffer.subarray(need);const plain=await aeadOpen(decryptKey,decryptNonce,cipher);out.push(plain);waitLen=null;}return out;}async function ensureOutboundCrypto(){if(outEncryptKey)return;const masterKey=await getMasterKey(methodCfg);outSalt=crypto.getRandomValues(new Uint8Array(methodCfg.saltLen));outEncryptKey=await deriveSessionKey(methodCfg,masterKey,outSalt,['encrypt']);outNonce=new Uint8Array(NONCE_LEN);}async function sendEncrypted(dataChunk){await ensureOutboundCrypto();const data=toU8(dataChunk);if(!outSaltSent){await wsSendAwait(server,outSalt.buffer);outSaltSent=true;}let offset=0;while(offset<data.byteLength||offset===0&&data.byteLength===0){const end=Math.min(offset+MAX_CHUNK,data.byteLength);const chunk=data.subarray(offset,end);const lenPlain=new Uint8Array(2);lenPlain[0]=chunk.byteLength>>>8&255;lenPlain[1]=chunk.byteLength&255;const lenCipher=await aeadSeal(outEncryptKey,outNonce,lenPlain);const dataCipher=await aeadSeal(outEncryptKey,outNonce,chunk);await wsSendAwait(server,concatBytes(lenCipher,dataCipher).buffer);if(data.byteLength===0)break;offset=end;}}async function connectAndRelay(hostname,port,firstPayload){const socket=connect({hostname,port});remoteSocket=socket;remoteWriter=socket.writable.getWriter();if(firstPayload&&firstPayload.byteLength)await remoteWriter.write(firstPayload);(async()=>{try{const reader=socket.readable.getReader();while(true){const {done,value}=await reader.read();if(done)break;if(value&&value.byteLength)await sendEncrypted(value);}}catch(e){}finally{closeQuiet(server);}})();}function parseAddressHeader(plain){if(plain.byteLength<4)throw new Error('ss header too short');const atyp=plain[0];let cursor=1,hostname='';if(atyp===1){hostname=`${plain[1]}.${plain[2]}.${plain[3]}.${plain[4]}`;cursor=5;}else if(atyp===3){const len=plain[1];hostname=dec.decode(plain.subarray(2,2+len));cursor=2+len;}else if(atyp===4){const parts=[];for(let i=0;i<8;i++){const b=2+i*2;parts.push((plain[b]<<8|plain[b+1]).toString(16));}hostname=parts.join(':');cursor=18;}else throw new Error('unsupported ss address type '+atyp);const port=plain[cursor]<<8|plain[cursor+1];const rest=plain.subarray(cursor+2);return{hostname,port,rest};}let inboundChain=Promise.resolve();server.addEventListener('message',event=>{inboundChain=inboundChain.then(async()=>{try{const chunk=toU8(event.data);inBuffer=concatBytes(inBuffer,chunk);const plaintexts=await decryptStream();for(const plain of plaintexts){if(!firstPacketParsed){firstPacketParsed=true;const {hostname,port,rest}=parseAddressHeader(plain);await connectAndRelay(hostname,port,rest);}else if(remoteWriter){await remoteWriter.write(plain);}}}catch(err){closeQuiet(server);try{remoteSocket?.close();}catch(e){}}});});server.addEventListener('close',()=>{try{remoteSocket?.close();}catch(e){}});server.addEventListener('error',()=>{try{remoteSocket?.close();}catch(e){}closeQuiet(server);});return new Response(null,{status:101,webSocket:client});}async function authToken(adminAuth,ua){return sha256Hex(`${BRAND.name}:${adminAuth}:${ua}`);}function authCookie(token){return`auth=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`;}function readCookie(request,name){const cookies=request.headers.get('Cookie')||'';for(const part of cookies.split(';')){const c=part.trim();const eq=c.indexOf('=');if(eq===-1)continue;if(c.slice(0,eq)===name)return c.slice(eq+1);}return undefined;}function redirect(path){return new Response('redirecting...',{status:302,headers:{Location:path}});}function jsonResponse(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:{'Content-Type':'application/json'}});}function htmlResponse(html,status=200){return new Response(html,{status,headers:{'Content-Type':'text/html;charset=utf-8'}});}async function readForm(request){try{return new URLSearchParams(await request.text());}catch(e){return new URLSearchParams();}}export default{async fetch(request,env,ctx){const url=new URL(request.url);const path=url.pathname;const ua=request.headers.get('User-Agent')||'';const upgrade=(request.headers.get('Upgrade')||'').toLowerCase();const lang=detectLang(request);const t=LANGS[lang];const defaults=buildDefaults(env);if(path===WS_PATH&&upgrade==='websocket'){const cfg=await loadConfig(env,defaults);return handleShadowsocksWS(request,cfg);}if(!env.KV){return new Response('KV binding "KV" is not configured for this Worker.',{status:500});}const cfg=await loadConfig(env,defaults);if(path==='/setup'){if(cfg.adminAuth)return redirect('/login');if(request.method==='POST'){const form=await readForm(request);const password=form.get('password')||'';const confirmPassword=form.get('confirmPassword')||'';if(password.length<MIN_PASSWORD_LEN)return jsonResponse({success:false,error:t.passwordTooShort},400);if(password!==confirmPassword)return jsonResponse({success:false,error:t.passwordMismatch},400);cfg.adminAuth=await hashPassword(password);await saveConfig(env,cfg);const token=await authToken(cfg.adminAuth,ua);const resp=jsonResponse({success:true});resp.headers.set('Set-Cookie',authCookie(token));return resp;}return htmlResponse(setupPage(t,lang));}if(path==='/login'){if(!cfg.adminAuth)return redirect('/setup');const validToken=await authToken(cfg.adminAuth,ua);if(readCookie(request,'auth')===validToken)return redirect('/panel');if(request.method==='POST'){const form=await readForm(request);const password=form.get('password')||'';const ok=await verifyPassword(password,cfg.adminAuth);if(!ok)return jsonResponse({success:false,error:t.wrongPassword},401);const resp=jsonResponse({success:true});resp.headers.set('Set-Cookie',authCookie(validToken));return resp;}return htmlResponse(loginPage(t,lang));}if(path==='/logout'){const resp=redirect('/login');resp.headers.set('Set-Cookie','auth=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax');return resp;}if(path==='/panel'||path.startsWith('/panel/')){if(!cfg.adminAuth)return redirect('/setup');const validToken=await authToken(cfg.adminAuth,ua);if(readCookie(request,'auth')!==validToken)return redirect('/login');if(path==='/panel/config.json'&&request.method==='POST'){try{const body=await request.json();if(body.method&&SS_METHODS[body.method])cfg.method=body.method;if(typeof body.remark==='string'&&body.remark)cfg.remark=body.remark;if(typeof body.password==='string'&&body.password&&body.password!==cfg.password){cfg.password=body.password;masterKeyCache.clear();}if(typeof body.proxyHost==='string'){const ph=body.proxyHost.trim();if(ph&&!PROXY_HOST_RE.test(ph)){return jsonResponse({success:false,error:t.invalidProxyHost},400);}cfg.proxyHost=ph;}if(typeof body.proxyPort!=='undefined'){const pp=Number(body.proxyPort);if(ALLOWED_PROXY_PORTS.includes(pp))cfg.proxyPort=pp;}let newCookie=null;if(typeof body.adminPassword==='string'&&body.adminPassword){if(body.adminPassword.length<MIN_PASSWORD_LEN){return jsonResponse({success:false,error:t.passwordTooShort},400);}cfg.adminAuth=await hashPassword(body.adminPassword);newCookie=authCookie(await authToken(cfg.adminAuth,ua));}await saveConfig(env,cfg);const resp=jsonResponse({success:true});if(newCookie)resp.headers.set('Set-Cookie',newCookie);return resp;}catch(err){return jsonResponse({success:false,error:err.message},500);}}return htmlResponse(panelPage(url.host,cfg,t,lang));}if(path==='/sub'){if(!cfg.adminAuth)return new Response('Not found',{status:404});const expectedToken=await sha256Hex(`${url.host}:${cfg.adminAuth}`);if(url.searchParams.get('token')!==expectedToken){return new Response('Not found',{status:404});}return new Response(btoa(buildSSLink(url.host,cfg)),{status:200,headers:{'Content-Type':'text/plain;charset=utf-8'}});}if(path==='/robots.txt'){return new Response('User-agent: *\nDisallow: /',{status:200,headers:{'Content-Type':'text/plain'}});}return htmlResponse(pageShell(BRAND.name,`
<p style="text-align:center;color:${THEME.muted};font-size:14px;line-height:1.8">
${esc(t.running)}<br>${esc(t.manageAt)} <a href="/panel" style="color:${THEME.text}">/panel</a> ${esc(t.toManage)}
</p>`,lang,t));}};