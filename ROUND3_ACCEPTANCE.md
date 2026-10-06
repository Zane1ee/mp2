# MP2 第 3 轮交付与手动验收

日期：2026-10-05（America/Chicago）。用户已确认第 2 轮手动验收通过。
本轮范围：SOP 第 15 步、第 16 步 Gallery 来源，以及第 13 步的类型索引、
部分失败重试、429 和样例模式。第三轮本地验收通过；真实 Pages 尚未部署。

## 完成内容

- Gallery 从单卡扩展为真实 #001–#060 的 60 项媒体网格，显示名称、编号、
  类型和详情入口。图片来自 API 返回字段，固定容器比例，使用原生 lazy loading。
- 类型候选来自已验证目录。多选使用 OR；空选择显示全部；取消和 Clear
  立即更新结果。双类型对象不会重复，结果统一按 ID 升序。
- 加载中显示已加载/待处理数量；保留已成功卡片。全部类型数据成功后才
  开放筛选和图库导航，未加载或失败不会被误报为过滤后的零结果。
- 单项失败显示数量、编号和说明，`Retry failed profiles` 只补发失败项。
  切换页面不会自动重试失败的详情。共享缓存与请求去重继续工作，API
  详情请求最多 4 并发，不为每张卡片另发重复请求。
- Gallery→Detail 在 URL 保存重复的 `type` 参数；刷新、新标签、历史和
  Back to gallery 重建同一筛选。Previous/Next 按结果序列循环，单项禁用。
  来源不匹配仍有全目录提示与持续的 `browse=all` 回退。
- 增加明确的 live/sample 选择。默认是实时数据；样例必须由用户显式选择。
  `mode=sample` 随三个 view、返回与前后导航持久化；两套仓库/缓存完全独立。
- 样例是实际采集的 6 项 API 显示字段：#001 Bulbasaur、#004 Charmander、
  #007 Squirtle、#025 Pikachu、#039 Jigglypuff、#060 Poliwag。
  `public/data/pokemon-sample.json` 含来源与采集时间
  `2026-10-06T01:19:33.447963+00:00`（当地仍为 10 月 5 日）。
  样例 JSON 通过 Axios 从 BASE_URL 下读取；不伪装成 60 项实时目录。
- 样例图片仍是远程 API 媒体，**不保证完整断网图片演示**。界面明确说明，
  并提供来源/采集时间入口。样例范围外的有效 ID 显示范围提示及返回链接。
- 响应验证拒绝缺失、重复或未知类型，避免假类型进入筛选索引。
- 429 解析 `Retry-After` 秒数或日期：倒计时期间禁用重试，数据层也阻止
  提前重试及新的队列 HTTP 请求；已发出的请求可以完成。到时等待用户
  手动重试，不自动进入无限请求循环。
- 未添加依赖、MCP 或账户配置。原 README、工作流、package.json 与锁文件
  保持一致；现有 Vite base、BrowserRouter 和静态入口机制继续使用。

## 实际验收结果

| 检查 | 实际结果 |
|---|---|
| 最终兼容验证 | Node v20.20.2 下 lint、39 项测试和包含 TypeScript 检查的 build 成功 |
| 自动测试 | 3 个文件，39 passed；原基础/列表回归继续通过 |
| 新风险覆盖 | OR/去重/URL、图库序列/回退、加载/失败状态、样例验证/读取恢复/缓存隔离、60 项并发、目录重试、429 全队列等待 |
| 真实 Gallery | 60 项；Fire 7、Water 6、Fire OR Water 13；Grass OR Poison 23，Bulbasaur 只有一张卡片 |
| Gallery Detail | Fire/Water 第一项 #004；Previous 到 #060（13 of 13），Next 回 #004；继续到 #005，字段、标题与 ID 对应 |
| URL/历史 | 筛选 URL、硬刷新、后退/前进、返回条件保持通过 |
| 有效空筛选 | URL type=dragon 在完整目录显示 0 of 60、范围说明与 Clear，无假加载结果 |
| 来源不匹配 | Pikachu + from=gallery&type=fire 显示全目录提示，Next 保留 type=fire 与 browse=all，返回恢复 Fire |
| 样例与回归 | 6 项目录；Electric 单项禁用前后；样例直达/刷新/返回正常；样例 List char 为 1 项，切回 live 为原 3 项 |
| 范围约束 | #002 + mode=sample 显示 Outside the sample collection，不发该样例详情请求（hook 与 scope 测试验证） |
| 静态路由 | 普通静态服务验证带图库条件的详情、样例详情直达/刷新/返回及样例 JSON 资源 |
| 窄屏/键盘 | 390×844 Gallery/Detail 无横向溢出；Space 切类型，Enter 激活 Next 成功；验收后视口恢复 |
| 生产规则 | 应用 DOM 无 style/table；无内联执行脚本；实际图片成功加载，图库图片标记 lazy |
| 正常控制台 | 正式生产页面检查的 warning/error 为空 |
| 构建 | 62 个有效静态 route 入口和 404，统一应用 shell、/mp2/ 资源路径 |

