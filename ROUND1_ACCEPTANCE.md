# MP2 第 1 轮交付与手动验收

日期：2026-10-05（America/Chicago）。范围：SOP 第 11–13 步的数据/配置基础，
以及提前实现的第 16 步最小详情入口。第 1 轮本地验收完成，尚未推送或部署。

## 本轮完成内容

- 按课程指令原地初始化 Vite `react-ts`，选用 ESLint。
- 初始化选择 **Ignore files and continue**；原 README 恢复，部署工作流
  与初始化前逐字节一致。没有更改 `.github/workflows/deploy.yml`。
- React、TypeScript、React Router、Axios、Normalize.css 已安装；锁文件存在。
- 配置 Vite `base: '/mp2/'`、BrowserRouter basename、Link、三个 view 路由。
- 默认页面与 List 展示 API 的 60 项名称/编号；Gallery 展示 Bulbasaur
  的真实图片卡片；两个入口均进入同一 Detail 路由。
- Detail 显示所选对象的图片、类型、身高、体重、能力与 stats；对象来自 URL。
- 共享数据层提供会话缓存、进行中的请求去重、最多 4 并发的详情队列、
  类型/关键响应验证、10 秒 timeout、加载/错误状态与手动 Retry。
- 共享请求归数据层所有；切换页面只取消订阅，避免误取消其他页面使用的请求。
  返回数据仅更新自己的 ID 缓存；当前路由读取自己的 ID，不被旧响应覆盖。
- 构建生成 List、Gallery 与 ID 1–60 的 **62 个静态入口**，加一个 404 入口。
  这些文件使用同一个编译应用，不是各自开发的不同站点。
- SOURCES.md 与日志索引建立。日志 CSV 当前只有表头；最终提交前需真实
  聊天记录及 LLM survey，当前不宣称日志提交完成。

## 自动/浏览器验收结果

| 检查 | 实际结果 |
|---|---|
| 原 README / 工作流保护 | 与本轮初始化前的副本一致 |
| 本地 Node | v24.20.0；开发服务器可运行 |
| CI 兼容检查 | 实际使用 Node v20.20.2，执行 npm ci、lint、test、build 全部成功 |
| 基础测试 | 1 个测试文件，10 项测试通过 |
| 请求并发与缓存 | 测试验证最多 4 并发、请求去重、成功结果复用 |
| 边界与恢复 | 测试验证 ID 范围、响应校验、单位转换、错误后重试和晚到响应隔离 |
| 真实 API | 目录与 ID 1/25 返回 200、CORS=*；浏览器实际读取对象并显示图像 |
| 两个页面入口 | List→Bulbasaur；Gallery→同一个 Bulbasaur 详情，返回来源正确 |
| 直接 URL / 刷新 | Pikachu 的开发地址和普通静态服务地址均可直接打开并刷新 |
| 静态 HTTP | List/Gallery/ID 1/25/60 返回 200；无尾斜线的 query 在重定向后保留 |
| 静态范围 | ID 61 无有效入口，普通静态服务器返回 404 |
| 应用 Not found | 开发地址 `/pokemon/61/` 显示范围提示和返回链接，无崩溃 |
| 生产规则 | 应用 DOM 无 style 属性、无 table；生产 HTML 无内联执行脚本 |
| 基础窄屏 | 390×844 的详情页面没有横向溢出；完整响应式验收仍在第 4 轮 |
| 控制台 | 已检查的正常页面没有 warning/error |

兼容性修订：初次安装的 React Router 8 / Vitest 5 声明要求更高 Node。
已锁定 **React Router 7.18.4 / Vitest 4.1.11**，与现有 Node 20 工作流兼容，
并用 Node 20 重新干净安装/测试/构建。Vite 实际版本 8.3.2，Axios 1.20.0，
React 19.3.0，TypeScript 6.0.3。没有通过改工作流掩盖兼容问题。

npm 审计本次为 0 vulnerabilities。npm 11 对 macOS 可选依赖 fsevents
提示 install-script 未批准；本次安装、开发、测试与构建均成功，无需为此
修改课程工作流或进行强制依赖升级。

注意：开发环境的 Vite/React 会注入热更新脚本；内置浏览器也有自己的覆盖层。
课程规则检查针对应用源文件和生产产物，生产页已检查无内联执行脚本，
样式检查限定应用 `#root`，不把浏览器自己的覆盖层误认成应用内联样式。

## 手动验收：启动与页面

本轮结束时开发服务器已运行：

**http://127.0.0.1:5173/mp2/**

若以后服务已停止，在终端执行：

```sh
cd "/Users/a16594/Desktop/uiuc FA26/cs 409/mp2"
npm run dev
```

预期看到上述地址。5173 被占用时 Vite 会明确报错，不会自动换端口；先确认
是否已有本项目的服务在运行，可直接使用现有地址。不要把 `npm start` 当启动命令。

