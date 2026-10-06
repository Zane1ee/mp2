# MP2 第 5 轮发布与手动验收

日期：2026-10-06（America/Chicago）。用户已确认第 4 轮手验通过。
本轮范围：SOP STEP 21–24。功能开发结束；发布配置、线上验收与最终提交准备在本轮执行。

## 开始时确认

- 公开仓库：https://github.com/Zane1ee/mp2 。远程 main 起点为 eefba96bbba067cb2ff8cf6d005d6bb0f98319b3。
- GitHub API 确认有现有推送权限、has_pages=true；Pages build_type=workflow，HTTPS enforced=true，无需重新配置 Source。
- 部署目标：https://zane1ee.github.io/mp2/ 。原 README、Node 20 课程 workflow、锁文件、base/basename 与上一轮相同。
- 第 4 轮原生缩放等手动验收由用户确认无问题；现有 41 项自动测试、三页功能、推荐尺寸和故障证据保留。
- `SUBMISSION_CHECKLIST.md` 已按真实 MP2 表单首页整理，并提供三分钟录屏脚本。
- 视频录制/Drive 定向共享、本人信息/实际用时、LLM survey 与表单最终提交待所有者操作；不伪造完成确认。

## 发布验收

发布提交与线上验证结果将在实际完成后补入本文件；此段是部署前状态记录，不是成功声明。

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
| 随机未知线上 route | 返回项目 Not found 页面，可回到 List；HTTP 404 对无效 route 属正常 |

完整提交项目、视频操作顺序、实际表单字段与待本人完成事项见 `SUBMISSION_CHECKLIST.md`。