故障浏览器验收使用 `/private/tmp` 中的独立生产副本和临时 HTTP 服务。
它只将副本的 API base 指向合成测试响应，未改项目源码或正式 dist 的 API；
合成对象名称为 Fixture，明确用于 QA，不属于交付样例，也不用于真实图库结果计数。

| 注入条件 | 实际观察 |
|---|---|
| 单项 #004 返回 503 | 59 张成功卡片保留、失败编号可见、类型禁用、没有 No Pokémon match 假零结果 |
| 恢复 #004 并点击重试 | 只新增一个 #004 HTTP 请求；索引完整后按原 Fire 条件显示 3 项合成对象 |
| 筛选/返回/详情切换 | 故障服务日志确认没有新增已缓存 API 请求 |
| 空图片与图片 404 | 显示 Image unavailable，名称、对象属性与导航仍可用 |
| #025 延迟 11 秒 | Axios 10 秒超时显示说明与 Retry；恢复后 Retry 得到对应对象 |
| 目录返回 503 | 显示错误；显式 Use sample data 得到实际 6 项样例；恢复后可切回 live |
| Gallery Detail 的目录失败 | 对象本身仍显示；Retry 同时恢复目录和完整类型索引，导航重新可用 |
| 首个详情 429，Retry-After=8 | 倒计时禁用重试；只有目录及已开始的 4 个详情请求到达服务，后续队列未发送 HTTP |
| 429 等待结束并恢复服务 | 仅手动重试失败项，60 项最终成功，错误清除 |
| #001 慢响应时切到 #025 | 当前 URL/标题保持 #025；旧 #001 响应未覆盖当前对象 |

临时服务交付前关闭。未声称执行完整 Offline 场景、所有推荐视口、线上 Pages
或最终课程提交。第 4 轮仍负责全部响应式/视觉/规则与异常矩阵最终复审。

## 手动验收：启动

入口：**http://127.0.0.1:5173/mp2/gallery/**。本轮结束时保留现有开发服务。

若服务已停止：

```sh
cd "/Users/a16594/Desktop/uiuc FA26/cs 409/mp2"
npm run dev
```

若 5173 已占用，先检查现有地址，不重复初始化或安装依赖。

## 手动验收：真实图库

1. 默认 Live data，等待目录和类型数据完成。预期 All types、60 of 60、
   60 张卡片按 #001–#060 排列，名称/类型/图像对应。
2. 加载过程中应显示 profiles loaded / pending，类型控件暂时禁用。
   网络和浏览器缓存可能让此状态很短，不要求刻意触发远程限流。
3. 按下面的计数与编号核对；多选不是 AND：

| 选择 | 预期 |
|---|---|
| Fire | 7：004、005、006、037、038、058、059 |
| Water | 6：007、008、009、054、055、060 |
| Fire + Water | 13：004、005、006、007、008、009、037、038、054、055、058、059、060 |
| Grass + Poison | 23；双类型 Bulbasaur 仅出现一次 |
| 取消 Fire，保留 Water | 恢复 Water 的 6 项 |
| Clear filters | 60 项；没有 type 参数；Clear 变为禁用 |

4. `Fire + Water` 下点击 Charmander #004。预期 1 of 13 / Gallery results。
   Previous 到 Poliwag #060（13 of 13）；Next 回 Charmander；继续 Next 到
   Charmeleon #005（2 of 13）。网址始终保留 `from=gallery&type=fire&type=water`。
5. 刷新、复制地址至新标签、浏览器后退/前进。对象与结果位置应按 URL 恢复。
   Back to gallery 后两个勾选仍在，仍为 13 项。
