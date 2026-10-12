# GitHub Pages 发布检查表

仓库：[`yinghuo202-rgb/Life-lab`](https://github.com/yinghuo202-rgb/Life-lab)

目标地址：`https://yinghuo202-rgb.github.io/Life-lab/`

## 首次启用

1. 将这个项目包中的文件提交到仓库的 `main` 分支。确保 `.github/workflows/pages.yml`、`index.html` 和 `.nojekyll` 在仓库根目录。
2. 打开 **Settings → Pages → Build and deployment**，选择 **GitHub Actions** 作为 `Source`。这一步需要仓库维护权限。只提交工作流不会自动为仓库启用 Pages。
3. 打开 **Actions → Publish Life Lab**，如未自动触发，选择 **Run workflow**。
4. 等到 `build`、`deploy` 两个任务成功完成，再访问 `https://yinghuo202-rgb.github.io/Life-lab/`。
5. 在仓库 **About** 右侧的编辑按钮中，建议填写：
   - Description：`零注册交互式人生决策实验室：对比时间、金钱、风险与八维 LVI 评分`
   - Website：`https://yinghuo202-rgb.github.io/Life-lab/`
   - Topics：`decision-science`、`life-planning`、`github-pages`、`multi-criteria-decision-analysis`、`chinese`

## 后续更新

推送到 `main` 将自动运行：模型测试 → 静态网页构建 → 上传 Pages Artifact → Pages 发布。

## 故障排查

- **页面仍是 404**：确认 Pages Source 已选 `GitHub Actions`、Actions 页面显示部署成功，确认地址大小写及 `Life-lab/` 后缀；部署成功后可能需要少量时间刷新。
- **Actions 报 Get Pages site failed / Not Found**：仓库 Pages 尚未启用，先回 Settings → Pages 配置 Source。
- **权限不足（403）**：检查仓库 Actions 权限；工作流已声明 `contents: read`、`pages: write`、`id-token: write`。由有仓库维护权限的人检查组织策略或环境保护规则。
- **网页可开但理论页打不开**：项目首页采用内置 iframe `srcdoc` 的单文件阅读，不依赖额外 HTML；查看是否浏览器插件阻止脚本。也可直接访问独立的 `理论与模型.html`、`研究全文.html`。

官方资料：[使用 GitHub Actions 发布 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。