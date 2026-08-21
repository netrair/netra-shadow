# 💜 Netra Shadow 

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Shadowsocks](https://img.shields.io/badge/Protocol-Shadowsocks-00ADD8?style=for-the-badge&logo=v&logoColor=white)](https://shadowsocks.org/)

A free, self-hosted Shadowsocks-over-WebSocket relay that runs entirely on **Cloudflare Workers**. No VPS. No server maintenance. No monthly cost. Traffic is tunneled over WebSocket, and a lightweight web panel lets you manage the setup.

[🇮🇷 فارسی](#-فارسی) | [🇷🇺 Русский](#-русский) | [🇨🇳 中文](#-中文)

[Report a Bug](https://github.com/netrair/netra-shadow/issues) · [Request a Feature](https://github.com/netrair/netra-shadow/issues) · [Telegram Support](https://t.me/NetraIR)

---

### ✨ Features

- ⚡ **Runs on Cloudflare Workers** — no VPS, no Docker, no server to patch or reboot
- **Shadowsocks AEAD** support (`aes-128-gcm` and `aes-256-gcm`)
- **WebSocket transport** to help traffic blend in on restrictive networks
- **Ready-made subscription link** for Shadowsocks clients
- **Full web panel** in 4 languages (English, Persian, Russian, Chinese) — manage password, cipher, remark, and connect IP without touching code
- **Custom connect IP/port** — useful when your ISP throttles Cloudflare's default IPs
- Security: salted password hashing, timing-safe comparison, and full HTML-escaping in the panel

---

### Deploy

1. Create a new Worker in your [Cloudflare dashboard](https://dash.cloudflare.com).
2. Paste the contents of `worker.js` into the Worker editor and deploy.
3. Add a **KV Namespace** binding named `KV` to the Worker (Settings → Variables → KV Namespace Bindings).
4. Open your Worker's URL and go to `/panel` — you'll be prompted to set an admin password on first visit.

That's it. Your Shadowsocks connection link is available from the panel, and you can change the password, cipher, or connect IP anytime.

---

### Security notes

- Choose a strong panel password and keep it secret — anyone with panel access can see your connection link.
- Treat your Worker URL like a secret.
- Change the default Shadowsocks password from the panel before sharing your subscription link.

---

### Support

Questions or issues? Reach out on Telegram: **[@NetraIR](https://t.me/NetraIR)**

---

<details>
<summary>🇮🇷 فارسی</summary>

### درباره‌ی Netra

یک ریلی Shadowsocks که کاملاً روی **Cloudflare Workers** اجرا می‌شه — بدون نیاز به VPS، بدون نگهداری سرور، بدون هزینه‌ی ماهانه. ترافیک از طریق WebSocket تونل می‌شه و یک پنل وب ساده برای مدیریت تنظیمات در اختیارتون قرار می‌گیره.

[گزارش باگ](https://github.com/netrair/netra-shadow/issues) · [درخواست ویژگی جدید](https://github.com/netrair/netra-shadow/issues) · [پشتیبانی تلگرام](https://t.me/NetraIR)

#### ✨ ویژگی‌ها

- ⚡ **کاملاً روی Cloudflare Workers اجرا می‌شه** — بدون VPS، بدون Docker، بدون سروری که نیاز به آپدیت یا ری‌استارت داشته باشه
- پشتیبانی از **Shadowsocks AEAD** (`aes-128-gcm` و `aes-256-gcm`)
- انتقال روی **WebSocket** برای عبور بهتر از فیلترینگ
- **لینک سابسکریپشن** آماده برای کلاینت‌های Shadowsocks
- **پنل وب کامل** با پشتیبانی از ۴ زبان (فارسی، انگلیسی، روسی، چینی) — رمز، متد رمزنگاری، remark و IP اتصال بدون نیاز به دست‌زدن به کد قابل مدیریته
- **IP/پورت اتصال سفارشی** — برای زمانی که ISP شما IP پیش‌فرض Cloudflare رو محدود کرده
- امنیت: هش رمز با salt، مقایسه‌ی timing-safe، و escape کامل ورودی‌ها در پنل

#### نصب و دیپلوی

1. یک Worker جدید توی [داشبورد Cloudflare](https://dash.cloudflare.com) بسازید.
2. محتوای فایل `worker.js` رو کپی و توی ویرایشگر Worker جای‌گذاری و دیپلوی کنید.
3. یک **KV Namespace** با نام `KV` به Worker متصل کنید (از مسیر Settings → Variables → KV Namespace Bindings).
4. آدرس Worker خودتون رو باز کنید و برید به `/panel` — بار اول ازتون خواسته می‌شه یک رمز ادمین برای پنل تعیین کنید.

بعد از اون، لینک اتصال Shadowsocks از داخل پنل در دسترستونه و می‌تونید رمز، متد رمزنگاری و IP اتصال رو هر وقت خواستید عوض کنید.

#### نکات امنیتی

- رمز پنل رو قوی انتخاب کنید و اونو محرمانه نگه دارید — هرکسی که به پنل دسترسی داشته باشه می‌تونه لینک اتصال شما رو ببینه.
- با آدرس Workerتون مثل یک اطلاعات محرمانه رفتار کنید.
- قبل از اشتراک‌گذاری لینک سابسکریپشن، رمز پیش‌فرض Shadowsocks رو از پنل عوض کنید.

#### پشتیبانی

سوال یا مشکلی دارید؟ توی تلگرام پیام بدید: **[@NetraIR](https://t.me/NetraIR)**

</details>

<details>
<summary>🇷🇺 Русский</summary>

### О проекте Netra

Бесплатный self-hosted ретранслятор Shadowsocks-over-WebSocket, который полностью работает на **Cloudflare Workers**. Без VPS, без обслуживания сервера, без ежемесячной платы. Трафик туннелируется через WebSocket, а простая веб-панель позволяет управлять настройками.

[Сообщить об ошибке](https://github.com/netrair/netra-shadow/issues) · [Предложить функцию](https://github.com/netrair/netra-shadow/issues) · [Поддержка в Telegram](https://t.me/NetraIR)

#### ✨ Возможности

- ⚡ **Работает на Cloudflare Workers** — не нужен VPS, Docker или обслуживание сервера
- Поддержка **Shadowsocks AEAD** (`aes-128-gcm` и `aes-256-gcm`)
- Передача через **WebSocket** для лучшего обхода фильтрации
- Готовая **ссылка подписки** для клиентов Shadowsocks
- **Полноценная веб-панель** на 4 языках (русский, английский, персидский, китайский) — пароль, шифр, remark и IP подключения без изменения кода
- **Свой IP/порт подключения** — если провайдер ограничивает стандартные IP Cloudflare
- Безопасность: хеширование пароля с солью, timing-safe сравнение и полное экранирование ввода в панели

#### Установка

1. Создайте новый Worker в [панели Cloudflare](https://dash.cloudflare.com).
2. Вставьте содержимое файла `worker.js` в редактор Worker и разверните его.
3. Добавьте привязку **KV Namespace** с именем `KV` к Worker (Settings → Variables → KV Namespace Bindings).
4. Откройте URL вашего Worker и перейдите на `/panel` — при первом входе будет предложено задать пароль администратора.

Готово. Ссылка подключения Shadowsocks доступна прямо в панели, где можно в любой момент сменить пароль, шифр или IP подключения.

#### Заметки по безопасности

- Выберите надёжный пароль панели и держите его в секрете — любой с доступом к панели увидит вашу ссылку подключения.
- Относитесь к URL вашего Worker как к секретной информации.
- Смените стандартный пароль Shadowsocks в панели перед тем, как делиться ссылкой подписки.

#### Поддержка

Вопросы или проблемы? Пишите в Telegram: **[@NetraIR](https://t.me/NetraIR)**

</details>

<details>
<summary>🇨🇳 中文</summary>

### 关于 Netra

一个完全运行在 **Cloudflare Workers** 上的免费自托管 Shadowsocks-over-WebSocket 中继。无需 VPS，无需维护服务器，无需每月付费。流量通过 WebSocket 隧道传输，并提供一个简洁的网页面板用于管理配置。

[提交 Bug](https://github.com/netrair/netra-shadow/issues) · [功能建议](https://github.com/netrair/netra-shadow/issues) · [Telegram 支持](https://t.me/NetraIR)

#### ✨ 功能特点

- ⚡ **完全运行在 Cloudflare Workers 上** —— 无需 VPS、Docker，也无需维护或重启服务器
- 支持 **Shadowsocks AEAD**（`aes-128-gcm` 和 `aes-256-gcm`）
- **WebSocket 传输**，帮助流量更好地绕过网络封锁
- 为 Shadowsocks 客户端提供**现成的订阅链接**
- 支持 4 种语言（中文、英文、波斯语、俄语）的**完整网页面板** —— 无需接触代码即可管理密码、加密方式、备注和连接 IP
- **自定义连接 IP/端口** —— 当你的 ISP 限制 Cloudflare 默认 IP 时很有用
- 安全性：带盐密码哈希、timing-safe 比较，以及面板中完整的 HTML 转义

#### 部署方法

1. 前往你的 [Cloudflare 控制台](https://dash.cloudflare.com) 手动创建一个新的 Worker。
2. 将 `worker.js` 的内容复制并粘贴到 Worker 编辑器中，然后部署。
3. 为该 Worker 添加一个名为 `KV` 的 **KV Namespace** 绑定（路径：Settings → Variables → KV Namespace Bindings）。
4. 打开你的 Worker 地址并访问 `/panel` —— 首次访问时会提示你设置管理员密码。

完成后，你可以在面板中获取 Shadowsocks 连接链接，并随时修改密码、加密方式或连接 IP。

#### 安全提示

- 选择一个强密码并妥善保管 —— 任何有面板访问权限的人都能看到你的连接链接。
- 请像对待机密信息一样对待你的 Worker 地址。
- 在分享订阅链接前，请务必在面板中修改默认的 Shadowsocks 密码。

#### 获取支持

有问题或遇到故障？请通过 Telegram 联系：**[@NetraIR](https://t.me/NetraIR)**

</details>

---

Made with ❤️ for a freer internet.

