# MP2 提交清单

课程截止：**2026-10-06 11:59 PM CT（America/Chicago）**，以原 README 为准。
功能开发与技术发布已完成，实际源码和聊天记录已推送，Actions 与真实线上验收通过。详见 ROUND5_ACCEPTANCE.md；视频、Drive 权限、本人 survey/表单仍需您完成。

## 需要提交什么

| 内容 | 当前文件或链接 | 提交方式 |
|---|---|---|
| 项目源码 | https://github.com/Zane1ee/mp2 | 公开仓库 main；提交源码、配置、package-lock.json、原 README 与 workflow、实际样例及必要文档 |
| 部署网站 | https://zane1ee.github.io/mp2/ | 表单填写此地址，须能公开访问，线上版本对应已验收提交 |
| 演示视频 | 所有者录制的实际视频 | 最多 3 分钟，部署网址及全部要求可见；上传 Google Drive 并共享给 uiuc.web.programming@gmail.com，表单填真实视频链接 |
| 全部参考来源 | SOURCES.md | 随仓库源码提交；表单 References 写可访问的 SOURCES 链接并说明媒体/API/LLM 使用 |
| 实际 LLM 聊天记录 | docs/llm/mp2-chatlog.md；llm_logs.csv 是索引 | 聊天记录随源码提交；核对文件中导出时间与截止点，不能只交表头、占位链接或本地绝对路径 |
| LLM 使用调查 | grading form 第二页的实际问题 | 本项目使用过 LLM 生成代码，应如实选 Yes，并由所有者按实际体验回答 |
| 本人信息和用时 | 学校邮箱、姓名、NetID、实际耗时 | 所有者填写，不用操作系统账户名推测 NetID，不把助手执行时间冒充本人耗时 |

`node_modules/`、`dist/`、.env、备份及临时故障服务不要加入仓库；GitHub Actions 从锁文件构建 dist 并部署。
验收截图、SOP 和 ROUND*_ACCEPTANCE 是工程证据，不替代演示视频或课程表单。

## 按什么顺序提交

1. 完成 ROUND5_ACCEPTANCE.md 的线上手验。确认 Actions build/deploy 成功、打开的是 `zane1ee.github.io/mp2/`，不是 localhost；详情直达和硬刷新可用。
2. 核对公开 main 已包含源码、锁文件、SOURCES、实际聊天记录。本地检查：

   ```sh
   cd "/Users/a16594/Desktop/uiuc FA26/cs 409/mp2"
   git status
   git log -2 --oneline
   ```

   预期工作区干净，最新提交已推送；不要只根据本地界面正常就填写已部署。
3. 按下方脚本录制 **≤3:00** 的视频，片头显示完整的部署 URL。回看，确保画面中的控件、结果顺序、网址与详情字段能读清。
4. 将视频上传 Google Drive。共享设置添加 `uiuc.web.programming@gmail.com`，给予查看权限；复制实际视频的分享链接。
   若只做定向分享，检查该邮箱确实有权限即可，不强制公开视频；不要填写只有自己可看的私有链接。
5. 打开课程 README 的正确 [MP2 提交表单](https://forms.gle/PkYq9RaMFG8MaMjF7)。本轮已只读核对标题为 **Fall 26 MP2 Submission**，共两页。
6. 第一页填写学校邮箱、First/Last Name、NetID、仓库链接、GitHub Pages 链接、Drive 视频链接、参考来源、实际耗时和 LLM 使用确认；Comments 按需填写。
   表单站点说明里有一个指向 gitlab.io 的示例超链接；实际提交仍使用 README 要求且本项目验证的 github.io 地址。
7. 本项目 LLM 项选择 **Yes**。进入第二页，按实际问题完成 LLM 体验调查；本轮没有代填个人信息或调查，也没有提交表单。
8. 提交后保存确认页面/回执。再次检查仓库、网站、视频、来源和聊天记录能被课程人员访问。

参考来源字段可使用以下自写内容，核对已推送后再填：

> Complete references and API/media provenance: https://github.com/Zane1ee/mp2/blob/main/SOURCES.md . Codex assisted with planning, implementation and verification. The actual visible-message/code chatlog is included with the source at https://github.com/Zane1ee/mp2/blob/main/docs/llm/mp2-chatlog.md , with its capture checkpoint documented in the file.

## 三分钟视频操作脚本

| 时间 | 画面与操作 | 要证明的内容 |
|---|---|---|
| 0:00–0:12 | 展示 `https://zane1ee.github.io/mp2/` 和 #001–#060 范围 | 演示真实部署站点；React SPA 的三个入口 |
| 0:12–0:55 | List 逐字输入 char；Number/Name 各切 Ascending/Descending | 实时过滤、两个排序属性、四种顺序；char 为 3 项 |
| 0:55–1:20 | Name/Ascending 点击 #006；展示属性，Next 到 #004、Previous 返回；Back | 列表入口、详情字段、前后按当前结果顺序、返回查询保留 |
| 1:20–1:55 | Gallery 展示图片；Fire 为 7，再选 Water 为 13；取消/Clear，并恢复 Fire+Water | API 对象媒体、属性过滤、多选 OR、取消与清空 |
| 1:55–2:28 | 点击 #004；Previous 到 #060、Next 回 #004；展示属性 | 图库入口、首尾循环、当前集合位置与正确对象 |
| 2:28–2:45 | 复制详情 URL 到新标签并硬刷新，返回 Gallery | 特定 route 直接访问和查询条件重建 |
| 2:45–2:55 | 简短缩窄窗口，展示控件换行/详情导航 | 设计与响应式可操作性 |

建议留 5 秒余量。网络慢时先等待 Gallery 完整加载再开始录制；不要剪掉网址证明或某一排序组合。
无需在视频中触发远程 429；样例模式与异常机制可留在文档，优先展示全部评分功能。

## 聊天记录的截止点

仓库中的记录是实际会话截止快照，路径已匿名化，凭据模式脱敏；不包含内部推理、系统消息、工具输出或二进制媒体。
第 5 轮验收记录会注明最终推送的快照。若之后继续用 LLM 修改代码或补充提交材料，应更新实际记录并再次提交、推送。
只录屏/填写本人信息不会改变源代码；不要为了填写表单编造新的助手对话。

本机原会话的更新方式（确认仍是本次 MP2 会话再执行）：

```sh
node scripts/export-chatlog.mjs "/Users/a16594/.codex/sessions/2026/10/05/rollout-2026-10-05T17-37-25-01a10e36-f672-73c2-945b-4e9852baee4d.jsonl" "01a10e36-f672-73c2-945b-4e9852baee4d"
git add docs/llm/mp2-chatlog.md llm_logs.csv
git commit -m "Update MP2 actual conversation checkpoint"
git push origin main
```

不要上传整个 Codex sessions 目录；只提交已核对身份、脱敏后的本项目记录。若换到其他会话开发，应另外登记该实际会话记录。

## 最后自查

- [ ] 公开仓库 main 是最终版本，包含锁文件与实际聊天记录。
- [ ] 最新 Actions build/deploy 成功；线上根页面、三个 view、详情直达/刷新通过。
- [ ] 三分钟以内视频显示部署 URL，全部评分功能可见。
- [ ] Drive 已向课程邮箱共享；表单用实际视频链接。
- [ ] References 覆盖全部阅读、代码工具、API 与媒体来源。
- [ ] LLM 选择 Yes，第二页调查按本人体验完成。
- [ ] 表单使用本人正确信息与实际用时，并在截止前提交。
- [ ] 已保存提交确认；仍可访问全部链接。
