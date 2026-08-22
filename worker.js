import{connect as re}from"cloudflare:sockets";const T={name:"Netra",telegram:"https://t.me/NetraIR",github:"https://github.com/netrair/netra-shadow"},w={gradFrom:"#7c5cff",gradMid:"#a855f7",gradVia:"#c026d3",gradTo:"#ec4899",bg:"#0b0510",card:"#150a1f",text:"#f5f3ff",muted:"#c7b8e6"},R={"aes-128-gcm":{keyLen:16,saltLen:16,aesBits:128},"aes-256-gcm":{keyLen:32,saltLen:32,aesBits:256}},F=16,oe=12,X=16383,ae="/ws",se="/vless",$=8,O=[443,2053,2083,2087,2096,8443],Le=/^[A-Za-z0-9.:-]{1,253}$/,j=new TextEncoder,ie=new TextDecoder;function W(e){return e instanceof Uint8Array?e:e instanceof ArrayBuffer?new Uint8Array(e):ArrayBuffer.isView(e)?new Uint8Array(e.buffer,e.byteOffset,e.byteLength):new Uint8Array(e||0)}function H(...e){const t=e.reduce((r,l)=>r+l.byteLength,0),n=new Uint8Array(t);let o=0;for(const r of e)n.set(r,o),o+=r.byteLength;return n}async function D(e){const t=typeof e=="string"?j.encode(e):e,n=await crypto.subtle.digest("SHA-256",t);return[...new Uint8Array(n)].map(o=>o.toString(16).padStart(2,"0")).join("")}function Se(e){let t="";for(const n of e)t+=String.fromCharCode(n);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function i(e){return String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function ke(e){const t=String(e).replace(/-/g,"");if(t.length!==32||!/^[0-9a-fA-F]{32}$/.test(t))return null;const n=new Uint8Array(16);for(let o=0;o<16;o++)n[o]=parseInt(t.substr(o*2,2),16);return n}function ve(e,t){if(e.byteLength!==t.byteLength)return!1;let n=0;for(let o=0;o<e.byteLength;o++)n|=e[o]^t[o];return n===0}const K=new Map;async function Pe(e,t){const n=t+":"+e;if(K.has(n))return K.get(n);const o=j.encode(e||"");let r=new Uint8Array(0),l=new Uint8Array(0);for(;l.byteLength<t;){const h=H(r,o);r=new Uint8Array(await crypto.subtle.digest("MD5",h)),l=H(l,r)}const y=l.slice(0,t);return K.set(n,y),y}async function ce(e,t,n,o){const r={name:"HMAC",hash:"SHA-1"},l=await crypto.subtle.importKey("raw",n,r,!1,["sign"]),y=new Uint8Array(await crypto.subtle.sign("HMAC",l,t)),h=await crypto.subtle.importKey("raw",y,r,!1,["sign"]),p=j.encode("ss-subkey"),d=new Uint8Array(e.keyLen);let a=0,u=new Uint8Array(0),s=1;for(;a<e.keyLen;){const k=H(u,p,new Uint8Array([s]));u=new Uint8Array(await crypto.subtle.sign("HMAC",h,k));const b=Math.min(u.byteLength,e.keyLen-a);d.set(u.subarray(0,b),a),a+=b,s++}return crypto.subtle.importKey("raw",d,{name:"AES-GCM",length:e.aesBits},!1,o)}function le(e){for(let t=0;t<e.length;t++)if(e[t]=e[t]+1&255,e[t]!==0)return}async function de(e,t,n){const o=await crypto.subtle.encrypt({name:"AES-GCM",iv:t,tagLength:128},e,n);return le(t),new Uint8Array(o)}async function Y(e,t,n){const o=await crypto.subtle.decrypt({name:"AES-GCM",iv:t,tagLength:128},e,n);return le(t),new Uint8Array(o)}function $e(e=16){return[...crypto.getRandomValues(new Uint8Array(e))].map(n=>n.toString(16).padStart(2,"0")).join("")}async function ue(e){const t=$e(),n=await D(`${t}:${e}`);return`${t}:${n}`}function Ae(e,t){if(e.length!==t.length)return!1;let n=0;for(let o=0;o<e.length;o++)n|=e.charCodeAt(o)^t.charCodeAt(o);return n===0}async function Ce(e,t){if(!t)return!1;const n=t.indexOf(":");if(n===-1)return!1;const o=t.slice(0,n),r=t.slice(n+1),l=await D(`${o}:${e}`);return Ae(l,r)}const Ee=["en","zh","fa","ru"],Te={en:"English",zh:"\u4E2D\u6587",fa:"\u0641\u0627\u0631\u0633\u06CC",ru:"\u0420\u0443\u0441\u0441\u043A\u0438\u0439"},pe={en:{dir:"ltr",htmlLang:"en",loginTitle:"Admin Login",passwordLabel:"Admin Password",loginBtn:"Login",wrongPassword:"Incorrect password",setupTitle:"Initial Setup",setupDesc:"This is your first time here. Please create an admin password to secure the panel.",newPasswordLabel:"New Admin Password",confirmPasswordLabel:"Confirm Password",setupBtn:"Create & Login",passwordTooShort:`Password must be at least ${$} characters`,passwordMismatch:"Passwords do not match",panelTitle:"Admin Panel",ssLinkLabel:"Shadowsocks Connection Link",copyBtn:"Copy Link",copiedMsg:"Copied!",methodLabel:"Encryption Method",remarkLabel:"Node Remark",ssPasswordLabel:"Shadowsocks Password",newAdminPasswordLabel:"New Admin Password (optional)",newAdminPasswordPlaceholder:"Leave blank to keep unchanged",saveBtn:"Save Changes",savedMsg:"Saved \u2014 reloading...",saveError:"Error saving",logoutLink:"Log out",langLabel:"Language",running:"This service is running.",manageAt:"Visit",toManage:"to manage.",proxySectionTitle:"Connection / Proxy IP",proxyHostLabel:"Custom Connect IP (optional)",proxyHostPlaceholder:"Leave blank to use the Worker's own domain",proxyHostHint:"Changes only the IP/host the client connects to at the network level \u2014 TLS/SNI and the WebSocket Host stay this Worker's real domain. Useful if your ISP throttles Cloudflare's default IPs. It does not change which country your traffic exits from.",proxyPortLabel:"Connect Port",invalidProxyHost:"Invalid IP/hostname",vlessLinkLabel:"VLESS Connection Link (V2rayNG, NekoBox, Shadowrocket...)",vlessHint:"Recommended for most apps \u2014 Xray-core based clients understand WebSocket+TLS for VLESS natively, with no extra plugin required.",ssHint:"For Shadowsocks-native clients (Happ, etc). Some clients \u2014 notably V2rayNG \u2014 do not support the WebSocket transport for Shadowsocks and will connect over plain TCP if you use this one; use the VLESS link above for those.",regenVlessBtn:"Regenerate VLESS ID",regenVlessConfirm:"This invalidates the current VLESS link on all devices using it. Continue?"},zh:{dir:"ltr",htmlLang:"zh-CN",loginTitle:"\u7BA1\u7406\u5458\u767B\u5F55",passwordLabel:"\u7BA1\u7406\u5458\u5BC6\u7801",loginBtn:"\u767B\u5F55",wrongPassword:"\u5BC6\u7801\u9519\u8BEF",setupTitle:"\u521D\u59CB\u8BBE\u7F6E",setupDesc:"\u8FD9\u662F\u60A8\u9996\u6B21\u8BBF\u95EE\u672C\u9762\u677F\uFF0C\u8BF7\u521B\u5EFA\u7BA1\u7406\u5458\u5BC6\u7801\u4EE5\u4FDD\u62A4\u9762\u677F\u5B89\u5168\u3002",newPasswordLabel:"\u65B0\u7BA1\u7406\u5458\u5BC6\u7801",confirmPasswordLabel:"\u786E\u8BA4\u5BC6\u7801",setupBtn:"\u521B\u5EFA\u5E76\u767B\u5F55",passwordTooShort:`\u5BC6\u7801\u957F\u5EA6\u81F3\u5C11\u4E3A ${$} \u4E2A\u5B57\u7B26`,passwordMismatch:"\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4",panelTitle:"\u7BA1\u7406\u9762\u677F",ssLinkLabel:"Shadowsocks \u8FDE\u63A5\u94FE\u63A5",copyBtn:"\u590D\u5236\u94FE\u63A5",copiedMsg:"\u5DF2\u590D\u5236\uFF01",methodLabel:"\u52A0\u5BC6\u65B9\u5F0F",remarkLabel:"\u8282\u70B9\u5907\u6CE8",ssPasswordLabel:"Shadowsocks \u5BC6\u7801",newAdminPasswordLabel:"\u65B0\u7BA1\u7406\u5458\u5BC6\u7801\uFF08\u53EF\u9009\uFF09",newAdminPasswordPlaceholder:"\u7559\u7A7A\u5219\u4E0D\u66F4\u6539",saveBtn:"\u4FDD\u5B58\u66F4\u6539",savedMsg:"\u5DF2\u4FDD\u5B58\uFF0C\u6B63\u5728\u91CD\u65B0\u52A0\u8F7D...",saveError:"\u4FDD\u5B58\u51FA\u9519",logoutLink:"\u9000\u51FA\u767B\u5F55",langLabel:"\u8BED\u8A00",running:"\u8BE5\u670D\u52A1\u6B63\u5728\u8FD0\u884C\u3002",manageAt:"\u8BF7\u8BBF\u95EE",toManage:"\u8FDB\u884C\u7BA1\u7406\u3002",proxySectionTitle:"\u8FDE\u63A5 / \u4EE3\u7406 IP",proxyHostLabel:"\u81EA\u5B9A\u4E49\u8FDE\u63A5 IP\uFF08\u53EF\u9009\uFF09",proxyHostPlaceholder:"\u7559\u7A7A\u5219\u4F7F\u7528 Worker \u81EA\u8EAB\u57DF\u540D",proxyHostHint:"\u4EC5\u66F4\u6539\u5BA2\u6237\u7AEF\u5728\u7F51\u7EDC\u5C42\u8FDE\u63A5\u7684 IP/\u4E3B\u673A\uFF1BTLS/SNI \u548C WebSocket Host \u4ECD\u662F\u672C Worker \u7684\u771F\u5B9E\u57DF\u540D\u3002\u9002\u7528\u4E8E\u8FD0\u8425\u5546\u9650\u901F Cloudflare \u9ED8\u8BA4 IP \u7684\u60C5\u51B5\uFF0C\u4E0D\u4F1A\u6539\u53D8\u6D41\u91CF\u7684\u51FA\u53E3\u56FD\u5BB6\u3002",proxyPortLabel:"\u8FDE\u63A5\u7AEF\u53E3",invalidProxyHost:"\u65E0\u6548\u7684 IP/\u4E3B\u673A\u540D",vlessLinkLabel:"VLESS \u8FDE\u63A5\u94FE\u63A5\uFF08V2rayNG\u3001NekoBox\u3001Shadowrocket \u7B49\uFF09",vlessHint:"\u63A8\u8350\u5927\u591A\u6570\u5E94\u7528\u4F7F\u7528\u6B64\u94FE\u63A5 \u2014 \u57FA\u4E8E Xray-core \u7684\u5BA2\u6237\u7AEF\u539F\u751F\u652F\u6301 VLESS \u7684 WebSocket+TLS \u4F20\u8F93\uFF0C\u65E0\u9700\u989D\u5916\u63D2\u4EF6\u3002",ssHint:"\u9002\u7528\u4E8E\u539F\u751F\u652F\u6301 Shadowsocks \u7684\u5BA2\u6237\u7AEF\uFF08\u5982 Happ\uFF09\u3002\u90E8\u5206\u5BA2\u6237\u7AEF\uFF08\u5C24\u5176\u662F V2rayNG\uFF09\u4E0D\u652F\u6301 Shadowsocks \u7684 WebSocket \u4F20\u8F93\uFF0C\u4F7F\u7528\u6B64\u94FE\u63A5\u4F1A\u4EE5\u666E\u901A TCP \u65B9\u5F0F\u8FDE\u63A5\uFF1B\u8FD9\u7C7B\u5BA2\u6237\u7AEF\u8BF7\u4F7F\u7528\u4E0A\u65B9\u7684 VLESS \u94FE\u63A5\u3002",regenVlessBtn:"\u91CD\u65B0\u751F\u6210 VLESS ID",regenVlessConfirm:"\u8FD9\u5C06\u4F7F\u6240\u6709\u6B63\u5728\u4F7F\u7528\u5F53\u524D VLESS \u94FE\u63A5\u7684\u8BBE\u5907\u5931\u6548\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F"},fa:{dir:"rtl",htmlLang:"fa",loginTitle:"\u0648\u0631\u0648\u062F \u0628\u0647 \u067E\u0646\u0644",passwordLabel:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u062F\u06CC\u0631\u06CC\u062A",loginBtn:"\u0648\u0631\u0648\u062F",wrongPassword:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0627\u0634\u062A\u0628\u0627\u0647 \u0627\u0633\u062A",setupTitle:"\u0631\u0627\u0647\u200C\u0627\u0646\u062F\u0627\u0632\u06CC \u0627\u0648\u0644\u06CC\u0647",setupDesc:"\u0627\u06CC\u0646 \u0627\u0648\u0644\u06CC\u0646 \u0628\u0627\u0631\u06CC \u0627\u0633\u062A \u06A9\u0647 \u0648\u0627\u0631\u062F \u0645\u06CC\u200C\u0634\u0648\u06CC\u062F. \u0644\u0637\u0641\u0627\u064B \u06CC\u06A9 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0631\u0627\u06CC \u0645\u062F\u06CC\u0631\u06CC\u062A \u067E\u0646\u0644 \u062A\u0639\u06CC\u06CC\u0646 \u06A9\u0646\u06CC\u062F.",newPasswordLabel:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u062F\u06CC\u0631\u06CC\u062A (\u062C\u062F\u06CC\u062F)",confirmPasswordLabel:"\u062A\u06A9\u0631\u0627\u0631 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631",setupBtn:"\u0627\u06CC\u062C\u0627\u062F \u0648 \u0648\u0631\u0648\u062F",passwordTooShort:`\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 ${$} \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F`,passwordMismatch:"\u0631\u0645\u0632\u0647\u0627\u06CC \u0639\u0628\u0648\u0631 \u0628\u0627 \u0647\u0645 \u0645\u0637\u0627\u0628\u0642\u062A \u0646\u062F\u0627\u0631\u0646\u062F",panelTitle:"\u067E\u0646\u0644 \u0645\u062F\u06CC\u0631\u06CC\u062A",ssLinkLabel:"\u0644\u06CC\u0646\u06A9 \u0627\u062A\u0635\u0627\u0644 Shadowsocks",copyBtn:"\u06A9\u067E\u06CC \u0644\u06CC\u0646\u06A9",copiedMsg:"\u06A9\u067E\u06CC \u0634\u062F!",methodLabel:"\u0631\u0648\u0634 \u0631\u0645\u0632\u0646\u06AF\u0627\u0631\u06CC",remarkLabel:"\u0646\u0627\u0645 \u0646\u0648\u062F (Remark)",ssPasswordLabel:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 Shadowsocks",newAdminPasswordLabel:"\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0645\u062F\u06CC\u0631\u06CC\u062A \u062C\u062F\u06CC\u062F (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC)",newAdminPasswordPlaceholder:"\u062E\u0627\u0644\u06CC \u0628\u06AF\u0630\u0627\u0631\u06CC\u062F \u062A\u0627 \u062A\u063A\u06CC\u06CC\u0631 \u0646\u06A9\u0646\u062F",saveBtn:"\u0630\u062E\u06CC\u0631\u0647 \u062A\u063A\u06CC\u06CC\u0631\u0627\u062A",savedMsg:"\u0630\u062E\u06CC\u0631\u0647 \u0634\u062F \u2014 \u062F\u0631 \u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u0645\u062C\u062F\u062F...",saveError:"\u062E\u0637\u0627 \u062F\u0631 \u0630\u062E\u06CC\u0631\u0647\u200C\u0633\u0627\u0632\u06CC",logoutLink:"\u062E\u0631\u0648\u062C \u0627\u0632 \u062D\u0633\u0627\u0628",langLabel:"\u0632\u0628\u0627\u0646",running:"\u0627\u06CC\u0646 \u0633\u0631\u0648\u06CC\u0633 \u062F\u0631 \u062D\u0627\u0644 \u0627\u062C\u0631\u0627\u0633\u062A.",manageAt:"\u0628\u0631\u0627\u06CC \u0645\u062F\u06CC\u0631\u06CC\u062A \u0628\u0647",toManage:"\u0645\u0631\u0627\u062C\u0639\u0647 \u06A9\u0646\u06CC\u062F.",proxySectionTitle:"\u0627\u062A\u0635\u0627\u0644 / \u0622\u06CC\u200C\u067E\u06CC \u067E\u0631\u0648\u06A9\u0633\u06CC",proxyHostLabel:"\u0622\u06CC\u200C\u067E\u06CC \u0627\u062A\u0635\u0627\u0644 \u0633\u0641\u0627\u0631\u0634\u06CC (\u0627\u062E\u062A\u06CC\u0627\u0631\u06CC)",proxyHostPlaceholder:"\u062E\u0627\u0644\u06CC \u0628\u06AF\u0630\u0627\u0631\u06CC\u062F \u062A\u0627 \u0627\u0632 \u062F\u0627\u0645\u0646\u0647\u200C\u06CC \u062E\u0648\u062F Worker \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u0648\u062F",proxyHostHint:"\u0641\u0642\u0637 \u0622\u06CC\u200C\u067E\u06CC/\u0647\u0627\u0633\u062A\u06CC \u06A9\u0647 \u06A9\u0644\u0627\u06CC\u0646\u062A \u062F\u0631 \u0633\u0637\u062D \u0634\u0628\u06A9\u0647 \u0628\u0647\u0634 \u0648\u0635\u0644 \u0645\u06CC\u200C\u0634\u0648\u062F \u0639\u0648\u0636 \u0645\u06CC\u200C\u06A9\u0646\u062F\u061B SNI/TLS \u0648 Host \u0648\u0628\u200C\u0633\u0648\u06A9\u062A \u0647\u0645\u0686\u0646\u0627\u0646 \u062F\u0627\u0645\u0646\u0647\u200C\u06CC \u0648\u0627\u0642\u0639\u06CC \u0647\u0645\u06CC\u0646 Worker \u0645\u06CC\u200C\u0645\u0627\u0646\u062F. \u0628\u0631\u0627\u06CC \u062F\u0648\u0631 \u0632\u062F\u0646 \u06A9\u0646\u062F\u06CC/\u0645\u062D\u062F\u0648\u062F\u06CC\u062A \u0631\u0648\u06CC \u0622\u06CC\u200C\u067E\u06CC\u200C\u0647\u0627\u06CC \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 Cloudflare \u0645\u0641\u06CC\u062F \u0627\u0633\u062A\u060C \u0627\u0645\u0627 \u06A9\u0634\u0648\u0631 \u062E\u0631\u0648\u062C\u06CC \u062A\u0631\u0627\u0641\u06CC\u06A9 \u0631\u0627 \u0639\u0648\u0636 \u0646\u0645\u06CC\u200C\u06A9\u0646\u062F.",proxyPortLabel:"\u067E\u0648\u0631\u062A \u0627\u062A\u0635\u0627\u0644",invalidProxyHost:"\u0622\u06CC\u200C\u067E\u06CC/\u0647\u0627\u0633\u062A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A",vlessLinkLabel:"\u0644\u06CC\u0646\u06A9 \u0627\u062A\u0635\u0627\u0644 VLESS (V2rayNG\u060C NekoBox\u060C Shadowrocket \u0648...)",vlessHint:"\u0628\u0631\u0627\u06CC \u0627\u06A9\u062B\u0631 \u0627\u067E\u200C\u0647\u0627 \u0627\u06CC\u0646 \u0644\u06CC\u0646\u06A9 \u062A\u0648\u0635\u06CC\u0647 \u0645\u06CC\u200C\u0634\u0648\u062F \u2014 \u06A9\u0644\u0627\u06CC\u0646\u062A\u200C\u0647\u0627\u06CC \u0645\u0628\u062A\u0646\u06CC \u0628\u0631 Xray-core \u0628\u0647\u200C\u0635\u0648\u0631\u062A \u0628\u0648\u0645\u06CC \u0627\u0632 WebSocket+TLS \u0628\u0631\u0627\u06CC VLESS \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u06CC\u200C\u06A9\u0646\u0646\u060C \u0628\u062F\u0648\u0646 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u0647\u06CC\u0686 \u067E\u0644\u0627\u06AF\u06CC\u0646 \u0627\u0636\u0627\u0641\u0647\u200C\u0627\u06CC.",ssHint:"\u0628\u0631\u0627\u06CC \u06A9\u0644\u0627\u06CC\u0646\u062A\u200C\u0647\u0627\u06CC \u0627\u0635\u06CC\u0644 Shadowsocks (\u0645\u062B\u0644 Happ). \u0628\u0631\u062E\u06CC \u06A9\u0644\u0627\u06CC\u0646\u062A\u200C\u0647\u0627 \u2014 \u0628\u0647\u200C\u062E\u0635\u0648\u0635 V2rayNG \u2014 \u0627\u0632 \u062A\u0631\u0646\u0633\u067E\u0648\u0631\u062A WebSocket \u0628\u0631\u0627\u06CC Shadowsocks \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC\u200C\u06A9\u0646\u0646 \u0648 \u0627\u06CC\u0646 \u0644\u06CC\u0646\u06A9 \u0631\u0648 \u0628\u0647\u200C\u0635\u0648\u0631\u062A TCP \u0633\u0627\u062F\u0647 \u0648\u0635\u0644 \u0645\u06CC\u200C\u06A9\u0646\u0646\u061B \u0628\u0631\u0627\u06CC \u0627\u0648\u0646\u200C\u0647\u0627 \u0627\u0632 \u0644\u06CC\u0646\u06A9 VLESS \u0628\u0627\u0644\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.",regenVlessBtn:"\u0633\u0627\u062E\u062A \u0645\u062C\u062F\u062F \u0634\u0646\u0627\u0633\u0647 VLESS",regenVlessConfirm:"\u0628\u0627 \u0627\u06CC\u0646 \u06A9\u0627\u0631 \u0644\u06CC\u0646\u06A9 \u0641\u0639\u0644\u06CC VLESS \u0631\u0648\u06CC \u0647\u0645\u0647 \u062F\u0633\u062A\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC\u06CC \u06A9\u0647 \u0627\u0632\u0634 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u0646 \u0627\u0632 \u06A9\u0627\u0631 \u0645\u06CC\u200C\u0627\u0641\u062A\u0647. \u0627\u062F\u0627\u0645\u0647 \u0645\u06CC\u200C\u062F\u06CC\u062F\u061F"},ru:{dir:"ltr",htmlLang:"ru",loginTitle:"\u0412\u0445\u043E\u0434 \u0432 \u043F\u0430\u043D\u0435\u043B\u044C",passwordLabel:"\u041F\u0430\u0440\u043E\u043B\u044C \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",loginBtn:"\u0412\u043E\u0439\u0442\u0438",wrongPassword:"\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C",setupTitle:"\u041F\u0435\u0440\u0432\u043E\u043D\u0430\u0447\u0430\u043B\u044C\u043D\u0430\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430",setupDesc:"\u0412\u044B \u0432\u043F\u0435\u0440\u0432\u044B\u0435 \u0437\u0430\u0445\u043E\u0434\u0438\u0442\u0435 \u0432 \u043F\u0430\u043D\u0435\u043B\u044C. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u0434\u0430\u0439\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 \u0434\u043B\u044F \u0437\u0430\u0449\u0438\u0442\u044B \u043F\u0430\u043D\u0435\u043B\u0438.",newPasswordLabel:"\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430",confirmPasswordLabel:"\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C",setupBtn:"\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0438 \u0432\u043E\u0439\u0442\u0438",passwordTooShort:`\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u043D\u0435 \u043C\u0435\u043D\u0435\u0435 ${$} \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432`,passwordMismatch:"\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442",panelTitle:"\u041F\u0430\u043D\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F",ssLinkLabel:"\u0421\u0441\u044B\u043B\u043A\u0430 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F Shadowsocks",copyBtn:"\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0441\u044B\u043B\u043A\u0443",copiedMsg:"\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E!",methodLabel:"\u041C\u0435\u0442\u043E\u0434 \u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u0438\u044F",remarkLabel:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0443\u0437\u043B\u0430",ssPasswordLabel:"\u041F\u0430\u0440\u043E\u043B\u044C Shadowsocks",newAdminPasswordLabel:"\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",newAdminPasswordPlaceholder:"\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u043C\u0435\u043D\u044F\u0442\u044C",saveBtn:"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",savedMsg:"\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E \u2014 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430...",saveError:"\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F",logoutLink:"\u0412\u044B\u0439\u0442\u0438",langLabel:"\u042F\u0437\u044B\u043A",running:"\u0421\u0435\u0440\u0432\u0438\u0441 \u0437\u0430\u043F\u0443\u0449\u0435\u043D.",manageAt:"\u041F\u0435\u0440\u0435\u0439\u0434\u0438\u0442\u0435 \u0432",toManage:"\u0434\u043B\u044F \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F.",proxySectionTitle:"\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 / Proxy IP",proxyHostLabel:"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 IP \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)",proxyHostPlaceholder:"\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0434\u043E\u043C\u0435\u043D \u0441\u0430\u043C\u043E\u0433\u043E Worker",proxyHostHint:"\u041C\u0435\u043D\u044F\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E IP/\u0445\u043E\u0441\u0442, \u043A \u043A\u043E\u0442\u043E\u0440\u043E\u043C\u0443 \u043A\u043B\u0438\u0435\u043D\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0441\u0435\u0442\u0435\u0432\u043E\u043C \u0443\u0440\u043E\u0432\u043D\u0435; TLS/SNI \u0438 Host \u0434\u043B\u044F WebSocket \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C \u0434\u043E\u043C\u0435\u043D\u043E\u043C \u044D\u0442\u043E\u0433\u043E Worker. \u041F\u043E\u043B\u0435\u0437\u043D\u043E, \u0435\u0441\u043B\u0438 \u043F\u0440\u043E\u0432\u0430\u0439\u0434\u0435\u0440 \u0437\u0430\u043C\u0435\u0434\u043B\u044F\u0435\u0442 IP-\u0430\u0434\u0440\u0435\u0441\u0430 Cloudflare \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u2014 \u0441\u0442\u0440\u0430\u043D\u0443 \u0432\u044B\u0445\u043E\u0434\u0430 \u0442\u0440\u0430\u0444\u0438\u043A\u0430 \u044D\u0442\u043E \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442.",proxyPortLabel:"\u041F\u043E\u0440\u0442 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F",invalidProxyHost:"\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 IP/\u0438\u043C\u044F \u0445\u043E\u0441\u0442\u0430",vlessLinkLabel:"\u0421\u0441\u044B\u043B\u043A\u0430 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F VLESS (V2rayNG, NekoBox, Shadowrocket...)",vlessHint:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u0434\u043B\u044F \u0431\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u0430 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u2014 \u043A\u043B\u0438\u0435\u043D\u0442\u044B \u043D\u0430 \u0431\u0430\u0437\u0435 Xray-core \u043D\u0430\u0442\u0438\u0432\u043D\u043E \u043F\u043E\u043D\u0438\u043C\u0430\u044E\u0442 WebSocket+TLS \u0434\u043B\u044F VLESS, \u0431\u0435\u0437 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u043B\u0430\u0433\u0438\u043D\u0430.",ssHint:"\u0414\u043B\u044F \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 \u0441 \u043D\u0430\u0442\u0438\u0432\u043D\u043E\u0439 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u043E\u0439 Shadowsocks (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, Happ). \u041D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043A\u043B\u0438\u0435\u043D\u0442\u044B \u2014 \u0432 \u0447\u0430\u0441\u0442\u043D\u043E\u0441\u0442\u0438 V2rayNG \u2014 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0442 \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 WebSocket \u0434\u043B\u044F Shadowsocks \u0438 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0430\u0442\u0441\u044F \u043F\u043E \u043E\u0431\u044B\u0447\u043D\u043E\u043C\u0443 TCP; \u0434\u043B\u044F \u043D\u0438\u0445 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 VLESS \u0432\u044B\u0448\u0435.",regenVlessBtn:"\u041F\u0435\u0440\u0435\u0441\u043E\u0437\u0434\u0430\u0442\u044C VLESS ID",regenVlessConfirm:"\u042D\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u0435\u0442 \u0442\u0435\u043A\u0443\u0449\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443 VLESS \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0439 \u043D\u0430 \u0432\u0441\u0435\u0445 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430\u0445, \u0433\u0434\u0435 \u043E\u043D\u0430 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F. \u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C?"}};function He(e){const t=te(e,"lang");if(t&&pe[t])return t;const n=(e.headers.get("Accept-Language")||"").toLowerCase();return n.includes("fa")?"fa":n.includes("zh")?"zh":n.includes("ru")?"ru":"en"}async function Q(e,t){if(!e.KV)return t;try{const n=await e.KV.get("config.json");if(!n)return t;const o={...t,...JSON.parse(n)};return o.adminAuth&&!o.vlessUuid&&(o.vlessUuid=crypto.randomUUID(),await Z(e,o)),o}catch{return t}}async function Z(e,t){if(!e.KV)throw new Error("KV binding is not configured");await e.KV.put("config.json",JSON.stringify(t,null,2))}function Ne(e){return{password:e.PASSWORD||"change-me-please",method:R[e.METHOD]?e.METHOD:"aes-128-gcm",remark:e.REMARK||T.name,adminAuth:null,proxyHost:"",proxyPort:443,vlessUuid:null}}function fe(e,t){const n=Se(j.encode(`${t.method}:${t.password}`)),o=t.proxyHost&&String(t.proxyHost).trim()?String(t.proxyHost).trim():e,r=O.includes(Number(t.proxyPort))?Number(t.proxyPort):443,l=`v2ray-plugin;mode=websocket;tls;host=${e};path=${ae}`;return`ss://${n}@${o}:${r}/?plugin=${encodeURIComponent(l)}#${encodeURIComponent(t.remark)}`}function Be(e,t){const n=t.proxyHost&&String(t.proxyHost).trim()?String(t.proxyHost).trim():e,o=O.includes(Number(t.proxyPort))?Number(t.proxyPort):443,r=new URLSearchParams({type:"ws",security:"tls",host:e,sni:e,path:se,encryption:"none"});return`vless://${t.vlessUuid}@${n}:${o}?${r.toString()}#${encodeURIComponent(t.remark+" (VLESS)")}`}function Ve(e,t){const n=Ee.map(o=>`<a href="#" class="langItem ${o===e?"active":""}" data-lang="${o}">${i(Te[o])}</a>`).join("");return`<div class="langSwitch">
<button type="button" class="langBtn" aria-label="${i(t.langLabel)}" title="${i(t.langLabel)}" onclick="this.nextElementSibling.classList.toggle('open')">\u{1F310}</button>
<div class="langMenu">${n}</div>
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
<\/script>`}function z(e,t,n,o){return`<!DOCTYPE html><html lang="${o.htmlLang}" dir="${o.dir}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${i(e)} \xB7 ${T.name}</title>
<style>
:root{--from:${w.gradFrom};--mid:${w.gradMid};--via:${w.gradVia};--to:${w.gradTo};}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:
radial-gradient(circle at 15% -10%,rgba(124,92,255,.16),transparent 45%),
radial-gradient(circle at 110% 10%,rgba(236,72,153,.14),transparent 40%),${w.bg};
color:${w.text};
font-family:-apple-system,Segoe UI,Roboto,Vazirmatn,"Noto Sans SC","Noto Sans",sans-serif;
display:flex;align-items:center;justify-content:center;padding:24px}
.card{width:100%;max-width:440px;background:${w.card};border-radius:22px;padding:32px;
box-shadow:0 24px 70px rgba(124,92,255,.25),0 2px 0 rgba(255,255,255,.03) inset;
border:1px solid rgba(255,255,255,.07);position:relative;animation:rise .45s ease both}
@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.card{animation:none}}
.langSwitch{position:absolute;top:14px;${o.dir==="rtl"?"left":"right"}:14px}
.langBtn{width:36px;height:36px;padding:0;margin:0;border-radius:50%;font-size:17px;line-height:1;
background:#0d0616;border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;
transition:filter .15s,transform .15s}
.langBtn:hover{filter:brightness(1.2);transform:translateY(-1px)}
.langMenu{display:none;position:absolute;top:42px;${o.dir==="rtl"?"left":"right"}:0;min-width:140px;
background:${w.card};border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:6px;
box-shadow:0 12px 30px rgba(0,0,0,.45);z-index:10}
.langMenu.open{display:block;animation:pop .12s ease both}
@keyframes pop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
.langMenu a{display:block;padding:8px 10px;border-radius:8px;color:${w.text};text-decoration:none;font-size:13px;transition:background .12s}
.langMenu a:hover{background:rgba(255,255,255,.07)}
.langMenu a.active{color:var(--via);font-weight:700}
.logo{width:60px;height:60px;border-radius:16px;margin:0 auto 16px;
background:linear-gradient(135deg,var(--from),var(--mid) 40%,var(--via) 70%,var(--to));
display:flex;align-items:center;justify-content:center;font-weight:800;font-size:26px;color:#fff;
box-shadow:0 10px 26px rgba(192,38,211,.35)}
h1{font-size:20px;font-weight:700;text-align:center;margin:0 0 24px;letter-spacing:.2px}
p.desc{font-size:13px;color:${w.muted};text-align:center;margin:-10px 0 20px;line-height:1.7}
label{font-size:12.5px;font-weight:600;color:${w.muted};display:block;margin:14px 0 6px;letter-spacing:.2px}
input,select.field{width:100%;padding:11px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.12);
background:#0d0616;color:${w.text};font-size:14px;transition:border-color .15s,box-shadow .15s;outline:none}
input:focus,select.field:focus{border-color:var(--via);box-shadow:0 0 0 3px rgba(192,38,211,.18)}
input::placeholder{color:rgba(199,184,230,.45)}
button{width:100%;margin-top:20px;padding:12px;border:0;border-radius:10px;font-weight:700;font-size:14px;
color:#fff;cursor:pointer;background:linear-gradient(135deg,var(--from),var(--via));
transition:filter .15s,transform .1s;display:flex;align-items:center;justify-content:center;gap:8px}
button:hover{filter:brightness(1.1)}
button:active{transform:scale(.98)}
button.secondary{background:#0d0616;border:1px solid rgba(255,255,255,.14);margin-top:10px}
button.secondary:hover{filter:brightness(1.2)}
.linkbox{margin-top:10px;padding:12px;border-radius:10px;background:#0d0616;border:1px solid rgba(255,255,255,.1);
font-size:12px;word-break:break-all;color:${w.muted};font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.qrWrap{margin-top:14px;display:flex;justify-content:center}
.qrBox{background:#fff;padding:12px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.35);line-height:0}
.row{display:flex;gap:10px}
.row>div{flex:1}
a.ghost{display:block;text-align:center;margin-top:14px;color:${w.muted};font-size:13px;text-decoration:none;transition:color .15s}
a.ghost:hover{color:${w.text}}
.msg{font-size:13px;text-align:center;margin-top:10px;min-height:16px;transition:opacity .15s}
.msg.err{color:#f87171}
.msg.ok{color:#4ade80}
.hr{margin:22px 0 4px;padding-top:14px;border-top:1px solid rgba(255,255,255,.08)}
.footer{margin-top:22px;text-align:center;font-size:12px;color:${w.muted}}
.footer a{color:${w.muted};text-decoration:none}
.footer a:hover{color:${w.text}}
</style></head><body><div class="card">
${Ve(n,o)}
<div class="logo">N</div>
<h1>${i(e)}</h1>
${t}
<div class="footer">${T.name} \xB7 <a href="${T.telegram}" target="_blank">Telegram</a> \xB7 <a href="${T.github}" target="_blank">GitHub</a></div>
</div></body></html>`}function Ue(e,t){return z(e.loginTitle,`
<form id="f">
<label>${i(e.passwordLabel)}</label>
<input type="password" name="password" required autofocus>
<button type="submit">${i(e.loginBtn)}</button>
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
		m.textContent = j.error || ${JSON.stringify(e.wrongPassword)};
		m.className = 'msg err';
	} catch (err) {
		m.textContent = ${JSON.stringify(e.wrongPassword)};
		m.className = 'msg err';
	}
});
<\/script>`,t,e)}function Me(e,t){return z(e.setupTitle,`
<p class="desc">${i(e.setupDesc)}</p>
<form id="f">
<label>${i(e.newPasswordLabel)}</label>
<input type="password" name="password" minlength="${$}" required autofocus>
<label>${i(e.confirmPasswordLabel)}</label>
<input type="password" name="confirmPassword" minlength="${$}" required>
<button type="submit">${i(e.setupBtn)}</button>
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
		m.textContent = j.error || ${JSON.stringify(e.saveError)};
		m.className = 'msg err';
	} catch (err) {
		m.textContent = ${JSON.stringify(e.saveError)};
		m.className = 'msg err';
	}
});
<\/script>`,t,e)}function Ie(e,t,n,o){const r=fe(e,t),l=Be(e,t);return z(n.panelTitle,`
<label>${i(n.vlessLinkLabel)}</label>
<div class="linkbox" id="vlesslink">${i(l)}</div>
<button type="button" class="copyBtn" data-target="vlesslink">
<svg class="copyIcon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
<span class="copyLabel">${i(n.copyBtn)}</span>
</button>
<div class="qrWrap"><div class="qrBox" data-qr-for="vlesslink"></div></div>
<p class="desc" style="margin:8px 0 0">${i(n.vlessHint)}</p>

<label class="hr">${i(n.ssLinkLabel)}</label>
<div class="linkbox" id="sslink">${i(r)}</div>
<button type="button" class="copyBtn" data-target="sslink">
<svg class="copyIcon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
<span class="copyLabel">${i(n.copyBtn)}</span>
</button>
<div class="qrWrap"><div class="qrBox" data-qr-for="sslink"></div></div>
<p class="desc" style="margin:8px 0 0">${i(n.ssHint)}</p>

<form id="cfgForm">
<div class="row">
<div><label>${i(n.methodLabel)}</label>
<select name="method" class="field">
<option value="aes-128-gcm" ${t.method==="aes-128-gcm"?"selected":""}>aes-128-gcm</option>
<option value="aes-256-gcm" ${t.method==="aes-256-gcm"?"selected":""}>aes-256-gcm</option>
</select></div>
<div><label>${i(n.remarkLabel)}</label>
<input name="remark" value="${i(t.remark)}"></div>
</div>
<label>${i(n.ssPasswordLabel)}</label>
<input name="password" value="${i(t.password)}">

<label class="hr">${i(n.proxySectionTitle)}</label>
<div class="row">
<div><label>${i(n.proxyHostLabel)}</label>
<input name="proxyHost" value="${i(t.proxyHost||"")}" placeholder="${i(n.proxyHostPlaceholder)}"></div>
<div><label>${i(n.proxyPortLabel)}</label>
<select name="proxyPort" class="field">
${O.map(y=>`<option value="${y}" ${Number(t.proxyPort)===y?"selected":""}>${y}</option>`).join("")}
</select></div>
</div>
<p class="desc" style="margin:8px 0 0;text-align:start">${i(n.proxyHostHint)}</p>

<label>${i(n.newAdminPasswordLabel)}</label>
<input name="adminPassword" type="password" minlength="${$}" placeholder="${i(n.newAdminPasswordPlaceholder)}">
<button type="submit">${i(n.saveBtn)}</button>
<button type="button" class="secondary" id="regenBtn">${i(n.regenVlessBtn)}</button>
<div class="msg" id="m"></div>
</form>
<a class="ghost" href="/logout">${i(n.logoutLink)}</a>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
<script>
(function(){
	// Rendered client-side straight from the same link text shown above and
	// copied by its button, so each QR always matches exactly \u2014 no separate
	// encoding path to drift out of sync.
	document.querySelectorAll('.qrBox').forEach(function(box){
		const src = document.getElementById(box.dataset.qrFor);
		try {
			new QRCode(box, { text: src.textContent, width: 200, height: 200,
				colorDark: '#0b0510', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
		} catch (e) { box.closest('.qrWrap').style.display = 'none'; }
	});
	document.querySelectorAll('.copyBtn').forEach(function(btn){
		btn.addEventListener('click', function(){
			navigator.clipboard.writeText(document.getElementById(btn.dataset.target).textContent);
			const label = btn.querySelector('.copyLabel');
			const icon = btn.querySelector('.copyIcon');
			const originalLabel = label.textContent;
			const originalIcon = icon.innerHTML;
			label.textContent = ${JSON.stringify(n.copiedMsg)};
			icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
			setTimeout(function(){ label.textContent = originalLabel; icon.innerHTML = originalIcon; }, 1500);
		});
	});
	document.getElementById('regenBtn').addEventListener('click', async function(){
		if (!confirm(${JSON.stringify(n.regenVlessConfirm)})) return;
		const m = document.getElementById('m');
		try {
			const r = await fetch('/panel/config.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ regenerateVlessUuid: true }) });
			const j = await r.json().catch(function(){ return {}; });
			if (r.ok && j.success) { location.reload(); }
			else { m.textContent = j.error || ${JSON.stringify(n.saveError)}; m.className = 'msg err'; }
		} catch (err) { m.textContent = ${JSON.stringify(n.saveError)}; m.className = 'msg err'; }
	});
})();
document.getElementById('cfgForm').addEventListener('submit', async (e) => {
	e.preventDefault();
	const fd = new FormData(e.target);
	const body = Object.fromEntries(fd.entries());
	if (!body.adminPassword) delete body.adminPassword;
	const m = document.getElementById('m');
	try {
		const r = await fetch('/panel/config.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
		const j = await r.json().catch(() => ({}));
		if (r.ok && j.success) { m.textContent = ${JSON.stringify(n.savedMsg)}; m.className = 'msg ok'; setTimeout(() => location.reload(), 700); }
		else { m.textContent = j.error || ${JSON.stringify(n.saveError)}; m.className = 'msg err'; }
	} catch (err) {
		m.textContent = ${JSON.stringify(n.saveError)}; m.className = 'msg err';
	}
});
<\/script>`,o,n)}function V(e){try{(e.readyState===WebSocket.OPEN||e.readyState===WebSocket.CLOSING)&&e.close()}catch{}}async function _(e,t){const n=e.send(t);n&&typeof n.then=="function"&&await n}async function Re(e,t){const n=new WebSocketPair,[o,r]=Object.values(n);r.accept(),r.binaryType="arraybuffer";const l=R[t.method]||R["aes-128-gcm"],y=[l,...Object.values(R).filter(c=>c!==l)];let h=null,p=null,d=new Uint8Array(0),a=null,u=null,s=null,k=!1,b=!1,f=null,P=null,E=null,M=!1,I=new Map;const N=async c=>(I.has(c.keyLen)||I.set(c.keyLen,await Pe(t.password,c.keyLen)),I.get(c.keyLen));async function me(){const c=2+F;for(const g of y){const m=g.saltLen+c;if(d.byteLength<m)continue;const L=d.subarray(0,g.saltLen),S=d.subarray(g.saltLen,m);try{const v=await N(g),x=await ce(g,v,L,["decrypt"]),C=new Uint8Array(oe),B=await Y(x,C,S);if(B.byteLength!==2)continue;const q=B[0]<<8|B[1];if(q<0||q>X)continue;return d=d.subarray(m),a=x,u=C,s=q,k=!0,!0}catch{}}return!1}async function he(){const c=[];if(!k&&!await me())return c;for(;;){if(s===null){const S=2+F;if(d.byteLength<S)break;const v=d.subarray(0,S);d=d.subarray(S);const x=await Y(a,u,v);if(s=x[0]<<8|x[1],s<0||s>X)throw new Error("bad SS chunk length")}const g=s+F;if(d.byteLength<g)break;const m=d.subarray(0,g);d=d.subarray(g);const L=await Y(a,u,m);c.push(L),s=null}return c}async function ye(){if(f)return;const c=await N(l);E=crypto.getRandomValues(new Uint8Array(l.saltLen)),f=await ce(l,c,E,["encrypt"]),P=new Uint8Array(oe)}async function we(c){await ye();const g=W(c);M||(await _(r,E.buffer),M=!0);let m=0;for(;m<g.byteLength||m===0&&g.byteLength===0;){const L=Math.min(m+X,g.byteLength),S=g.subarray(m,L),v=new Uint8Array(2);v[0]=S.byteLength>>>8&255,v[1]=S.byteLength&255;const x=await de(f,P,v),C=await de(f,P,S);if(await _(r,H(x,C).buffer),g.byteLength===0)break;m=L}}async function be(c,g,m){const L=re({hostname:c,port:g});h=L,p=L.writable.getWriter(),m&&m.byteLength&&await p.write(m),(async()=>{try{const S=L.readable.getReader();for(;;){const{done:v,value:x}=await S.read();if(v)break;x&&x.byteLength&&await we(x)}}catch{}finally{V(r)}})()}function xe(c){if(c.byteLength<4)throw new Error("ss header too short");const g=c[0];let m=1,L="";if(g===1)L=`${c[1]}.${c[2]}.${c[3]}.${c[4]}`,m=5;else if(g===3){const x=c[1];L=ie.decode(c.subarray(2,2+x)),m=2+x}else if(g===4){const x=[];for(let C=0;C<8;C++){const B=2+C*2;x.push((c[B]<<8|c[B+1]).toString(16))}L=x.join(":"),m=18}else throw new Error("unsupported ss address type "+g);const S=c[m]<<8|c[m+1],v=c.subarray(m+2);return{hostname:L,port:S,rest:v}}let ne=Promise.resolve();return r.addEventListener("message",c=>{ne=ne.then(async()=>{try{const g=W(c.data);d=H(d,g);const m=await he();for(const L of m)if(b)p&&await p.write(L);else{b=!0;const{hostname:S,port:v,rest:x}=xe(L);await be(S,v,x)}}catch{V(r);try{h?.close()}catch{}}})}),r.addEventListener("close",()=>{try{h?.close()}catch{}}),r.addEventListener("error",()=>{try{h?.close()}catch{}V(r)}),new Response(null,{status:101,webSocket:o})}function Oe(e,t){if(e.byteLength<18)return null;const n=e.subarray(1,17);if(!ve(n,t))throw new Error("vless: uuid mismatch");let r=18+e[17];if(e.byteLength<r+1+2+1)return null;const l=e[r];if(r+=1,l!==1)throw new Error("vless: only TCP command is supported");const y=e[r]<<8|e[r+1];r+=2;const h=e[r];r+=1;let p="";if(h===1){if(e.byteLength<r+4)return null;p=`${e[r]}.${e[r+1]}.${e[r+2]}.${e[r+3]}`,r+=4}else if(h===2){if(e.byteLength<r+1)return null;const d=e[r];if(r+=1,e.byteLength<r+d)return null;p=ie.decode(e.subarray(r,r+d)),r+=d}else if(h===3){if(e.byteLength<r+16)return null;const d=[];for(let a=0;a<8;a++){const u=r+a*2;d.push((e[u]<<8|e[u+1]).toString(16))}p=d.join(":"),r+=16}else throw new Error("vless: unsupported address type "+h);return{hostname:p,port:y,rest:e.subarray(r)}}async function je(e,t){const n=new WebSocketPair,[o,r]=Object.values(n);r.accept(),r.binaryType="arraybuffer";const l=ke(t.vlessUuid);let y=null,h=null,p=new Uint8Array(0),d=!1,a=!1;async function u(b){const f=W(b);a?await _(r,f.buffer):(await _(r,H(new Uint8Array([0,0]),f).buffer),a=!0)}async function s(b,f,P){const E=re({hostname:b,port:f});y=E,h=E.writable.getWriter(),P&&P.byteLength&&await h.write(P),(async()=>{try{const M=E.readable.getReader();for(;;){const{done:I,value:N}=await M.read();if(I)break;N&&N.byteLength&&await u(N)}a||await u(new Uint8Array(0))}catch{}finally{V(r)}})()}let k=Promise.resolve();return r.addEventListener("message",b=>{k=k.then(async()=>{try{const f=W(b.data);if(d)h&&await h.write(f);else{p=H(p,f);const P=Oe(p,l);if(!P)return;d=!0,p=new Uint8Array(0),await s(P.hostname,P.port,P.rest)}}catch{V(r);try{y?.close()}catch{}}})}),r.addEventListener("close",()=>{try{y?.close()}catch{}}),r.addEventListener("error",()=>{try{y?.close()}catch{}V(r)}),new Response(null,{status:101,webSocket:o})}async function G(e,t){return D(`${T.name}:${e}:${t}`)}function ee(e){return`auth=${e}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Lax`}function te(e,t){const n=e.headers.get("Cookie")||"";for(const o of n.split(";")){const r=o.trim(),l=r.indexOf("=");if(l!==-1&&r.slice(0,l)===t)return r.slice(l+1)}}function U(e){return new Response("redirecting...",{status:302,headers:{Location:e}})}function A(e,t=200){return new Response(JSON.stringify(e),{status:t,headers:{"Content-Type":"application/json"}})}function J(e,t=200){return new Response(e,{status:t,headers:{"Content-Type":"text/html;charset=utf-8"}})}async function ge(e){try{return new URLSearchParams(await e.text())}catch{return new URLSearchParams}}var De={async fetch(e,t,n){const o=new URL(e.url),r=o.pathname,l=e.headers.get("User-Agent")||"",y=(e.headers.get("Upgrade")||"").toLowerCase(),h=He(e),p=pe[h],d=Ne(t);if(r===ae&&y==="websocket"){const u=await Q(t,d);return Re(e,u)}if(r===se&&y==="websocket"){const u=await Q(t,d);return u.vlessUuid?je(e,u):new Response("VLESS not configured yet \u2014 visit /setup first.",{status:503})}if(!t.KV)return new Response('KV binding "KV" is not configured for this Worker.',{status:500});const a=await Q(t,d);if(r==="/setup"){if(a.adminAuth)return U("/login");if(e.method==="POST"){const u=await ge(e),s=u.get("password")||"",k=u.get("confirmPassword")||"";if(s.length<$)return A({success:!1,error:p.passwordTooShort},400);if(s!==k)return A({success:!1,error:p.passwordMismatch},400);a.adminAuth=await ue(s),a.vlessUuid||(a.vlessUuid=crypto.randomUUID()),await Z(t,a);const b=await G(a.adminAuth,l),f=A({success:!0});return f.headers.set("Set-Cookie",ee(b)),f}return J(Me(p,h))}if(r==="/login"){if(!a.adminAuth)return U("/setup");const u=await G(a.adminAuth,l);if(te(e,"auth")===u)return U("/panel");if(e.method==="POST"){const k=(await ge(e)).get("password")||"";if(!await Ce(k,a.adminAuth))return A({success:!1,error:p.wrongPassword},401);const f=A({success:!0});return f.headers.set("Set-Cookie",ee(u)),f}return J(Ue(p,h))}if(r==="/logout"){const u=U("/login");return u.headers.set("Set-Cookie","auth=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax"),u}if(r==="/panel"||r.startsWith("/panel/")){if(!a.adminAuth)return U("/setup");const u=await G(a.adminAuth,l);if(te(e,"auth")!==u)return U("/login");if(r==="/panel/config.json"&&e.method==="POST")try{const s=await e.json();if(s.method&&R[s.method]&&(a.method=s.method),typeof s.remark=="string"&&s.remark&&(a.remark=s.remark),typeof s.password=="string"&&s.password&&s.password!==a.password&&(a.password=s.password,K.clear()),typeof s.proxyHost=="string"){const f=s.proxyHost.trim();if(f&&!Le.test(f))return A({success:!1,error:p.invalidProxyHost},400);a.proxyHost=f}if(typeof s.proxyPort<"u"){const f=Number(s.proxyPort);O.includes(f)&&(a.proxyPort=f)}s.regenerateVlessUuid&&(a.vlessUuid=crypto.randomUUID());let k=null;if(typeof s.adminPassword=="string"&&s.adminPassword){if(s.adminPassword.length<$)return A({success:!1,error:p.passwordTooShort},400);a.adminAuth=await ue(s.adminPassword),k=ee(await G(a.adminAuth,l))}await Z(t,a);const b=A({success:!0});return k&&b.headers.set("Set-Cookie",k),b}catch(s){return A({success:!1,error:s.message},500)}return J(Ie(o.host,a,p,h))}if(r==="/sub"){if(!a.adminAuth)return new Response("Not found",{status:404});const u=await D(`${o.host}:${a.adminAuth}`);return o.searchParams.get("token")!==u?new Response("Not found",{status:404}):new Response(btoa(fe(o.host,a)),{status:200,headers:{"Content-Type":"text/plain;charset=utf-8"}})}return r==="/robots.txt"?new Response(`User-agent: *
Disallow: /`,{status:200,headers:{"Content-Type":"text/plain"}}):J(z(T.name,`
<p style="text-align:center;color:${w.muted};font-size:14px;line-height:1.8">
${i(p.running)}<br>${i(p.manageAt)} <a href="/panel" style="color:${w.text}">/panel</a> ${i(p.toManage)}
</p>`,h,p))}};export{De as default};
