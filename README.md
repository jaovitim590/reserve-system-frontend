# Reserve System Frontend

Frontend do **Reserve System**, uma aplicação web de reservas de hotel criada com **React**, **TypeScript**, **Vite**, **Material UI**, **Tailwind CSS**, **React Hook Form**, **Zod**, **Axios** e **Chart.js**.

A aplicação permite que usuários naveguem por quartos, criem uma conta, façam login, consultem disponibilidade, realizem reservas, acompanhem suas reservas e gerenciem o perfil. Também possui uma área de dashboard administrativa para visualizar métricas, receita, ocupação, reservas recentes e ranking de quartos.

---

## Sumário

- [Visão geral](#visão-geral)
- [Principais funcionalidades](#principais-funcionalidades)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Execução em desenvolvimento](#execução-em-desenvolvimento)
- [Build de produção](#build-de-produção)
- [Preview da build](#preview-da-build)
- [Scripts disponíveis](#scripts-disponíveis)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Integração com API](#integração-com-api)
- [Autenticação](#autenticação)
- [Dashboard administrativa](#dashboard-administrativa)
- [Formulários e validação](#formulários-e-validação)
- [Tema e estilos](#tema-e-estilos)
- [Fluxo principal de uso](#fluxo-principal-de-uso)
- [Como criar novas telas e funcionalidades](#como-criar-novas-telas-e-funcionalidades)
- [Qualidade de código](#qualidade-de-código)
- [Problemas conhecidos](#problemas-conhecidos)
- [Deploy](#deploy)

---

## Visão geral

O projeto é um SPA (*Single Page Application*) para um sistema de reservas hoteleiras. Ele utiliza o **React Router** para navegação, **Material UI** para interface, **Axios** para comunicação HTTP e **localStorage** para persistir o token JWT retornado pelo backend.

A URL base atual do backend está configurada diretamente no serviço Axios:

```ts
https://reserve-system-backend.onrender.com
```

A API administrativa usa o mesmo host com o prefixo `/admin`.

---

## Principais funcionalidades

### Área pública

- Página inicial com apresentação do hotel.
- Página de quartos disponíveis.
- Página de contato com formulário validado.
- Cadastro de usuário.
- Login de usuário.

### Área autenticada

- Perfil do usuário.
- Atualização do nome do perfil.
- Exclusão de conta.
- Reserva de quartos.
- Verificação de disponibilidade por período.
- Listagem de reservas do usuário.
- Cancelamento de reservas.

### Área administrativa

- Dashboard com KPIs gerais.
- Cards de usuários, quartos, reservas, receita ativa, reservas ativas e canceladas.
- Gráfico de situação das reservas.
- Gráfico de ocupação geral.
- Consulta de receita por período.
- Gráfico de distribuição por tipo de quarto.
- Ranking dos quartos mais reservados.
- Tabela de reservas recentes.

---

## Tecnologias utilizadas

### Core

- **React 19** — construção da interface.
- **TypeScript** — tipagem estática.
- **Vite** — servidor de desenvolvimento e build.
- **React Router DOM 7** — roteamento da SPA.

### UI e estilos

- **Material UI 7** — componentes visuais.
- **MUI Icons** — ícones da interface.
- **Emotion** — engine de estilos usada pelo MUI.
- **Tailwind CSS 4** — utilitários CSS globais.

### Formulários e validação

- **React Hook Form** — gerenciamento de formulários.
- **Zod** — validação de schemas.
- **@hookform/resolvers** — integração entre React Hook Form e Zod.

### Dados e gráficos

- **Axios** — cliente HTTP.
- **Chart.js** — renderização dos gráficos.
- **react-chartjs-2** — integração do Chart.js com React.

### Feedback visual

- **Sonner** — toaster global para notificações.

### Qualidade

- **ESLint 9** — lint do projeto.
- **typescript-eslint** — regras TypeScript para ESLint.

---

## Estrutura do projeto

```txt
reserve-system-frontend/
├── public/
│   └── hotel.png
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── StatCard.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── TopButton.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── quartos/
│   │   │   ├── QuartoCard.tsx
│   │   │   └── QuartoGrid.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FormInput.tsx
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── AuthProvider.tsx
│   ├── lib/
│   │   ├── api_url.tsx
│   │   ├── randomImg.ts
│   │   ├── role.ts
│   │   └── token.tsx
│   ├── pages/
│   │   ├── Contato.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── MyReservas.tsx
│   │   ├── Perfil.tsx
│   │   ├── Quartos.tsx
│   │   ├── Register.tsx
│   │   └── Reservar.tsx
│   ├── schemas/
│   │   ├── loginSchema.ts
│   │   └── registerSchema.ts
│   ├── services/
│   │   ├── adminService.tsx
│   │   ├── api.tsx
│   │   ├── authService.tsx
│   │   ├── quartoService.tsx
│   │   ├── reservaService.tsx
│   │   └── userService.tsx
│   ├── theme/
│   │   ├── ThemeContext.tsx
│   │   └── theme.tsx
│   ├── index.css
│   ├── main.tsx
│   └── routes.tsx
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── eslint.config.js
```

---

## Pré-requisitos

Antes de começar, tenha instalado:

- **Node.js** em versão compatível com Vite 7.
  - Recomendado: Node.js 20 ou superior.
- **npm**.
- Acesso ao backend configurado em `src/services/api.tsx`.

Verifique as versões com:

```bash
node --version
npm --version
```

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd reserve-system-frontend
npm install
```

Se você já está com o repositório clonado, basta executar:

```bash
npm install
```

---

## Execução em desenvolvimento

Inicie o servidor local do Vite:

```bash
npm run dev
```

Por padrão, o Vite exibirá uma URL parecida com:

```txt
http://localhost:5173/
```

Abra essa URL no navegador para usar a aplicação.

Para expor a aplicação na rede local, use:

```bash
npm run dev -- --host 0.0.0.0
```

---

## Build de produção

Para gerar os arquivos otimizados de produção:

```bash
npm run build
```

O comando executa:

1. `tsc -b` para validação TypeScript.
2. `vite build` para gerar a build final.

A saída final fica em:

```txt
dist/
```

---

## Preview da build

Depois de executar o build, rode:

```bash
npm run preview
```

Esse comando serve a pasta `dist/` localmente para validação da versão de produção.

---

## Scripts disponíveis

| Script | Comando | Descrição |
| --- | --- | --- |
| Desenvolvimento | `npm run dev` | Inicia o Vite em modo desenvolvimento. |
| Build | `npm run build` | Valida TypeScript e gera build de produção. |
| Lint | `npm run lint` | Executa ESLint no projeto. |
| Preview | `npm run preview` | Serve localmente a build gerada. |

---

## Rotas da aplicação

As rotas ficam centralizadas em `src/routes.tsx`.

| Rota | Protegida | Descrição |
| --- | --- | --- |
| `/` | Não | Página inicial. |
| `/quartos` | Não | Listagem de quartos. |
| `/register` | Não | Cadastro de usuário. |
| `/login` | Não | Login. |
| `/contato` | Não | Página de contato. |
| `/perfil` | Sim | Perfil do usuário autenticado. |
| `/quartos/:id/reservar` | Sim | Reserva de um quarto específico. |
| `/reservas` | Sim | Reservas do usuário autenticado. |
| `/dashboard` | Sim | Dashboard administrativa. |

As rotas protegidas passam pelo componente `ProtectedRoute`, que verifica se existe token no contexto de autenticação.

---

## Integração com API

A configuração principal do Axios está em `src/services/api.tsx`.

```ts
export const api = axios.create({
  baseURL: "https://reserve-system-backend.onrender.com",
});

export const adminApi = axios.create({
  baseURL: "https://reserve-system-backend.onrender.com/admin",
});
```

### Serviços existentes

| Arquivo | Responsabilidade |
| --- | --- |
| `src/services/authService.tsx` | Login, cadastro e busca do usuário autenticado. |
| `src/services/userService.tsx` | Perfil, atualização e exclusão de conta. |
| `src/services/quartoService.tsx` | Listagem, detalhe e disponibilidade de quartos. |
| `src/services/reservaService.tsx` | Criação, listagem e cancelamento de reservas. |
| `src/services/adminService.tsx` | Métricas administrativas, receita, quartos e reservas recentes. |

### Endpoints usados pelo frontend

#### Autenticação

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

#### Usuário

- `GET /api/user/perfil`
- `PUT /api/user/perfil`
- `DELETE /api/user/perfil`

#### Quartos

- `GET /api/quarto`
- `GET /api/quarto/:id`
- `GET /api/quarto/:id/disponibilidade`

#### Reservas

- `POST /api/reserva`
- `GET /api/reserva/minhas`
- `PUT /api/reserva/:id/cancelar`

#### Administração

- `GET /admin/stats`
- `GET /admin/receita`
- `GET /admin/receita/periodo`
- `GET /admin/quarto`
- `GET /admin/quarto/stats`
- `GET /admin/quarto/mais-reservados`
- `GET /admin/reserva`

---

## Autenticação

A autenticação é feita com token JWT persistido no `localStorage`.

A chave usada para armazenar o token é:

```ts
RESERVE_SYSTEM:TOKEN
```

O fluxo principal é:

1. Usuário envia e-mail e senha na tela de login.
2. `authService.signIn` chama `POST /api/auth/login`.
3. O token retornado é salvo no `localStorage` pelo `AuthProvider`.
4. O frontend chama `authService.getUser` para obter os dados do usuário autenticado.
5. Rotas protegidas validam o token antes de renderizar o conteúdo.

---

## Dashboard administrativa

A dashboard fica em:

```txt
src/components/Dashboard.tsx
```

Ela usa dados de `src/services/adminService.tsx` e renderiza uma visão administrativa com Material UI e Chart.js.

### Dados carregados

- Total de usuários.
- Total de reservas.
- Total de quartos.
- Reservas ativas.
- Reservas canceladas.
- Taxa de ocupação.
- Receita ativa e cancelada.
- Receita por período.
- Quartos disponíveis e ocupados.
- Quartos mais reservados.
- Reservas recentes.
- Distribuição de quartos por tipo.

### Componentes visuais

- Cards de KPI com `StatCard`.
- Gráficos de barras com `Bar`.
- Gráfico circular com `Doughnut`.
- Tabela de reservas recentes.
- Chips coloridos por status.
- Botão de atualização manual.
- Filtros de data para receita por período.

---

## Formulários e validação

O projeto usa `react-hook-form` para estado dos formulários e `zod` para regras de validação.

Schemas atuais:

- `src/schemas/loginSchema.ts`
- `src/schemas/registerSchema.ts`

Outras telas também definem schemas locais, como reserva e contato.

O componente `FormInput` centraliza campos de formulário integrados ao `react-hook-form`.

---

## Tema e estilos

O tema principal está em:

```txt
src/theme/theme.tsx
```

Ele define:

- Paleta clara e escura.
- Cores primária e secundária.
- Tipografia padrão.
- Bordas arredondadas.
- Overrides globais para botões e cards do Material UI.

O arquivo `src/main.tsx` registra o `ThemeProvider`, `CssBaseline`, `AuthProvider`, `RouterProvider` e o `Toaster`.

O CSS global está em:

```txt
src/index.css
```

---

## Fluxo principal de uso

### Usuário comum

1. Acessa `/register` para criar uma conta.
2. Acessa `/login` para autenticar.
3. Navega até `/quartos` para consultar quartos.
4. Abre `/quartos/:id/reservar` para escolher datas.
5. Verifica disponibilidade.
6. Confirma a reserva.
7. Acompanha reservas em `/reservas`.
8. Pode cancelar reservas existentes.
9. Gerencia dados em `/perfil`.

### Administrador

1. Faz login com uma conta que tenha permissão administrativa no backend.
2. Acessa `/dashboard`.
3. Consulta indicadores gerais, receita, ocupação e reservas recentes.
4. Ajusta o período de receita para análise financeira.

> Observação: a rota `/dashboard` está protegida por autenticação, mas a validação fina de papel/permissão depende do backend e da regra de negócio implementada no projeto.

---

## Como criar novas telas e funcionalidades

### 1. Criar uma página

Crie um arquivo dentro de `src/pages`:

```txt
src/pages/NovaPagina.tsx
```

Exemplo:

```tsx
export const NovaPagina = () => {
  return <div>Minha nova página</div>;
};
```

### 2. Registrar a rota

Adicione a página em `src/routes.tsx`:

```tsx
import { NovaPagina } from "./pages/NovaPagina";

// ...
{ path: "nova", Component: NovaPagina }
```

Para uma rota autenticada, coloque dentro do bloco que usa `ProtectedRoute`.

### 3. Criar um serviço de API

Crie ou atualize um arquivo em `src/services`:

```tsx
import { api } from "./api";

export async function buscarDados() {
  const res = await api.get("/minha-rota");
  return res.data;
}
```

Se a rota exigir autenticação, envie o token no header `Authorization`.

### 4. Criar validações

Para formulários reutilizáveis, crie schemas em `src/schemas` usando Zod:

```ts
import { z } from "zod";

export const exemploSchema = z.object({
  nome: z.string().min(2),
});
```

### 5. Criar componentes reutilizáveis

Componentes compartilhados devem ficar em `src/components`. Se forem específicos de um domínio, use subpastas como:

```txt
src/components/quartos/
src/components/dashboard/
src/components/layout/
```

---

## Qualidade de código

Execute o lint antes de abrir PRs:

```bash
npm run lint
```

Execute a build para validar TypeScript e empacotamento:

```bash
npm run build
```

Recomendações:

- Use tipos explícitos para respostas da API.
- Centralize chamadas HTTP em `src/services`.
- Mantenha componentes pequenos e reutilizáveis.
- Evite duplicar regras de formulário; prefira schemas Zod.
- Não armazene segredos no frontend.
- Revise mensagens de erro e loading states para melhorar UX.

---

## Problemas conhecidos

No estado atual do projeto, pode haver falha no `npm run build` por inconsistência de tipagem em `src/components/quartos/QuartoGrid.tsx`, onde um objeto passado para `QuartoCard` não inclui a propriedade obrigatória `valor`.

Mensagem observada:

```txt
Property 'valor' is missing in type '{ id: number; nome: string; descricao: string; tipo: string; status: string; image: string; }' but required in type 'QuartoProps'.
```

Para corrigir, garanta que todos os objetos usados como `QuartoProps` incluam `valor`.

---

## Deploy

A aplicação é uma SPA Vite. Para deploy em serviços como Vercel, Netlify ou Render Static Site:

1. Configure o comando de instalação:

```bash
npm install
```

2. Configure o comando de build:

```bash
npm run build
```

3. Configure a pasta de publicação:

```txt
dist
```

4. Garanta que o backend permita requisições CORS a partir do domínio do frontend.

---

## Observações finais

Este README foi escrito com base na estrutura atual do projeto, incluindo rotas, serviços, dependências e fluxos implementados no código-fonte. Caso o backend mude endpoints, autenticação ou formato das respostas, atualize também os serviços em `src/services` e esta documentação.
