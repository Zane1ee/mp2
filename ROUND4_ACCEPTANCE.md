# MP2 第 4 轮交付与手动验收

实施日期：2026-10-05 至 2026-10-06（America/Chicago）。用户已确认第 1–3 轮手动验收通过。
本轮接续中断前的改动完成，范围是 SOP STEP 17–20；本地发布候选验收通过，待用户手动验收。
STEP 19 的规则、来源和实际本地聊天记录已准备；最终记录更新、随源码提交和 LLM survey 属于第 5 轮。
本轮没有提交、推送、部署、上传视频、分享聊天记录或提交课程表单。

## 完成内容与修复

- 延续批准的英文、浅蓝/深蓝/白色和系统字体设计，统一三页的颜色变量、控件边框、错误背景、禁用/选中/焦点状态。
- 控件与类型标签至少 44px 高，详情属性和工具栏自适应换行；320/390px 下前后导航两列排列，集合位置单独一行。
- 修复 320px + 200% 文字放大时 List 卡片的固有宽度造成横向溢出：名称可换行，网格允许缩小，手机编号与名称分行。
- 页面切换将焦点移到当前主标题并回到顶部；搜索/排序/类型 query 改动保留控件焦点。Skip to content 可聚焦 main。
- 加载、失败、样例范围外和未找到页面各有一个主标题及对应浏览器标题；失败时不残留上一对象的属性。
- 详情加载区预留高度，减少布局位移；不承诺所有异步内容完全零位移。尊重 reduced motion，使用少量颜色/边框过渡。
- 图库卡片的可访问名称包含编号、名称、类型和详情动作；加载列表标记 aria-busy。错误文本与重试倒计时分开，避免倒计时重复进入 alert。
- 修复键盘重试成功后按钮卸载造成的焦点丢失：图库、目录、样例重试后焦点保留在主标题，详情恢复后聚焦正确对象标题。
- 修复两个有实际失败测试证明的响应边界：超大 Retry-After 不产生 Infinity 永久等待；缺失 sprites 不隐藏有效对象，改为缺图占位。
  缺少身高/体重/能力/基础 stats 显示 Unavailable；核心 ID 或 types 损坏仍明确拒绝。
- 应用和构建配置开启 TypeScript strict，现有源代码通过检查；未增加依赖、MCP、账户或 API key。
- 新增实际聊天记录导出工具、本地记录和真实索引；保留第 1–3 轮验收记录，更新 SOP 和 SOURCES。

## 实际自动、构建与规则验收

| 检查 | 结果与边界 |
|---|---|
| 可重复安装 | 独立临时目录使用同一 lockfile，Node 20.20.2 执行 npm ci 成功；安装 216 个包，audit 为 0 vulnerabilities |
| 安装提示 | 可选的 macOS fsevents 安装脚本出现警告；没有阻止安装、测试、构建或开发服务，不当作零警告安装 |
| 最终自动检查 | Node 20.20.2 的 lint、strict 类型检查、41 项测试（4 文件）及生产 build 全部通过 |
| 新测试 | 两项响应边界测试先在原实现失败，再在修复后通过；已有排序、URL、缓存、4 并发、乱序、样例隔离、429 测试继续通过 |
| 生产产物 | 62 个有效 route 入口（list、gallery、60 个详情），另有根 index 和 404；相同 SPA shell，资源在 /mp2/assets/ |
| 静态访问 | 原样生产副本的详情专属 URL、硬刷新、图库来源恢复和本地样例资源通过；不依赖 Vite history fallback 作为唯一证据 |
| 版本一致 | 原项目与 Node 20 独立目录最终 HTML/JS/CSS 逐字节一致；dist 样例与 public 原件一致 |
| 文件保护 | 原 README、课程 workflow、package.json、lockfile、六项 API 样例与本轮开始前逐字节一致 |
| 禁止项 | 应用源码、生产 HTML 和应用 DOM 无 inline styling、inline script 内容或 table layout；默认仍是真实免费 PokéAPI |
| 浏览器工具边界 | Codex 浏览器自身注入的批注浮层位于 #root 外，有工具样式；应用 #root 内 style/table/inline script 均为 0，不把工具浮层当作项目代码 |
| 正常控制台 | 最终真实生产 Gallery 的 warning/error 为空；故障注入中的预期 HTTP/图片错误单独记录 |

