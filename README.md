# Car detailing site — minimal template

A simple one-page site: contact info, services, photos/videos of completed work, reviews.
Hosted on GitHub Pages — completely free, no third-party services needed.

Everything editable lives in one file — **content.json**.
You edit it right in your browser on github.com — nothing to install.

---

## File structure

```
index.html      — the page itself (don't edit by hand)
style.css       — design/styling (don't edit by hand)
script.js       — rendering logic (don't edit by hand)
content.json    — ALL text, contacts, services, photos, reviews (this is what you edit)
images/         — upload job photos and videos here
```

---

## Step 1 — Create a repository and upload the site

1. Sign up at [github.com](https://github.com) if you don't have an account yet
2. Click "+" in the top right corner → **New repository**
3. Name it, e.g. `my-detailing-site`, keep it **Public**, click **Create repository**
4. On the repository page, click **uploading an existing file** (or "Add file" → "Upload files")
5. Drag in **all** the files plus the `images` folder from this template
6. Scroll down and click the green **Commit changes** button

## Step 2 — Turn on GitHub Pages

1. In the repository, open the **Settings** tab (top)
2. On the left, click **Pages**
3. Under "Build and deployment" → "Source", select **Deploy from a branch**
4. Under "Branch", select `main` and `/ (root)` → click **Save**
5. Wait 1-2 minutes, refresh the page — a green banner will show your site's link:
   `https://YOUR-USERNAME.github.io/my-detailing-site/`

That link is your live site. You can check it right away.

---

## Step 3 — Edit text, contacts, and services

All editing happens in one file — **content.json**.

1. Open the repository on github.com
2. Click on the **content.json** file
3. Click the pencil icon (✏️ "Edit this file") in the top right of the file view
4. Change the text between the quotes `" "` — for example:
   ```
   "name": "Slavko Detailing",
   ```
5. When you're done, scroll down, type a short note about what you changed
   (e.g. "updated contact info"), and click the green **Commit changes** button
6. Wait 30-60 seconds, then refresh the site (Ctrl+F5 / Cmd+Shift+R) — your changes are live

### ⚠️ The one rule that keeps you from breaking anything

- Only change **text inside the quotes** `" like this "`
- Don't delete quotes, commas `,`, or brackets `{ } [ ]`
- Every line (except the last one in a list) needs to end with a comma `,`
- If you're unsure, it's safest to copy one of the examples below and just swap the text inside it

### How to add a new service

Find the `"services"` section and add a new block following this pattern
(don't forget the comma `,` after the previous `}`):

```json
{
  "title": "Service name",
  "desc": "Short description of what's included.",
  "price": "from $100"
}
```

### How to add a new review

In the `"reviews"` section:

```json
{
  "name": "Client name",
  "text": "The review text.",
  "rating": 5
}
```

### How to update contacts

In the `"contacts"` section, edit the values (phone number, Telegram/Instagram/WhatsApp links).
Links need to be full URLs, for example:
```
"telegram": "https://t.me/nickname"
```

---

## Step 4 — Add job photos/videos

1. In the repository, open the **images** folder
2. Click **Add file → Upload files**
3. Drag in photos/videos from your computer, using simple file names with no spaces
   (e.g. `job-1.jpg`, `before-after-2.mp4`) — or rename them after uploading
4. Click **Commit changes**
5. Open `content.json`, and in the `"gallery"` section add a new block:

```json
{
  "type": "image",
  "src": "images/job-1.jpg",
  "caption": "Full exterior polish"
}
```

For a video, change `"type": "image"` to `"type": "video"` — use mp4 format, short clips
(10-30 sec) so the page stays fast to load.

---

## Step 5 (optional) — Turn on the contact form

By default there's no request form on the site — just the Telegram/WhatsApp/call buttons.
If you'd rather have visitors fill out a form on the site itself, here's how to turn it on.
It sends messages straight from the visitor's browser to a Telegram chat — no server needed.

1. In Telegram, message **@BotFather** → `/newbot` → follow the prompts → you'll get a **bot token**
   (looks like `123456789:AAExampleTokenHere`)
2. Create a **private** Telegram group or channel just for these requests (so client contact info
   isn't exposed anywhere public)
3. Add your new bot to that group/channel as a member (for a channel, as admin)
4. Get the **chat ID**:
   - send any message in the group/channel
   - open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in your browser (replace `<YOUR_TOKEN>`)
   - find `"chat":{"id":-100xxxxxxxxxx,...}` in the response — that number is your chat ID
5. In `content.json`, fill in the `"bookingForm"` section:
   ```json
   "bookingForm": {
     "enabled": true,
     "botToken": "123456789:AAExampleTokenHere",
     "chatId": "-100xxxxxxxxxx"
   }
   ```
6. Commit the change — the form will appear on the site and requests will land in your private chat

**Worth knowing:** the bot token above will be visible to anyone who views the page source —
this is normal for a site with no server. It only lets someone *send* messages into that chat,
never read anything already there, so client info that's already come in stays safe. If it's ever
misused, go back to @BotFather, revoke the token, and generate a new one — takes a few seconds.
Keeping the group private (step 2) is what actually protects client contact details.

---

## Step 6 (optional) — Connect a custom domain

1. Buy a domain (e.g. from Namecheap or Cloudflare, ~$10-15/year)
2. In the repository, create a new file named `CNAME` (no extension), with the domain
   as its content: `yourdomain.com`
3. In your domain's DNS settings, add the records described in
   [GitHub's official guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
4. In Settings → Pages, enter your domain in the "Custom domain" field

---

## Common issues

- **Site shows an error / blank page** — most likely a missing comma or quote in content.json.
  Open the file, find your last edit, and compare it against the examples above.
- **Photo doesn't show up** — check that the file name in `content.json` (the `"src"` field)
  exactly matches the file name in the `images` folder (capitalization matters too).
- **Changes aren't showing** — wait a minute and hard-refresh the page (Ctrl+F5).

---

## What's next

This is a minimal, generic template. The next step is customizing it for the actual business
(real photos, actual services and prices, maybe a booking form instead of just messenger buttons).
