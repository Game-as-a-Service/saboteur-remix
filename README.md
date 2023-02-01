# 矮人礦坑

- [staging](https://saboteur-staging.fly.dev/)
- [production](https://saboteur.fly.dev/)

## 遊戲介紹

辛勤的小矮人們在礦坑中賣力地工作，期望能夠挖到金礦。
然而他們當中卻混入了幾個想獨吞礦藏的壞蛋，不斷趁人不注意時暗自破壞。
假如好人們成功的開闢一條通往寶藏的隧道，他們可以得到金塊，而妨礙者則落得兩手空空。
然而，假如好人們失敗了，那麼妨礙者就能夠得到金塊。
到底鹿死誰手，這就要各憑本事了。

### References

1. https://www.amigo.games/content/ap/rule/18750-ur.pdf
1. https://en.wikipedia.org/wiki/Saboteur_(card_game)

## 技術採用

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [SQLite Database](https://sqlite.org)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## 開發

### 快速開始

點擊以下按鈕，我們幫你準備好了 [Gitpod](https://gitpod.io) 工作區，裡面已經預先做好專案配置。

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/remix-run/indie-stack/tree/main)

### 本地端開發

- 下載依賴：

```sh
npm install
```

- 配置專案設定：

```sh
npm run setup
```

- 開啟開發伺服器：

```sh
npm run dev
```

該指令使用 development mode 開啟應用程式，只要有檔案異動會自動刷新到畫面。

### 型別檢查

此專案使用 TypeScript。
若要運行整個專案的型別檢查，請下 `npm run typecheck`。

### 靜態檢查

此專案使用 ESLint 做靜態檢查。配置在 `.eslintrc.js`。

### 自動排版

我們使用 [Prettier](https://prettier.io/) 來自動排版原始碼。
建議搭配編輯器插件在儲存時自動進行排版。 (像是 [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode))
也可以透過 `npm run format` 對整個專案進行排版。
