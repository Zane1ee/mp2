# MP2 第 2 轮交付与手动验收

日期：2026-10-05（America/Chicago）。第 1 轮已由用户手动验收通过。
本轮范围：SOP 第 14 步，以及第 16 步的 List 来源详情与导航。
本轮本地验收通过；实际 GitHub Pages 和课程最终提交仍待后续执行。

## 完成内容与配置

- List 使用真实 API 的 #001–#060 目录，提供按名称逐字过滤、大小写不敏感、
  去除查询首尾空白、结果计数和无匹配提示。
- `Number` / `Name` 两个独立属性均可选择 `Ascending` / `Descending`。
  Number 按数值比较；排序不修改共享目录数组。
- 查询与排序保存为 URL 的 `q` / `sort` / `order`。输入和选择控件使用
  replace 更新当前记录，避免每输入一个字符就增加一条浏览历史。
  `Clear search` 仅清空查询，保留排序；空查询时按钮禁用。
- List→Detail 携带 `from=list` 和完整条件。Previous/Next 跟随当前匹配结果
  的排序，首尾循环；单结果禁用两端。刷新、新标签和浏览器历史能重建顺序。
- 无来源的详情 URL 按全部 60 项 ID 升序浏览。对象与来源结果不匹配时，
  显示明确提示并转为全目录；后续导航附带 `browse=all`，防止中途悄悄切回
  原结果集合。Back to list 仍恢复原搜索与排序。
- 详情标题、页面标题、焦点与滚动随当前对象更新。沿用按 ID 的共享缓存，
  避免晚到响应覆盖另一对象；非法 route 不发起目录加载。
- 未添加依赖或 MCP。`package.json`、锁文件、原 README 与工作流均与本轮
  开始前一致；保留 Node 20 兼容版本、`/mp2/` base/basename 与现有 API 配置。
- Gallery 仍是第 1 轮的 Bulbasaur 单张展示卡片；它的详情导航按单项禁用。
  完整 60 项图库、类型 OR 筛选和图库结果导航属于第 3 轮。

主要文件：`src/utils/listState.ts`、`src/utils/detailNavigation.ts`、
`src/components/DetailNavigation.tsx`、`src/pages/ListView.tsx`、
`src/pages/DetailView.tsx`、`src/state/hooks.ts`、页面 CSS 与
`tests/list-navigation.test.ts`。

## 已实际执行的验收

| 检查 | 实际结果 |
|---|---|
| Node 20 兼容性 | Node v20.20.2 下 lint、test、build 全部成功；build 包含 TypeScript 检查 |
| 自动测试 | 2 个文件，25 项通过：原基础 10 项 + 搜索/排序/URL/导航 15 项 |
| 搜索与四组合排序 | 浏览器输入 `char`，3 项；四种排列与下方矩阵一致 |
| 查询边界 | `  CHAR  ` 得到 3 项；无匹配和特殊字符查询得到空结果且无崩溃；清空恢复 60 项并保留排序 |
| List 详情闭环 | Name/Ascending 的 6→4→5→6 循环、反向首尾、返回条件保持通过 |
| 单项与来源不匹配 | Pikachu 单项两端禁用；不匹配来源显示全目录提示与 25 of 60 |
| URL 与浏览历史 | 条件 URL 直达、刷新、浏览器后退/前进、Back to list 通过 |
| 默认顺序 | 无来源 ID 1 的 Previous 到 ID 60，显示真实 Poliwag |
| 无效枚举 | 未知 sort/order 回退 Number/Ascending；详情链接写入有效值 |
| Gallery 回归 | 原单张卡片仍进入 Bulbasaur，并可 Back to gallery |
| 普通静态产物 | 在普通静态服务器直接打开带条件的 ID 6、刷新、返回列表均通过，不依赖 Vite 回退 |
| 生产规则 | 检查的应用 DOM 无 inline style、无 table；无内联执行脚本；真实图片加载成功 |
| 窄屏与键盘 | 390×844 的 List/Detail 无横向溢出；Previous 可通过键盘 Enter 激活 |
| 控制台 | 检查的开发/生产正常页面 warning/error 为空 |
| 构建 | `dist/` 生成 62 个有效 route 入口及 404 入口，所有入口使用同一个应用 shell |

本轮没有执行新的 clean install，也没有浏览器 Offline/429 全矩阵注入。
原基础测试继续覆盖去重、缓存、最多 4 并发、重试、晚到响应隔离。
完整故障、所有推荐视口及实际 Pages 验收仍按后续轮次执行。

## 手动验收：启动

现有开发服务地址：**http://127.0.0.1:5173/mp2/list/**。

如果服务已停止：

```sh
cd "/Users/a16594/Desktop/uiuc FA26/cs 409/mp2"
npm run dev
```

若提示 5173 已占用，先打开上述地址确认现有服务，避免重复启动。

## 手动验收：搜索和排序

