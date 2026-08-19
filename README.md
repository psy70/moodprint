# Moodprint｜心情制图机

输入一句话，把此刻的心情变成一场只属于你的动态天气。

![Moodprint 桌面界面](./design/moodprint-desktop.png)

Moodprint 是一个完全运行在浏览器里的生成艺术小项目。同一句话会得到稳定的初始世界，也可以继续“换一个宇宙”，最后导出一张 1080 × 1080 PNG 海报。

## 功能

- 文字驱动的确定性 Canvas 生成艺术
- 动态雨、雾、微光、山脊和水面
- 基于关键词与种子的配色变化
- 一键生成变体
- 一键导出方形海报
- URL 保存当前文字，方便分享
- 无服务器、无账号、无数据上传
- 桌面端与移动端响应式界面
- 尊重 `prefers-reduced-motion`

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
npm run preview
```

## 发布到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。推送到 `main` 分支后：

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开 **Actions**，等待 `Deploy to GitHub Pages` 完成。
4. 回到 **Settings → Pages** 获取公开网址。

## 技术栈

React 19 · TypeScript · Vite · Canvas 2D

## 隐私

输入内容只在本地浏览器中处理。项目没有后端、数据库或分析脚本。

## License

[MIT](./LICENSE)
