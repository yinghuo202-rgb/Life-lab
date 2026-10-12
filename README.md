# Life Lab · 高性价比人生决策实验室

**一份可以动手实验的生活决策白皮书。** 不填个人资料，选一个日常抉择、调整两个条件，就能看到时间、现金与八维生活资源评分相对基线的变化。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-%E5%9C%A8%E7%BA%BF%E4%BD%93%E9%AA%8C-176a54?logo=github)](https://yinghuo202-rgb.github.io/Life-lab/)
[![Pages 发布](https://github.com/yinghuo202-rgb/Life-lab/actions/workflows/pages.yml/badge.svg)](https://github.com/yinghuo202-rgb/Life-lab/actions/workflows/pages.yml)
![9 个案例](https://img.shields.io/badge/%E5%86%B3%E7%AD%96%E6%A1%88%E4%BE%8B-9-607c6b)
![静态站点](https://img.shields.io/badge/%E8%BF%90%E8%A1%8C-%E7%BA%AF%E9%9D%99%E6%80%81-%23779183)

**[在线体验网站](https://yinghuo202-rgb.github.io/Life-lab/)** · [理论与模型](https://yinghuo202-rgb.github.io/Life-lab/理论与模型.html) · [研究原文](https://yinghuo202-rgb.github.io/Life-lab/研究全文.html) · [源代码](https://github.com/yinghuo202-rgb/Life-lab)

> 如果在线链接显示 404，请先查看 [Pages 发布状态](https://github.com/yinghuo202-rgb/Life-lab/actions/workflows/pages.yml)，并确认仓库设置中 Pages 的构建来源为 **GitHub Actions**。发布完成前可下载并直接打开 `index.html`。

## 怎样使用

1. **选择案例**：从通勤、工作、理财习惯、睡眠等 9 个日常情境里选一个。
2. **改变条件**：通常只要调整 2 个滑杆，或者切换价值偏好。
3. **观察变化**：同屏显示当前基线与新方案、金钱或时间成本，以及教学性 `ΔLVI` 得分。

每个案例计算的是**相对于同一个假设人物基线的变化**，不是与“中国平均人的人生评分”比较。默认金额、时长及评分变化是情景演示，不是个体结果预测。

## 九个可交互案例

| 情境 | 你在权衡什么 | 数据来源性质 |
| --- | --- | --- |
| 搬家换时间 | 多付房租，减少通勤 | 原研究报告假设案例 |
| 升职加薪 | 新收入与额外工时，比较协商方案 | 原研究报告假设案例 |
| 自由职业 | 客户集中度、工时与财务风险 | 原研究报告假设案例（部分调整） |
| 家务外包 | 支出与回收的自主时间 | 本站教学假设 |
| 缩短工作周 | 放弃收入与释放的自主时间 | 本站教学假设 |
| 进修投入 | 学习成本与不确定职业回报 | 本站教学假设 |
| 关闭自动续费 | 节省订阅费与检查时间 | 参照《高性价比人生指南》第 5 节第 1 条 |
| 减少低效会议 | 减少会议与增加异步沟通时间 | 参照原指南第 4 节第 6 条 |
| 优先保证睡眠 | 增加睡眠时间及执行频率 | 参照原指南第 3 节第 3 条 |

## 计算方法与证据边界

- **客观可计算部分**：年度净支出、工作或通勤小时、买回一小时自主时间的成本等。
- **教学模型部分**：LVI 将时间、金钱、心理、健康、职业、关系、风险及可持续性八个维度按情景权重加总，显示与原状的差值 `ΔLVI`。仅前三个案例具有原研究报告中给出的完整评分锚点；其余是为了交互教学建立的情景假设。
- **社会统计参照**：展示国家统计局 2025 年居民收入及工资、2024 年时间利用数据的量级；详细统计总体、单位、年份及来源见 [数据说明](DATA_SOURCES.md)，**不直接进入 LVI 评分**。
- **安全边界**：合法性、基本生活保障、照护义务及重大健康风险需要先独立核查；综合分高不等于决策一定可行。

查看 [理论与模型](理论与模型.html)、[原研究全文](研究全文.html) 和 [来源及改编声明](ATTRIBUTION.md)。所有研究材料与假设均应按来源语境解读。

## 开发与离线使用

本项目无需账号、后端或在线数据库。直接下载 `index.html`，在浏览器中打开即可运行；理论页与研究原文也已完整内置，不会因为相对链接缺失而打不开。

```bash
# 在项目根目录
python build.py
python build_standalone.py
node tests/model.test.js
node tests/new_cases.test.js
python tests/pages_check.py
```

源文件位于 `assets/` 与 `src_main.html`；`content/原始研究报告.md` 为研究底稿。详见代码与注释。Python 构建只依赖标准库，Node 仅用于测试。

## 发布与维护

自动发布配置已提交至 [Pages 工作流](.github/workflows/pages.yml)。**首次发布需要仓库管理员在 [Settings → Pages](https://github.com/yinghuo202-rgb/Life-lab/settings/pages) 将 Source 设为 GitHub Actions**。启用后重新运行 [Publish Life Lab](https://github.com/yinghuo202-rgb/Life-lab/actions/workflows/pages.yml) 即可。首次构建若提示 “Get Pages site failed / Not Found”，意味着 Pages 尚未启用，而不是模型测试失败。

发布成功后网站地址为：https://yinghuo202-rgb.github.io/Life-lab/ 。提交后自动运行构建与发布；部署是否成功以 Actions 的 deploy 任务和网站访问结果为准。

## 引用与致谢

部分案例主题来自 [《高性价比人生指南》](https://github.com/eternity4719/HowToLiveBetter)（原项目采用 CC BY 4.0）。本站对案例数值、交互与 LVI 教学模型作独立改编，**不要将演示参数归因于原指南作者**。具体许可和来源见 [ATTRIBUTION.md](ATTRIBUTION.md)。

本项目用于教育性决策演示，不构成医疗、法律、投资或职业决策建议。