| 操作 | 预期结果 |
|---|---|
| 打开首页或 `/mp2/list/` | 标题 Pokémon Explorer；60 Pokémon；编号从 #001 到 #060 |
| 点击 #001 Bulbasaur | 地址为 `/mp2/pokemon/1/?from=list`；显示图片、Grass/Poison、0.7 m、6.9 kg、能力与 stats |
| 点击 Back to list | 回到列表，不重新请求整个目录 |
| 点击顶部 Gallery | 显示一张 Bulbasaur 真实媒体卡片（第 1 轮仅此展示卡片） |
| 点击卡片 | 同一个对象详情；地址带 `from=gallery`；返回链接为 Back to gallery |
| 在新标签打开 `http://127.0.0.1:5173/mp2/pokemon/25/` | 无需先访问列表，直接显示 #025 Pikachu、Electric、0.4 m、6 kg |
| 在 Pikachu 详情按刷新 | 仍显示同一个对象，无白屏/路由丢失 |
| 打开 `/mp2/pokemon/61/` 或 `/mp2/pokemon/abc/` | 显示 Not found / 目录范围提示和返回链接，不显示上一个对象 |
| 使用 390px 手机宽度 | 详情图片/文字上下排列，无横向滚动；导航仍可点击 |

## 手动验收：缓存与错误（浏览器开发者工具）

1. 打开 Network，勾选 Preserve log；过滤 `pokeapi.co/api/v2` 的 Fetch/XHR。
   刷新 List：目录请求应为 `pokemon?limit=60&offset=0`，不会为列表 60 行
   自动发出 60 个详情请求。
2. 点击 Bulbasaur：看到 `pokemon/1/`。随后通过页面链接在 List/Gallery/
   Bulbasaur Detail 之间切换：不应再次请求已成功的目录或同一详情。
   图片请求与 API JSON 分开看。缓存仅限当前应用会话；刷新会重新取数据。
3. 错误检查：先刷新建立新会话，将 Network 切成 Offline，再点击尚未访问
   的对象，如 #060。预期显示错误说明与 Retry，不显示其他对象的旧数据。
   恢复 Online 后点击 Retry，预期出现 Poliwag 的真实详情。
4. 手动浏览器这次只能观察按需请求；**4 并发上限以自动队列测试验证**。
   本轮没有暴露额外调试按钮来一次性请求 60 项。

以上故障注入步骤是供用户复现的操作；本轮代理实际执行了单元级错误恢复
和响应乱序测试，没有将浏览器 Offline 注入记作已经执行。

## 手动验收：命令与生产产物

在项目目录的另一个终端分别执行：

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

预期：四个命令退出成功；测试显示 10 passed；构建输出 `dist/`，并显示
`Generated 62 static route entries and a 404 entry.`

需要构建预览时执行：

```sh
npm run preview
```

访问 **http://127.0.0.1:4173/mp2/** 与 `/mp2/pokemon/25/`，检查直接访问和刷新。
Vite preview 带路由回退，单靠它不能证明静态入口存在。再检查这些文件：

- `dist/list/index.html`
- `dist/gallery/index.html`
- `dist/pokemon/1/index.html`
- `dist/pokemon/25/index.html`
- `dist/pokemon/60/index.html`
- `dist/404.html`

本轮另用普通静态服务器验证了有效入口的 HTTP 200 和浏览器刷新，因此
本地验证没有只依赖 Vite 回退。真实 GitHub Pages 环境仍未验证。

## 可选：手动提前部署最小版本

这不是本轮已完成的项目，最终全面部署验收仍在第 5 轮。若希望现在提前
发现 Pages 配置问题，可以手动执行：

1. 确认 GitHub `Zane1ee/mp2` 仓库公开；Settings → Pages → Source 选 GitHub Actions。
2. 本地先 `git status` / `git diff` 检查，只包含预期源码、配置、文档和锁文件，
   不包含 node_modules、dist 或备份。特别确认 package-lock.json 已纳入提交。
3. 提交并推送当前版本到 main。尚缺真实 LLM 日志，不把此版本当最终课程提交。
4. Actions 的 build/deploy 变绿后，打开 `https://zane1ee.github.io/mp2/`。
5. 直接新标签打开 `https://zane1ee.github.io/mp2/pokemon/25/` 并刷新；
   预期对象、图片与字段正常，JS/CSS 没有 404，Network 的有效文档返回 200。

## 后续范围

第 2 轮：实时搜索、双属性升降序、URL 条件、完整 List 来源 Previous/Next。
第 3 轮：60 项完整图库、类型 OR 筛选、图库来源序列、完整样例/异常联动。
第 4 轮：完整视觉与响应式、全部 rubric/错误/可访问性与规则验收。
第 5 轮：最终推送、真实 Pages、录屏、来源/聊天记录、LLM survey 与表单。

本轮没有实现搜索/排序/类型过滤/Previous/Next，也没有生成供提交的样例
模式或声称这些后续功能已经通过验收。没有提交、推送或更改 GitHub 设置。
