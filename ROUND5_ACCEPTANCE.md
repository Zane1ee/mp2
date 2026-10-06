# MP2 第 5 轮发布与手动验收

日期：2026-10-06（America/Chicago）。用户已确认第 4 轮手验通过。
本轮范围：SOP STEP 21–24。代码开发与技术发布完成；STEP 21/22 已通过，STEP 23/24 提交准备完成，录屏/Drive/表单由所有者完成。

## 开始时确认

- 公开仓库：https://github.com/Zane1ee/mp2 。远程 main 起点为 eefba96bbba067cb2ff8cf6d005d6bb0f98319b3。
- GitHub API 确认有现有推送权限、has_pages=true；Pages build_type=workflow，HTTPS enforced=true，无需重新配置 Source。
- 部署目标：https://zane1ee.github.io/mp2/ 。原 README、Node 20 课程 workflow、锁文件、base/basename 与上一轮相同。
- 第 4 轮原生缩放等手动验收由用户确认无问题；现有 41 项自动测试、三页功能、推荐尺寸和故障证据保留。
- `SUBMISSION_CHECKLIST.md` 已按真实 MP2 表单首页整理，并提供三分钟录屏脚本。
- 视频录制/Drive 定向共享、本人信息/实际用时、LLM survey 与表单最终提交待所有者操作；不伪造完成确认。

## 发布验收