`dist/`、`node_modules/`、临时故障服务和备份不进入源码提交。实际 Pages、Actions 和公开仓库/视频/表单权限仍待第 5 轮。

## README 的 100 分映射复审

下表表示本地可演示功能覆盖，不是课程评分结果。README 额外要求的 Axios、实时搜索、专属详情 URL 同时检查。

| Rubric | 分值 | 本地证据 |
|---|---:|---|
| List 的 API 相关内容 | 4 | 真实 #001–#060 名称/编号与范围说明 |
| 搜索过滤 | 8 | char 逐字搜索为 3 项；大小写/空白/无匹配/Clear 的测试与已有浏览器回归 |
| 至少两个排序属性 | 8 | Number 与 Name |
| 两属性各自升降序 | 8 | char 的四组合实际顺序见下方手验表 |
| Gallery 的对象媒体 | 4 | 真实 API 返回图片，最终 Fire OR Water 的 13 张图片成功加载 |
| 属性过滤 | 8 | Fire 7、Water 6、OR 13；Grass OR Poison 23 且不重复；取消和 Clear |
| List → Detail | 10 | char/Name/Ascending 从 Charizard 进入专属 URL，1 of 3 |
| Gallery → Detail | 10 | Fire OR Water 从 Charmander 进入同一详情组件，1 of 13 |
| 对象详情 | 8 | 名称/编号/图片/类型/身高/体重/能力/基础 stats 与选中 ID 对应 |
| Previous / Next | 10 | 两来源集合、首尾循环、单项禁用、直达、刷新、返回；已有历史/回退回归 |
| Router + TypeScript | 12 | 实际 BrowserRouter/Link、basename、TS strict 和生产构建 |
| Design | 10 | 三页统一视觉、五个视口核心操作、键盘/状态/对比抽查和真实截图 |
| 合计 | 100 | 无已知 README 与实现冲突；线上和最终提交尚未验收 |

60 项范围、六项样例、OR、首尾循环、配色和推荐视口属于 D1–D7 批准的设计，未追加为 README 硬性要求。
发现 SOP 原文“loading 不跳布局”过于绝对，已改为预留空间、减少位移，与实际实现一致。

## 响应式、文字与键盘证据

| CSS 视口 | List / Gallery / Detail | Gallery 列数 | 详情导航 |
|---|---|---:|---|
| 1440×900 | 核心操作成功，无横向溢出 | 4 | 同行 |
| 1024×768 | 同上 | 4 | 同行 |
| 768×1024 | 同上 | 3 | 同行 |
| 390×844 | 同上 | 1 | 两列，位置独占一行 |
| 320×800 | 同上 | 1 | 两列，位置独占一行 |

每个尺寸实际记录了 document scrollWidth 与 innerWidth 相等、单个 h1，以及搜索/前后/图库 OR 操作。
最后的 List 网格修复又按五个实际尺寸复测，无溢出。
记录见 [responsive-matrix.json](docs/qa/responsive-matrix.json)。

200% **文字放大**使用临时服务追加的外部 stylesheet 将根文字从 16px 放大到 32px，未添加项目内联样式。
320、390、768px 下三个 view 均无横向溢出，样例筛选及详情操作成功，见 [large-text-matrix.json](docs/qa/large-text-matrix.json)。
这与浏览器原生页面 200% 缩放不同；原生缩放需按下方手动步骤验证，不声称已经自动通过。

实际键盘验证：Skip link 的 Enter 聚焦 main；搜索连续输入保留焦点；原生排序菜单通过方向键/Enter 提交；类型 Space 切换；详情 Previous 的 Enter 首尾循环；错误 Retry 的 Enter 恢复后不丢焦点。
每页/加载/错误/范围外状态有一个主标题，页面切换、错误和正确对象的标题/焦点对应。

对比抽查：辅助文字/白色 5.21:1，辅助文字/实时提示背景 4.75:1，样例背景 4.81:1，按钮白字/蓝底 6.06:1，错误字/错误背景 7.53:1，控件边框/输入背景 3.10:1。
这些是指定颜色组合的计算与界面抽查，**不表示完成全面 WCAG 认证或屏幕阅读器实测**。

