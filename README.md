# FocusFlow 🎯

> **Aviso Acadêmico:** Este é um projeto desenvolvido para a disciplina de **Engenharia de Software e IA**, construído com a ajuda do **Google AI Studio**.

**FocusFlow** é um sistema moderno e minimalista ("SaaS-like") de gerenciamento de tempo e tarefas. Desenhado para maximizar a produtividade mantendo uma interface limpa (Geometric Balance), o aplicativo ajuda você a acompanhar atividades, visualizar estimativas de tempo e focar no que realmente importa.

## ✨ Funcionalidades

- **Autenticação Segura:** Login, cadastro e recuperação de senha gerenciados pelo Supabase Auth.
- **Gestão de Tarefas (CRUD):** Crie, visualize, edite e exclua tarefas.
- **Campos Detalhados:** Organize tarefas por categorias, prioridade (Baixa, Média, Alta), status e tempo estimado de conclusão.
- **Dashboard e Analytics:** Obtenha uma visão geral das tarefas ativas, concluídas e do esforço de tempo total estimado.
- **Row Level Security (RLS):** Seus dados são privados e seguros; você só tem acesso às suas próprias tarefas e dados.
- **Interface Responsiva & Tema Dark:** Design robusto e moderno utilizando Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Roteamento:** React Router DOM (v6)
- **Estilização:** Tailwind CSS v4, Lucide React (ícones), date-fns
- **Backend & Database:** Supabase (PostgreSQL, Auth, RLS)

## 📂 Estrutura do Projeto

```text
src/
├── components/   # Componentes da UI (se aplicável)
├── contexts/     # Context API (AuthContext)
├── layouts/      # Estruturas de layout (MainLayout com sidebar e navbar)
├── lib/          # Configurações de bibliotecas externas (supabase.ts)
├── pages/        # Páginas da aplicação (Dashboard, Login, Register, etc.)
├── types/        # Definições de tipos do TypeScript
├── index.css     # Estilos globais e configuração central do Tailwind
├── App.tsx       # Configuração principal e rotas
└── main.tsx      # Entry-point do React
```

## 🚀 Como Instalar e Rodar Localmente

1. Faça o clone do repositório:
   ```bash
   git clone <url-do-repositorio>
   cd focus-flow
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Para iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   > Acesse `http://localhost:3000` (ou a porta indicada no terminal)

## 🗄️ Configuração do Supabase (Banco de Dados + Auth)

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto.
2. Na sua tela de configuração de banco de dados, vá no painel de **SQL Editor**.
3. Copie o conteúdo do arquivo `schema.sql` (incluso na raiz do projeto) e rode a query. Isso criará as tabelas e políticas de segurança RLS (Row Level Security).
4. No painel do Supabase, vá em **Project Settings > API** para obter suas credenciais.

## 🔑 Configuração do Ambiente `.env`

1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Abra o `.env` e adicione as chaves que você copiou do Supabase:
   ```env
   VITE_SUPABASE_URL="https://sua-url-do-projeto.supabase.co"
   VITE_SUPABASE_ANON_KEY="sua-chave-anon-public"
   ```

## 🌐 Como Fazer Deploy na Vercel

1. Suba este repositório para o seu GitHub.
2. Acesse a [Vercel](https://vercel.com) e adicione um **New Project**.
3. Importe o repositório do FocusFlow.
4. O framework **Vite** deve ser detectado automaticamente (Build: `npm run build`, Output: `dist`).
5. Em **Environment Variables**, adicione as suas chaves do banco de produção:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Clique em **Deploy**! A sua aplicação estará ao vivo.