1. 打开 `/mp2/list/`。预期 60 项，Number/Ascending，编号 #001–#060。
2. 搜索框逐字输入 `char`，无需提交或按 Enter。预期实时缩至 3 项，URL
   出现 `q=char`，计数显示 `3 of 60 Pokémon`。
3. 依次选择下列组合，核对完整顺序：

| Sort by | Order | 预期从上到下 |
|---|---|---|
| Number | Ascending | #004 Charmander → #005 Charmeleon → #006 Charizard |
| Number | Descending | #006 Charizard → #005 Charmeleon → #004 Charmander |
| Name | Ascending | #006 Charizard → #004 Charmander → #005 Charmeleon |
| Name | Descending | #005 Charmeleon → #004 Charmander → #006 Charizard |

4. 改为 `  CHAR  `，仍为相同 3 项；改为 `zzzz-no-match`，显示
   `0 of 60 Pokémon` / `No Pokémon found.`，没有旧结果残留。
5. 输入 ` &+/? `，预期无匹配、无报错，URL 安全编码。
6. 点击 `Clear search`，恢复 60 项，当前 Sort by/Order 不变；URL 的 q 消失。
   只有空格的查询也显示全部 60 项。

可选：在开发者工具 Network 过滤 `pokeapi.co/api/v2`。目录成功加载后，
修改搜索和排序不应新发目录/详情 API 请求；这是本地选择器操作。
内存缓存仅在当前应用会话内有效，刷新会重新取 API 数据。

## 手动验收：详情顺序和 URL

| 操作 | 预期结果 |
|---|---|
| `char` + Name/Ascending，点击 Charizard | #006，`1 of 3` / `List results`；URL 带 `from=list&q=char&sort=name&order=asc` |
| 连续点击 Next 三次 | Charmander #004（2 of 3）→ Charmeleon #005（3 of 3）→ Charizard #006（1 of 3） |
| 在第一项点击 Previous | Charmeleon #005（3 of 3），确认首尾循环 |
| 在 Next/Previous 链接上用 Tab + Enter | 导航可执行，标题与选中对象对应 |
| 刷新当前详情；把当前地址复制到新标签打开 | 同一对象、同一 3 项顺序和位置，不必先访问列表 |
| 使用浏览器后退、前进 | 恢复对应对象及该 URL 的条件，图片和属性不串项 |
| 点击 Back to list | 搜索仍为 char，Name/Ascending，3 项顺序与上表一致 |
| 搜索 pikachu，点击唯一结果 | Pikachu，1 of 1，Previous 与 Next 均禁用 |
| 新标签打开 `/mp2/pokemon/1/`，点击 Previous | 从 Bulbasaur 1 of 60 到 Poliwag #060，60 of 60 / Full collection |
| 打开下方不匹配 URL | Pikachu 25 of 60，显示全目录提示；Next 到 #026，URL 带 browse=all；Back to list 恢复 char/Name/Ascending |
| 打开 `/mp2/list/?q=char&sort=invalid&order=invalid` | Number/Ascending，#004、#005、#006；点击对象的详情链接使用有效枚举 |
| Gallery→Bulbasaur→Back to gallery | 原单张卡片入口正常；1 of 1、前后禁用（完整图库下一轮实现） |

不匹配 URL：

```text
http://127.0.0.1:5173/mp2/pokemon/25/?from=list&q=char&sort=name&order=asc
```

预期提示：`Browsing the full collection instead of the original results.`

## 手动验收：构建与布局

在项目目录依次执行：

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

预期全部成功；测试显示 **25 passed / 2 files**；构建生成 `dist/`，末尾显示
`Generated 62 static route entries and a 404 entry.`。

手机验收：开发者工具切到 390×844。检查搜索、两个下拉框和 Clear search
均可操作；结果/详情内容及前后导航无横向溢出。完整响应式范围留到第 4 轮。

可选生产预览：运行 `npm run preview`，访问
`http://127.0.0.1:4173/mp2/pokemon/6/?from=list&q=char&sort=name&order=asc`，
刷新并 Back to list。Vite preview 有回退，不能单独证明实际 Pages 的路由行为。
本轮代理已另用普通静态服务验证入口；临时验收服务在交付前关闭。

## README 复审与后续边界

本轮已重新对照原 README：List 28 分对应真实目录、逐字搜索、两个属性及
各自升降序；List→Detail、具体属性、按结果循环导航与专属 URL 已实现。
首尾循环、单项禁用、60 项范围、URL 状态和来源不匹配回退是已批准设计，
并非 README 额外强制条款。未发现本轮规划与 README 的冲突。

第 3 轮继续 Gallery 及其来源详情、异常/样例闭环；第 4 轮完整视觉、故障和
规则验收；第 5 轮实际部署与课程提交。完整 Details 38 分尚未整体验收。
没有执行 Git 提交、推送或部署，也没有更改 GitHub 设置。

`SOURCES.md` 已补充实际阅读参考。`llm_logs.csv` 仍只有表头；最终提交前须
补齐真实聊天记录，并回答 grading form 的 LLM survey。
