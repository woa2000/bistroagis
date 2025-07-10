# ✅ Checklist de Deploy - Bistro AGIS

## 📋 Pré-Deploy (Configure antes de fazer deploy)

### 1. 🗄️ Banco de Dados
- [ ] Criar conta em um provedor (Neon, Supabase, PlanetScale)
- [ ] Criar banco PostgreSQL
- [ ] Obter URL de conexão
- [ ] Testar conexão localmente

### 2. 🔐 Variáveis de Ambiente
- [ ] Gerar SESSION_SECRET: `openssl rand -base64 32`
- [ ] Ter DATABASE_URL pronta
- [ ] Anotar as variáveis em local seguro

### 3. 📁 Código
- [ ] Código commitado no Git
- [ ] Repositório público no GitHub/GitLab/Bitbucket
- [ ] Build funcionando: `npm run build`

## 🚀 Deploy no Vercel

### 4. 🔗 Conectar Projeto
- [ ] Acessar [vercel.com](https://vercel.com)
- [ ] Clicar em "New Project"
- [ ] Conectar repositório
- [ ] Selecionar projeto `bistroagis`

### 5. ⚙️ Configurar Build
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist/public`
- [ ] **Install Command**: `npm install`

### 6. 🔐 Configurar Variáveis
No dashboard do Vercel > Settings > Environment Variables:
- [ ] `DATABASE_URL` = sua_url_do_banco
- [ ] `SESSION_SECRET` = sua_chave_gerada
- [ ] `NODE_ENV` = production

### 7. 🌐 Deploy
- [ ] Clicar em "Deploy"
- [ ] Aguardar build finalizar
- [ ] Verificar logs se houver erro

## 🔍 Pós-Deploy

### 8. ✅ Verificações
- [ ] Site carrega sem erro 404
- [ ] Página de login aparece
- [ ] Console do browser sem erros
- [ ] APIs funcionando: `/api/auth/user`

### 9. 🗄️ Configurar Banco
Executar localmente:
```bash
npm run db:push
```

### 10. 🧪 Testes
- [ ] Criar conta de teste
- [ ] Fazer login
- [ ] Navegar pelas páginas
- [ ] Testar funcionalidades básicas

## 🚨 Solução de Problemas

### Erro 404
- [ ] Verificar Output Directory: `dist/public`
- [ ] Verificar build finalizado com sucesso
- [ ] Force redeploy no dashboard

### APIs não funcionam
- [ ] Verificar variáveis de ambiente
- [ ] Testar rota API diretamente
- [ ] Verificar logs do Vercel

### Banco não conecta
- [ ] Verificar DATABASE_URL
- [ ] Testar conexão localmente
- [ ] Executar `npm run db:push`

---
**✨ Seguindo este checklist, seu deploy será bem-sucedido!**