## 异常与恢复验收

采用临时独立生产副本与本地 HTTP 故障服务；仅测试副本改写 API base。Fixture 名称/响应不进入正式源码、dist 或真实 API 样例。

| 本轮注入/检查 | 实际结果 |
|---|---|
| 缺 sprites、height、weight，能力/stats 为空 | 有效详情继续显示，Image unavailable + 四项 Unavailable，前后导航可用 |
| 图片 URL 返回 404 | Image unavailable；当前标题、属性和导航正常 |
| TCP 断连 | 明确网络错误、Profile unavailable 标题与焦点；没有上一对象字段；恢复 Retry 成功 |
| #004 返回 503 | 59 个成功对象保留，失败编号 #004，类型禁用；不显示假空筛选结果 |
| 恢复 #004、重试 | 只增加一次 #004 请求，已有成功项不重取；键盘重试后焦点保持 Gallery h1 |
| 请求 #025 却返回另一个 ID | 拒绝“different Pokémon”，没有上一对象属性 |
| types 为空 | 拒绝 invalid types；恢复后键盘 Retry 得到 #025 并聚焦其 h1 |
| 详情延迟 11 秒 | 先有单个 Loading profile 主标题；实际 Axios 10 秒超时后有错误、Retry、错误标题与焦点 |
| 目录仅 59 项 | 明确 catalog incomplete，不作为有效 60 项目录或零匹配结果 |
| 样例文件 503 / 来源与内容损坏 | 明确本地文件错误 / incomplete or no valid source；恢复 Retry 得到真实 6 项，焦点保持 List h1 |
| 首个 429 + Retry-After，其他已启动请求稍后完成 | 倒计时禁用 Retry；已启动 4 个详情可以完成，剩余队列不发送 HTTP；到期没有自动请求，手动恢复后 60 项成功 |

429 的“目录 + 4 个详情”数量来自首个 429 提前于其他完成的确定性注入。
一般并发情况下，在客户端收到 429 前其他请求可能已完成并启动后续请求；保证是收到限流后停止新的队列 HTTP，不保证所有时序固定总计五次。
慢响应切 ID、浏览历史、样例/实时缓存隔离和目录重试的已有第 2–3 轮证据保留，相关自动回归本轮继续通过。
没有向真实 API 制造远程限流，没有声称全站/全部图片离线可用。

## 来源与真实 LLM 记录

来源继续登记在 [SOURCES.md](SOURCES.md)，包括本轮参考的 W3C contrast/reflow 和 MDN tabindex。
新增 [scripts/export-chatlog.mjs](scripts/export-chatlog.mjs)，校验指定会话 ID 后导出当前项目会话的实际可见消息和助手工具调用代码/参数。
记录：[docs/llm/mp2-chatlog.md](docs/llm/mp2-chatlog.md)；索引：[llm_logs.csv](llm_logs.csv)。

记录有导出时间、捕获截止点和源快照 SHA-256。路径已匿名化，凭据模式会脱敏；自动环境/浏览器状态、系统/开发者消息、内部推理、工具输出、网页正文和二进制媒体不作为可见聊天记录导出。
这是当前检查点的本地实际记录，不是补写的开发故事；尚未上传或生成公开分享链接。
第 5 轮结束前须再次更新记录，随源码实际提交，并由所有者在课程表单完成 LLM survey。
README 没有新增其他 LLM 隐藏任务或必须配置的 MCP；本轮没有新增需拍板的 D1–D7 之外个性化方案。

## 用户手动验收：启动与命令

入口：**http://127.0.0.1:5173/mp2/list/?q=char&sort=name&order=asc**。
本轮保留已有开发服务。服务停止时，在终端执行：

```sh
cd "/Users/a16594/Desktop/uiuc FA26/cs 409/mp2"
npm run dev
```

不需要再次 create-vite、注册 API、安装 MCP 或改 Git。若端口已占用，使用终端显示的地址或检查现有服务。
刷新页面取得当前代码；使用 Live data 做前四项，网络正常时等待 Gallery 完成。

