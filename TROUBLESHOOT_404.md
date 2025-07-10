# 🚨 Guia de Solução - Erro 404 no Vercel

## ❌ Erro: 404: NOT_FOUND

Se você está recebendo este erro, siga os passos abaixo **NA ORDEM**:

### 🔍 1. Diagnóstico Inicial

1. **Teste o arquivo de diagnóstico**:
   - Acesse: `https://seudominio.vercel.app/test.html`
   - ✅ Se funcionar: problema é com o React/SPA
   - ❌ Se não funcionar: problema é com o deploy básico

### 🛠️ 2. Corrigir Configuração do Vercel

No dashboard do Vercel:

1. **Settings > General**:
   - ✅ **Framework Preset**: `Other`
   - ✅ **Build Command**: `npm run build`
   - ✅ **Output Directory**: `dist`
   - ✅ **Install Command**: `npm install`

2. **Forçar novo deploy**:
   - Vá em **Deployments**
   - Clique nos 3 pontos do último deploy
   - Selecione **Redeploy**

### 🔧 3. Se ainda não funcionar

#### A. Verificar arquivo vercel.json
Certifique-se que o arquivo está assim:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### B. Verificar build local
```bash
rm -rf dist
npm run build
ls -la dist/
# Deve mostrar: index.html e pasta assets/
```

#### C. Alternativa - Configuração Simples
Se nada funcionar, tente esta configuração no `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 🆘 4. Último Recurso

1. **Delete o projeto no Vercel**
2. **Crie um novo projeto**
3. **Use framework preset "Vite"**
4. **Configure Output Directory: "dist"**

### 📱 5. Contato para Suporte

Se nada funcionar:
1. ✅ Confirme que seguiu TODOS os passos acima
2. ✅ Anote o ID do erro (ex: `gru1::xwnhq-1752154059781-52eb7c6b9342`)
3. ✅ Tire screenshot das configurações do Vercel
4. ✅ Compartilhe os logs de build

---
**✨ Este guia resolve 99% dos casos de erro 404 no Vercel!**