应用发布提交：[6a5e218](https://github.com/Zane1ee/mp2/commit/6a5e218b462f6c9dfb9cf3ac856e2b9a8645f5d6)。
对应 [Actions 37421031265](https://github.com/Zane1ee/mp2/actions/runs/37421031265) 的 build/deploy 均 success，
GitHub Pages deployment 状态也确认该 SHA、success 和正确 environment URL。
模板初始提交 eefba96 的旧失败与本次发布区分，不把旧失败当作当前状态。

最终验收证据及聊天记录随后作为同一 main 的文档更新提交；应用代码和生产资源不改变。
本文件记录上述实际应用验收提交，最终 main 的最新运行以 [Actions](https://github.com/Zane1ee/mp2/actions) 为准。

| 检查 | 实际结果 |
|---|---|
| 发布前安装与检查 | Node 20.20.2 的 npm ci、lint、strict 类型、41 tests / 4 files、build 全部成功；audit 0 vulnerabilities |
| 可选安装提示 | fsevents 的安装脚本 allowScripts 警告未阻止成功；没有为消除提示改变课程 workflow 或依赖版本 |
| 真实 CI | Ubuntu / Node 20 的锁文件安装、构建、上传 artifact 与 deploy 步骤均 success |
| 文件范围 | main 含源码、配置、lockfile、原 README/workflow、样例、来源、SOP/验收/实际日志；不含 node_modules、dist、.env 或备份 |
| 文件保护 | 原 README、workflow、package.json、lockfile、实际六项 API JSON 与第 4 轮基线一致；本轮无应用功能改动 |
| 全部线上入口 | 根页面 + 62 有效 route：63 次检查全部 HTTP 200，HTML 与已验收 dist 逐字节一致 |
| 生产资源 | favicon、index-DfFuJ1Q0.js、index-B2glWkbq.css 内容与本地构建一致，均在 /mp2/ 下正常加载 |
| 样例资源 | 线上 JSON HTTP 200、内容与源码一致，实际 ID 为 1/4/7/25/39/60 |
| 未知路由 | /mp2/not-a-pokemon/ HTTP 404，使用相同应用 shell；浏览器显示项目 Not found、主标题与返回入口 |
| List | 真实 60 项；char 实时为 3 项，Number/Name 各升降序都按下方精确顺序通过 |
| List Detail | Charizard 1.7m / 90.5kg / Blaze+Solar Power / stats 正确；006→004→005→006，历史前进后退、硬刷新和返回条件通过 |
| Gallery | Fire 7、Water 6、OR 13、Grass OR Poison 23；Bulbasaur 只有一张卡片；取消/Clear 正确 |
| Gallery Detail | #004 Previous 到 #060，13 of 13；新标签直达与硬刷新恢复同一集合，Next 回 #004，Back 恢复 OR 13 |
| 图片 | 最终真实 OR 图库 13 张图片均成功加载并有对应 alt；不声称样例图完全离线 |
| 样例 | 6 项真实保存样例；Electric 只有 Pikachu，1 of 1，两个按钮禁用；专属 URL 与硬刷新保留模式 |
| 390px 三页 | List/Gallery/Detail 的 scrollWidth=innerWidth=390；输入保持焦点、详情主标题焦点正确；键盘 Space/Enter 操作通过 |
| 生产规则 | 应用 #root 内 style/table/inline script 均为 0；正常生产浏览器 warning/error 为空 |
| 原生缩放 | 第 4 轮手动验收已由所有者确认通过；本轮未把文字放大或390px测试冒充新的原生缩放自动测试 |

记录：[线上静态结果](docs/qa/online-static-results.json)、[浏览器操作结果](docs/qa/online-browser-results.json)、
[线上 List 截图](docs/qa/online-list.jpg)、[线上 Gallery 截图](docs/qa/online-gallery.jpg)。
全部是实际生产站点结果；本轮没有修改线上 API 指向或制造远程限流。

## 代码与课程提交状态

**代码开发和部署任务已结束。** 没有新的 API、MCP、账户或个性化设计需要拍板。
第 4 轮故障/响应式矩阵和 41 项风险测试保留，本轮增加真实域名、CI、全部静态入口与线上交互证据。
STEP 23/24 不标记为完成：本轮未录制/上传/共享实际视频，未代填姓名/邮箱/NetID、耗时或体验 survey，也未提交课程表单。

真实记录 [docs/llm/mp2-chatlog.md](docs/llm/mp2-chatlog.md) 和索引随源码实际提交。
日志按截止快照更新，包含本项目可见消息与调用代码，路径匿名化、凭据模式脱敏，排除内部推理/系统消息/工具输出/网页正文/二进制媒体。
最终文档更新会带上本轮线上验收记录；如果后续继续发生 LLM 开发或提交相关工作，按提交清单再次更新，不伪造未来对话。
课程 LLM survey 必须由所有者在真实表单回答，本地/线上代码通过不能替代 survey 与提交确认。

本轮保留原有本地开发标签与服务，另保留真实线上验收页和正确课程表单入口。

## 由用户手动验收

本轮手验使用线上地址而非 localhost。先确认对应本轮提交的 Actions build/deploy 全部成功，再执行：

| 操作 | 预期 |
|---|---|
| 打开 https://zane1ee.github.io/mp2/ | 正常 List，样式与图片资源路径正确，没有白屏 |
| 搜索 char，切四种排序 | 3 项；Number↑004/005/006，Number↓006/005/004，Name↑006/004/005，Name↓005/004/006 |
| Name↑点击 #006，前后/返回 | Charizard 属性正确；按 006→004→005→006；返回保持查询 |
| Gallery 的 Fire/Water/OR/Clear | 7/6/13/60；图片来自 API；双类型对象不重复 |
| Fire OR Water 点击 #004 | 1 of 13；Previous 到 #060（13 of 13），Next 回 #004 |
| 复制详情 URL 到新标签、硬刷新 | 当前对象和原来源集合恢复，返回仍为原过滤结果，不出现页面 404 |
| Sample + Electric | 六项标识，只有 Pikachu，1 of 1，前后禁用；图片仍需要网络 |
| 窄屏/键盘 | 无溢出或控件遮挡；Tab/Space/Enter 和焦点行为与第 4 轮一致 |
| 打开 https://zane1ee.github.io/mp2/not-a-pokemon/ | 返回项目 Not found 页面，可回到 List；HTTP 404 对无效 route 属正常 |

完整提交项目、视频操作顺序、实际表单字段与待本人完成事项见 `SUBMISSION_CHECKLIST.md`。
