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
- **Mobile em primeiro lugar.** Os mesmos breakpoints servem ao CSS (`theme.media`) e ao
  comportamento em JavaScript (`queries` + `useMediaQuery`), então a tabela de moradores, a barra de
  ações e o cabeçalho mudam juntos. Campos ficam com 16px no celular para o iOS não dar zoom ao focar,
  e os campos numéricos (RG, CPF e telefones) declaram `inputMode` para o celular já abrir o teclado
  numérico.
- **Dados fixos do condomínio em um lugar só.** `model/condo.ts` guarda as 68 unidades e a data de
  entrega do prédio. As unidades alimentam um `Select` agrupado por andar, então o morador não
  consegue digitar um apartamento inexistente, e a data de entrega vira o atalho "Desde a entrega do
  prédio" em "Quando mudou-se" — a caixa apenas reflete a data, sem virar mais um campo do cadastro. A
  área restrita mostra em `ResidentsSummary` quantas unidades já responderam e quantas pessoas foram
  declaradas, com os números vindos de `GET /residents/summary`. O card de formulários preenchidos
  abre o `PendingUnitsModal`, que lista por andar exatamente quais apartamentos ainda faltam — a
  mesma resposta do resumo, sem nova requisição.
- **Assinatura no canvas.** `SignatureCanvas` desenha com eventos de ponteiro (dedo ou mouse), suaviza o
  traço por curvas entre pontos médios e exporta o resultado em base64. `shared/utils/signature-image.ts`
  escolhe a versão mais nítida que caiba no limite aceito pela API, reduzindo a imagem só se precisar —
  o morador nunca vê esse ajuste. O botão "Tela cheia" reabre o mesmo canvas em um `<dialog>` que ocupa
  a tela inteira (`SignatureFullscreen`), onde o traço só volta ao formulário se for confirmado.
- **PDF gerado no servidor.** O botão "Baixar PDF" da listagem envia os filtros aplicados para
  `GET /residents/report` e entrega o arquivo ao navegador (`shared/utils/download-file.ts`), usando o
  nome sugerido pela API. O documento em si é montado no backend, então o navegador não carrega
  nenhuma biblioteca de PDF.

## Rotas

| Rota              | Tela                                  |
| ----------------- | ------------------------------------- |
| `/cadastro`       | Novo cadastro (público)               |
| `/login`          | Entrada em duas etapas (senha + código por e-mail) |
| `/moradores`      | Listagem (exige autenticação)         |
| `/moradores/:id`  | Edição de um cadastro (exige autenticação) |

A área de moradores fica atrás de `ProtectedRoute`: sem sessão válida o usuário é enviado
para `/login`, e o token JWT é anexado automaticamente às requisições pelo cliente HTTP.

O login tem duas etapas na mesma tela. A primeira só devolve um `challengeId` — nenhuma sessão é
criada — e a segunda (`LoginCodeStep`) pede o código de seis dígitos enviado por e-mail, lembrando
de conferir a caixa de spam. A tela mostra o tempo restante do código e libera o reenvio depois de
60 segundos. Quando a API responde `410`, a tentativa acabou (código expirado, já usado ou
tentativas esgotadas) e a tela volta sozinha para a primeira etapa com o motivo; `401` é apenas
código incorreto, e a pessoa continua onde está.

## Privacidade

Os textos de privacidade vivem em `shared/privacy/`, separados por plateia: `privacy-notice.ts` fala
com o morador que assina e `operator-duties.ts` com quem opera a área restrita. Cada frase tem uma
origem só, então mudar o aviso vale para o formulário, o rodapé e o alerta interno de uma vez.

- **Aviso de privacidade** (`PrivacyNoticeLink`) abre em diálogo, sem tirar o morador do formulário.
  Aparece no rodapé de todas as telas e junto do consentimento. O canal do titular vem de
  `VITE_PRIVACY_CONTACT`; sem valor, o texto orienta procurar a administração.
- **Termo de responsabilidade** (`OperatorTermsGate`) barra a área restrita a cada sessão: enquanto
  não é aceito, nada é renderizado por baixo do diálogo e nenhum dado pessoal é buscado. O aceite
  fica em `sessionStorage`, por usuário, para ser pedido de novo no próximo acesso. Se a conta ainda
  não tem CPF, o mesmo diálogo o exige antes de liberar a área — o botão de aceite só conclui depois
  que `PUT /auth/me/cpf` responde, e a sessão é reescrita com o operador já identificado.
- **`DataProtectionNotice`** mantém à vista, na listagem e na edição, que aqueles dados são pessoais
  e que os acessos ficam registrados; a exportação do PDF ainda pede uma confirmação explícita.
- A listagem recebe `ResidentListItem` — o cadastro sem a assinatura, que a tabela não usa. Nenhum
  dado de morador é gravado no navegador: só a sessão fica em `localStorage`.