6. 打开 `http://127.0.0.1:5173/mp2/gallery/?type=dragon`：完整加载后为 0 项，
   提示 Dragon 不在这份目录；Clear 可恢复 60 项。未知 type 值会被忽略。
7. 打开 `http://127.0.0.1:5173/mp2/pokemon/25/?from=gallery&type=fire`：
   Pikachu，25 of 60，显示全目录回退提示；Next 的 URL 含 browse=all；
   Back to gallery 恢复 Fire 7 项。

## 手动验收：样例与 List 回归

1. 点击 Use sample data，地址带 `mode=sample`，出现 Sample mode 标签、
   六项范围、远程图片仍需网络的说明。Clear filters 后为 6 of 6。
2. 只选 Electric，预期唯一 Pikachu。进入详情：1 of 1，Previous/Next 禁用。
   刷新、返回、顶部 List/Gallery 链接均保留 mode=sample。
3. 在样例 Gallery 选 Fire + Water，预期 #004、#007、#060 共 3 项；
   点击 #004 后 Previous 到 #060，Next 按 004→007→060→004 循环。
4. 样例 List 搜索 char，预期仅 Charmander；切换到 Use live data 后为
   第 2 轮的 3 项。Name/Ascending 仍应为 006→004→005。
5. 打开 `http://127.0.0.1:5173/mp2/pokemon/2/?mode=sample`，预期范围提示，
   不从 live 缓存借用 #002。Use live data 后可取得真实 Ivysaur。
6. View source data & capture date 链接应打开本地 JSON，可看到实际来源、
   采集时间和六项 ID。

## 手动验收：失败恢复与缓存（Chrome 开发者工具）

建议用 Network request blocking 定向阻断 API，保留 localhost 和图片网络。
不要用整个浏览器 Offline 验证“本地 JSON 必须能新加载”；本项目没有 service worker。

1. 打开开发者工具的 Network request blocking，启用匹配
   `*pokeapi.co/api/v2/pokemon/4/*` 的规则。刷新 Gallery 建立新应用会话。
2. 等待所有请求完成：预期 59 profiles loaded、1 failed（#004）；
   成功卡片保留；筛选禁用；不会把 Fire 查询显示成“0 匹配”。
3. 删除/关闭该阻断规则，点击 Retry failed profiles。预期仅补发 #004，
   最终 60 项，筛选开放。若原 URL 带 Fire，恢复后直接显示 7 项。
4. 在 Network 过滤 `pokeapi.co/api/v2`，随后切类型、进入缓存对象、返回
   Gallery/List，再排序搜索。预期不重取已成功目录/对象；图片请求另计。
   **刷新重启应用会话会重新请求，内存缓存不跨刷新。**
5. 阻断 `*pokeapi.co/api/v2/*` 并刷新。目录应报错；Use sample data 仍可从
   localhost 的 JSON 读取六项样例。解除规则后 Use live data 可恢复实时目录。

429 与超时已在独立 HTTP 故障环境和自动测试中验证；不需要为了手动验收
向真实 PokéAPI 大量发请求制造 429。若实际遇到带 Retry-After 的 429，
预期看到禁用的倒计时，结束后可手动 Retry。

## 手动验收：命令与布局

在 mp2 目录依次执行：

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

预期全部成功；**39 passed / 3 files**；构建生成 62 个 route 入口、404，
以及 `dist/data/pokemon-sample.json`。可使用 npm run preview 验证生产 UI；
真实 Pages 仍需第 5 轮验收，Vite preview 的回退不单独证明静态深链接。

390×844 下检查图库、类型控件、模式选择和详情前后导航无横向溢出。
Tab 可到类型框，Space 切换，Enter 激活对象/Next，焦点可见。

## README 复审与下一轮

已对照原 README：Gallery 媒体与属性过滤、两个详情入口、详情属性、
Previous/Next 和特定 URL 均已完成本地功能闭环。OR、60 项、首尾循环、
样例六项范围属于批准方案内的设计，未当作课程硬性条款。Axios、React
Router、TypeScript、无 inline styling/script/table 的约束继续满足。

未提交、推送或部署；第 4 轮继续完整视觉、推荐视口、全部 rubric/异常/规则
复审；第 5 轮完成实际 Pages、录屏和课程提交。真实聊天记录和 LLM survey
仍须按 README 随最终提交补齐，日志 CSV 目前只有表头。
