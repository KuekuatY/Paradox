# 部署说明

## 发布到 GitHub Pages

1. 在 GitHub 创建一个新仓库。

2. 把项目推到 `main` 分支。

3. 打开仓库设置：

   `Settings` -> `Pages` -> `Build and deployment`

4. `Source` 选择 `GitHub Actions`。

5. 推送代码后，`.github/workflows/deploy.yml` 会自动运行：

   ```bash
   npm ci
   npm run build
   ```

6. 部署完成后，GitHub 会给出访问地址，通常是：

   ```text
   https://你的用户名.github.io/仓库名/
   ```

本项目已使用 `HashRouter`，所以游戏内路由会显示为 `/#/game`、`/#/history`，适合 GitHub Pages 刷新和分享。

## 最快发布到 Netlify

1. 运行：

   ```bash
   npm run build
   ```

2. 打开 Netlify Drop：

   https://app.netlify.com/drop

3. 把 `dist` 文件夹拖进去，等待生成公网链接。

`public/_redirects` 会被自动打包到 `dist`，用于解决刷新 `/game`、`/history` 时 404 的问题。

## 发布到 Vercel

1. 把项目推到 GitHub。
2. 在 Vercel 导入仓库。
3. 使用默认 Vite 配置：
   - Build Command: `npm run build`
   - Output Directory: `dist`

`vercel.json` 已经配置了前端路由 fallback。
