# 🍽️ Bistro AGIS

Sistema de gerenciamento de reuniões e eventos para feiras e exposições.

## 🚀 Deploy no Vercel - Guia Completo

### 📋 Pré-requisitos

1. **Conta no Vercel** - [vercel.com](https://vercel.com)
2. **Repositório Git** - GitHub, GitLab ou Bitbucket
3. **Banco de dados** - Recomendado: [Neon](https://neon.tech), [PlanetScale](https://planetscale.com), ou [Supabase](https://supabase.com)

### 🔧 Configuração do Banco de Dados

1. **Crie um banco PostgreSQL** (recomendado: Neon.tech)
2. **Obtenha a URL de conexão** no formato:
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

### 📤 Deploy no Vercel

#### Passo 1: Conectar Repositório
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"New Project"**
3. Conecte seu repositório Git
4. Selecione o repositório `bistroagis`

#### Passo 2: Configurar Variáveis de Ambiente
No dashboard do Vercel, na seção **Environment Variables**, adicione:

```bash
DATABASE_URL=sua_url_do_banco_de_dados_aqui
SESSION_SECRET=uma_string_super_secreta_aleatoria_aqui
NODE_ENV=production
```

**💡 Dica**: Gere uma SESSION_SECRET segura usando:
```bash
openssl rand -base64 32
```

#### Passo 3: Deploy Automático
- O Vercel detectará automaticamente a configuração
- O build será executado usando `npm run build`
- A aplicação será publicada automaticamente

#### Passo 4: Configurar Banco de Dados
Após o primeiro deploy, configure o banco:
```bash
npm run db:push
```

### 🏠 Desenvolvimento Local

#### Configuração Inicial
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd bistroagis

# Instale dependências
npm install

# Configure ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

#### Executar Localmente
```bash
npm run dev
```
Aplicação disponível em: `http://localhost:3000`

### 📁 Estrutura do Projeto

```
bistroagis/
├── 📁 api/                 # Serverless functions (Vercel)
├── 📁 client/             # Frontend React + Vite
│   ├── 📁 src/
│   │   ├── 📁 components/ # Componentes React
│   │   ├── 📁 pages/      # Páginas da aplicação
│   │   ├── 📁 hooks/      # React hooks customizados
│   │   └── 📁 lib/        # Utilitários e configurações
├── 📁 server/             # Backend Express (dev local)
├── 📁 shared/             # Tipos e esquemas compartilhados
├── 📄 vercel.json         # Configuração do Vercel
└── 📄 package.json        # Dependências e scripts
```

### 🛠️ Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Desenvolvimento local |
| `npm run build` | Build para produção |
| `npm run start` | Executa versão de produção |
| `npm run check` | Verificação TypeScript |
| `npm run db:push` | Atualiza schema do banco |

### 🗄️ Configuração do Banco

O projeto usa **Drizzle ORM** com PostgreSQL:

1. Configure `DATABASE_URL` no `.env`
2. Execute `npm run db:push` para criar tabelas
3. O schema está definido em `shared/schema.ts`

### 🔐 Autenticação

- Sistema de login com email/senha
- Sessões gerenciadas via tokens
- Tipos de usuário: `admin`, `fabricante`, `revendedor`

### 📊 Funcionalidades

- ✅ **Dashboard** - Visão geral das atividades
- ✅ **Reuniões** - Agendamento e gerenciamento
- ✅ **Participantes** - Cadastro de usuários
- ✅ **Solicitações** - Sistema de aprovação
- ✅ **Analytics** - Relatórios e estatísticas
- ✅ **Perfil** - Gerenciamento de conta

### 🔧 Solução de Problemas

#### Erro "Port 5000 in use"
```bash
# O projeto agora usa PORT=3000 por padrão
# Configurável via variável de ambiente PORT
```

#### Problemas de Build
```bash
# Limpar cache e reinstalar
rm -rf node_modules dist
npm install
npm run build
```

#### Problemas de Banco
```bash
# Verificar conexão
npm run db:push
```

### 🌐 Domínio Personalizado

Após o deploy:
1. Acesse o dashboard do Vercel
2. Vá em **Settings > Domains**
3. Adicione seu domínio personalizado
4. Configure DNS conforme instruções

### 📈 Monitoramento

- **Analytics**: Vercel Analytics automático
- **Logs**: Disponíveis no dashboard do Vercel
- **Performance**: Métricas em tempo real

### 🆘 Suporte

Para problemas ou dúvidas:
- Abra uma **issue** no repositório
- Consulte a documentação do [Vercel](https://vercel.com/docs)
- Verifique os logs no dashboard do Vercel

---

**✨ Projeto configurado e pronto para deploy!**