| 操作 | 预期结果 |
|---|---|
| List 输入 char，无需回车 | 3 of 60；大小写和首尾空白不影响结果；光标持续在搜索框 |
| Number + Ascending | #004 Charmander → #005 Charmeleon → #006 Charizard |
| Number + Descending | #006 → #005 → #004 |
| Name + Ascending | #006 → #004 → #005 |
| Name + Descending | #005 → #004 → #006 |
| Name/Ascending 点击 #006 | 详情 Charizard、1 of 3、Fire/Flying、1.7m、90.5kg；Previous 到 #005，Next 回 #006，再 Next 到 #004 |
| 详情刷新、新标签打开、Back to list | 对象及集合重建，返回仍有 char/Name/Ascending |
| Gallery 等待完成 | All types 60 of 60；选择 Fire 为 7、仅 Water 为 6、Fire + Water 为 13；Clear 回 60 |
| Fire + Water 点击 #004 | 1 of 13；Previous 到 #060（13 of 13），Next 回 #004；刷新与 Back 保留两种类型 |
| 样例模式，Clear 后只选 Electric | Sample mode / 6 saved Pokémon；唯一 Pikachu；详情 1 of 1，Previous/Next 禁用 |
| 样例 #002 直达 | `/mp2/pokemon/2/?mode=sample` 为 Outside the sample collection；Use live data 可取得 Ivysaur |
| 无匹配输入/筛选 | 如 List 输入 zzzzzz，明确 0 of 60 与空状态，Clear 恢复；不是无限 Loading |

手机/键盘/缩放手验：

1. 用浏览器设备预览检查 1440×900、1024×768、768×1024、390×844、320×800；三个 view 没有横向滚动、文字遮挡或按钮叠在一起，详情可纵向滚动到导航。
2. 用 Tab / Shift+Tab：焦点边框可见，Skip to content 的 Enter 跳到 main；Space 切类型；Enter 打开对象及前后导航。切页后焦点到新标题，输入过程中不被抢走。
3. 桌面浏览器原生缩放设为 **200%**：三个 view 的文案与操作仍可读可用，工具栏/属性允许换行，不能裁掉筛选或导航。完成后恢复 100%。这是仍需手动确认的独立缩放检查。

失败恢复手验（Chrome 开发者工具，可复用第 3 轮方法）：

1. Network request blocking 定向阻断 `*pokeapi.co/api/v2/pokemon/4/*`，刷新 Gallery 新建应用会话，等待其余加载结束。
2. 预期 59 profiles loaded、1 failed #004，已成功卡片保留、筛选禁用，不把 Fire 结果误报为零。
3. 关闭阻断，用 Tab 到 Retry failed profiles 并按 Enter：预期只补发 #004，恢复 60 项和筛选，焦点仍在 Gallery 主标题；原先 Fire 条件恢复为 7。
4. 可进一步阻断 `*pokeapi.co/api/v2/*` 后刷新：明确目录错误；点击 Use sample data 应可读取 localhost 的实际六项。解除阻断可切回 live。
5. 检查完删除/关闭阻断规则。样例图仍需网络；内存缓存不跨刷新。无需向真实服务制造 429 或超时。

在 mp2 目录依次运行最终检查：

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

预期全部成功，**41 passed / 4 files**，build 输出 **Generated 62 static route entries and a 404 entry**，并有 `dist/data/pokemon-sample.json`。
若希望检查构建 UI，可运行 `npm run preview`，打开其显示的 `/mp2/` 地址；preview 成功不能替代第 5 轮实际 Pages 深链接验收。

## 本轮证据与下一轮边界

1440px 最终真实 API 三页完整截图，已实际检查：

- [List](docs/qa/list.jpg)
- [Gallery](docs/qa/gallery.jpg)
- [Detail](docs/qa/detail.jpg)

本轮完成后关闭临时 4174/4175 测试服务和临时标签，保留用户的 5173 开发服务。
第 5 轮仍负责最终 Git 提交/推送、Actions/Pages、线上资源和直达刷新、≤3 分钟演示视频及权限、聊天记录最终检查点和课程 LLM survey/表单。
