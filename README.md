# Restaurant Website Template 餐厅网站模板

> 中文说明请见下方 **[中文使用指南](#中文使用指南)**。

A professional, graphics-rich restaurant website that runs entirely on **GitHub Pages** (free hosting, no build step, no database).

**All content — menu, announcements, hours, contact info — lives in three plain text files.** Edit a `.txt` file, upload it to GitHub, and the website updates automatically. No coding required.

---

## 1. Host it on GitHub Pages (one-time setup, ~3 minutes)

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Click **+** (top right) → **New repository**. Name it anything (e.g. `my-restaurant`). Keep it **Public**. Click **Create repository**.
3. Click **uploading an existing file**, then drag **all files and folders from this template** into the upload box. Click **Commit changes**.
4. In the repository, go to **Settings → Pages**. Under *Branch*, choose **main** and **/(root)**, then **Save**.
5. Wait 1–2 minutes. Your site is live at:
   `https://YOUR-USERNAME.github.io/my-restaurant/`

That's it. Bookmark that Settings → Pages screen — it always shows your live URL.

---

## 2. Updating content (the everyday workflow)

Everything you'd ever change day-to-day is in the **`data/`** folder:

| File | Controls |
|---|---|
| `data/menu.txt` | The entire menu (tabs, dishes, prices, tags) |
| `data/announcements.txt` | News cards (specials, events, closures) |
| `data/info.txt` | Name, tagline, hours, address, phone, about text, links |

**To update:** open the file on GitHub → click the ✏️ pencil icon → edit → **Commit changes**. Or edit on your computer and re-upload (GitHub replaces the old file). The live site updates within ~1 minute, no other steps needed.

> Tip: you can do all of this from a phone browser.

### 2a. Menu format — `data/menu.txt`

```
[Section Name]                <- becomes a tab on the site
Dish Name | Price | Description | Tags
```

Example:

```
[Starters]
French Onion Soup | 16 | Caramelized onions, gruyère crouton, thyme
Roasted Beet Salad | 17 | Whipped goat cheese, candied walnuts | vegetarian, gf
```

Rules:
- Price, description, and tags are all **optional** — `Dish Name` alone works.
- Tags (comma-separated) show as badges: `vegetarian`, `vegan`, `gf`, `spicy`, `new`, `popular`, `chef's pick`, `special`.
- Lines starting with `#` are comments and ignored.
- Add as many `[Sections]` as you like — each becomes a tab automatically.

### 2b. Announcements format — `data/announcements.txt`

Each announcement is separated by a line containing only `---`:

```
[2026-06-10] Summer Tasting Menu Launches | pinned
First paragraph of the announcement.

Second paragraph (blank line starts a new paragraph).
---
[2026-06-01] Now Open Sundays
Join us Sunday evenings from 4 PM.
```

Rules:
- First line: `[YYYY-MM-DD] Title`. Newest dates display first automatically.
- Add `| pinned` after the title to keep that card in front regardless of date.
- Delete a block (including its `---`) to remove an announcement.

### 2c. Restaurant info — `data/info.txt`

Simple `key: value` lines. Example:

```
name: Maison Lumière
tagline: Modern European fine dining
phone: (415) 555-0123
hours: Friday – Saturday | 5:00 PM – 11:00 PM
about: A paragraph about your restaurant.
```

- `about:`, `hours:`, and `social:` can repeat — each line adds a paragraph / row / link.
- Today's hours are highlighted automatically.
- `reservation_link:` can be an OpenTable/Resy URL; remove it to make the Reserve button call your phone instead.

---

## 3. Customizing the look (optional)

- **Colors:** edit the `:root` variables at the top of `css/style.css` (e.g. change `--gold` for a different accent color).
- **Photos:** the gallery ships with elegant built-in illustrations so it looks complete with zero setup. To use real photos, in `index.html` replace any gallery `<svg>…</svg>` block with `<img src="images/your-photo.jpg" alt="...">` and upload your photos to an `images/` folder.
- **Fonts:** the Google Fonts link in `index.html` (Cormorant Garamond + Jost) can be swapped for any pairing.

---

## 4. Previewing locally (optional)

Browsers block data files when opening `index.html` directly. To preview on your computer, run a tiny server from the project folder:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`. (On GitHub Pages this is automatic.)

---

## Troubleshooting

- **"Could not load the menu" on the live site** — check that the `data/` folder uploaded with the rest of the files.
- **Edits not showing** — wait a minute (GitHub Pages redeploys), then hard-refresh (Ctrl/Cmd+Shift+R). The site already cache-busts the txt files for normal visitors.
- **A dish/announcement is missing** — check the `|` separators and, for announcements, that blocks are separated by a line with only `---`.

---
---

# 中文使用指南

一个专业、视觉精美的餐厅网站,完全运行在 **GitHub Pages** 上(免费托管、无需编译、无需数据库)。

**所有内容——菜单、公告、营业时间、联系方式——都存放在三个纯文本文件里。** 修改 `.txt` 文件并上传到 GitHub,网站自动更新,完全不需要写代码。

## 一、部署到 GitHub Pages(一次性设置,约 3 分钟)

1. 如果没有账号,先在 [github.com](https://github.com) 免费注册。
2. 点击右上角 **+** → **New repository**(新建仓库)。随便起个名字(如 `my-restaurant`),保持 **Public**(公开),点击 **Create repository**。
3. 点击 **uploading an existing file**,把**本模板的所有文件和文件夹**拖进上传框,点击 **Commit changes**(提交)。
4. 进入仓库的 **Settings → Pages**,在 *Branch* 下选择 **main** 和 **/(root)**,点击 **Save**。
5. 等 1–2 分钟,网站就上线了,地址为:
   `https://你的用户名.github.io/my-restaurant/`

完成!收藏这个 Settings → Pages 页面,它会一直显示你的网站地址。

## 二、更新内容(日常操作)

日常需要改的内容全部在 **`data/`** 文件夹里:

| 文件 | 控制内容 |
|---|---|
| `data/menu.txt` | 整个菜单(分类标签、菜品、价格、徽章) |
| `data/announcements.txt` | 公告卡片(特别活动、节日、休业通知) |
| `data/info.txt` | 店名、标语、营业时间、地址、电话、简介、链接 |

**更新方法:** 在 GitHub 上打开文件 → 点击 ✏️ 铅笔图标 → 修改 → 点击 **Commit changes**。也可以在电脑上改好再重新上传(GitHub 会自动覆盖旧文件)。约 1 分钟后网站自动更新,不需要任何其他操作。

> 提示:用手机浏览器也能完成以上全部操作。

### 2a. 菜单格式 — `data/menu.txt`

```
[分类名]                      <- 自动变成网站上的一个标签页
菜名 | 价格 | 描述 | 标签
```

示例:

```
[Starters]
French Onion Soup | 16 | Caramelized onions, gruyère crouton, thyme
Roasted Beet Salad | 17 | Whipped goat cheese, candied walnuts | vegetarian, gf
```

规则:价格、描述、标签都可以省略,只写菜名也行;标签用逗号分隔,会显示成小徽章(`vegetarian` 素食、`vegan` 纯素、`gf` 无麸质、`spicy` 辣、`new` 新品、`popular` 人气、`chef's pick` 主厨推荐、`special` 特别款);以 `#` 开头的行是注释;`[分类]` 数量不限,每个都会自动变成标签页。

### 2b. 公告格式 — `data/announcements.txt`

每条公告之间用单独一行 `---` 分隔:

```
[2026-06-10] 夏季品鉴菜单上线 | pinned
公告第一段。

空一行就是第二段。
---
[2026-06-01] 周日也营业了
每周日下午 4 点起欢迎光临。
```

规则:首行格式为 `[年-月-日] 标题`,日期新的自动排前面;标题后加 `| pinned` 可置顶;删除整段(连同 `---`)即可下架公告。

### 2c. 餐厅信息 — `data/info.txt`

简单的 `键: 值` 格式,例如:

```
name: 餐厅名称
tagline: 一句话标语
phone: (415) 555-0123
hours: Friday – Saturday | 5:00 PM – 11:00 PM
about: 一段餐厅介绍。
```

`about:`(简介段落)、`hours:`(营业时间)、`social:`(社交链接)可以写多行,每行一条;今天的营业时间会自动高亮;`reservation_link:` 填订座网址(OpenTable、Resy 等),删掉则预订按钮自动改为拨打电话。

## 三、自定义外观(可选)

**配色:** 修改 `css/style.css` 顶部 `:root` 中的颜色变量(例如改 `--gold` 换主题色)。**照片:** 画廊自带精美插画,开箱即用;想用真实照片,把 `index.html` 中画廊里的任意 `<svg>…</svg>` 整块替换为 `<img src="images/你的照片.jpg" alt="...">`,并把照片上传到 `images/` 文件夹。**字体:** 替换 `index.html` 里的 Google Fonts 链接即可换字体。

## 四、本地预览(可选)

直接双击打开 `index.html` 时浏览器会拦截数据文件的读取。要在电脑上预览,请在项目文件夹运行:

```
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。(部署到 GitHub Pages 后无需此步骤。)

## 常见问题

**网站显示"无法加载菜单"** — 检查 `data/` 文件夹是否和其他文件一起上传了。**修改后没变化** — 等一分钟(GitHub Pages 在重新部署),再强制刷新(Ctrl/Cmd+Shift+R);普通访客会自动获取最新内容。**某道菜或公告没显示** — 检查 `|` 分隔符是否正确;公告之间是否用单独一行 `---` 分隔。
