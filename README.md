# Frontend — Cadastro de Moradores

SPA em React + Vite que digitaliza a ficha "Cadastro de Morador" do Condomínio Porto Imperial.

## Executando

```bash
cp .env.example .env    # aponta para a API (VITE_API_BASE_URL)
npm install
npm run dev             # http://localhost:5173
```

A API precisa estar rodando e com a origem do Vite liberada em `CORS_ORIGINS`.

## Scripts

| Comando             | Descrição                          |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento        |
| `npm run build`     | Type-check e build de produção     |
| `npm run preview`   | Serve o build gerado               |
| `npm run lint`      | oxlint                             |
| `npm run typecheck` | Apenas a checagem de tipos         |

## Estrutura

```
src/
├── app/
│   ├── providers/      React Query, ConfigProvider (pt-BR), tema e estilos globais
│   └── router/         Rotas com carregamento sob demanda das páginas
├── features/residents/
│   ├── api/            Chamadas HTTP do recurso
│   ├── hooks/          Queries e mutations do TanStack Query
│   ├── model/          Tipos do contrato, tipos do formulário e o mapper entre eles
│   ├── components/     ResidentForm e suas seções
│   └── pages/          Formulário e listagem
├── shared/
│   ├── api/            Instância do Axios e normalização de erros
│   ├── components/     Layout, cabeçalho de página, seções e blocos repetíveis
│   └── utils/          Máscaras, validadores brasileiros e regras de formulário
└── styles/             Design tokens, tema do Ant Design e estilos globais
```

## Organização

- **Feature-first.** Tudo que pertence a moradores fica em `features/residents`; `shared/` só recebe
  o que é realmente reaproveitável.
- **Seções isoladas.** Cada bloco da ficha impressa é um componente próprio dentro de
  `ResidentForm/sections`, o que mantém o formulário legível apesar do tamanho.
- **Listas dinâmicas com um componente só.** `RepeatableFields` encapsula o `Form.List` do Ant
  Design e padroniza adicionar/remover em moradores, funcionários, veículos e animais.
- **Máscaras no formulário, dados limpos na API.** Os campos guardam o valor formatado (CPF,
  telefone, placa) e o `residentFormMapper` converte para o formato do backend na hora do envio,
  fazendo o caminho inverso ao carregar um cadastro para edição.
- **Validação espelhada.** `shared/utils/brazilian-validators.ts` repete as regras do servidor para
  dar retorno imediato ao usuário; o backend continua sendo a fonte da verdade.
- **Estilo em duas frentes.** Ant Design cuida dos componentes e styled-components do layout, ambos
  alimentados pelos mesmos tokens em `styles/theme.ts`.

## Rotas

| Rota              | Tela                                  |
| ----------------- | ------------------------------------- |
| `/cadastro`       | Novo cadastro (público)               |
| `/login`          | Entrada com e-mail e senha            |
| `/moradores`      | Listagem (exige autenticação)         |
| `/moradores/:id`  | Edição de um cadastro (exige autenticação) |

A área de moradores fica atrás de `ProtectedRoute`: sem sessão válida o usuário é enviado
para `/login`, e o token JWT é anexado automaticamente às requisições pelo cliente HTTP.
