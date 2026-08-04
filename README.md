# Frontend — CondoGest

SPA React + Vite para gestão multi-condomínio: painel do gestor, formulário público de
moradores, hub/linktree, documentos e reservas de áreas comuns.

## Executando

```bash
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173` · API esperada em `VITE_API_BASE_URL` (padrão `http://localhost:3333/api`).

## Rotas

| Rota | Acesso |
| ---- | ------ |
| `/registro`, `/login` | Público |
| `/app`, `/app/condominios/*` | Gestor autenticado |
| `/c/:slug` | Hub público (contatos + atalhos) |
| `/c/:slug/cadastro` | Formulário de morador |
| `/c/:slug/documentos` | Documentos públicos |
| `/c/:slug/reservas` | Reservas (morador autenticado + conta vinculada) |
| `/cadastro` | Redirect legado → `/c/porto-imperial/cadastro` |

## Estrutura

```
src/
├── app/                 Router e providers
├── features/
│   ├── auth/
│   ├── condominiums/    Lista, criar, hub público, ManagerLayout
│   ├── residents/
│   ├── finance/
│   ├── common-areas/
│   ├── documents/
│   └── directory/
├── shared/              Layout, API client, máscaras, privacy
└── styles/
```

## Scripts

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Vite |
| `npm run build` | Type-check + build |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | oxlint |
