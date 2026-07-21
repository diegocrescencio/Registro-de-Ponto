# Ponto Certo

App de controle de ponto com geolocalização para a equipe da loja: entrada, início do
almoço, retorno do almoço e saída, com cálculo automático de horas e exportação de
relatório mensal (CSV) para a contadora.

Frontend estático (`index.html`, sem build) + Firebase (Firestore para os dados,
Authentication anônima só pra proteger o banco de escrita aberta).

## 1. Configurar o Firebase (usando o projeto que vocês já têm)

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e abra o
   projeto existente (o mesmo do sistema de gestão, ou crie um novo se preferir
   manter separado).
2. **Adicionar um app Web**: ⚙️ *Configurações do projeto* → aba *Geral* → em
   "Seus apps" clique no ícone `</>` → dê um nome (ex: `ponto-certo`) → **não** marque
   Firebase Hosting nessa etapa se for hospedar no GitHub Pages.
3. Copie o objeto `firebaseConfig` que aparece e cole no topo do `<script>` em
   `index.html`, substituindo os valores `"COLE_AQUI"`.
4. **Ativar o Firestore**: menu lateral → *Firestore Database* → *Criar banco de
   dados* → modo produção → escolha a região mais próxima (ex: `southamerica-east1`).
5. **Ativar login anônimo**: menu lateral → *Authentication* → *Sign-in method* →
   ative **Anônimo**. Isso só serve para diferenciar "alguém autenticado pelo app" de
   qualquer robô na internet — não pede nada da funcionária, é automático.
6. **Aplicar as regras de segurança** abaixo em *Firestore Database → Regras*:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ponto_certo/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

   Isso garante que só quem abriu o app (e recebeu login anônimo automático) consegue
   ler/gravar os dados — evita que gente de fora ache a URL do banco e mexa nos
   registros.

## 2. Subir para o GitHub

```bash
cd ponto-certo
git init
git add .
git commit -m "Primeira versão do Ponto Certo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/ponto-certo.git
git push -u origin main
```

## 3. Colocar no ar (escolha uma opção)

### Opção A — GitHub Pages (mais simples, grátis)
1. No repositório no GitHub: *Settings → Pages*.
2. Em "Source", selecione a branch `main` e a pasta `/ (root)`.
3. Salve. Em ~1 minuto o app estará em
   `https://SEU-USUARIO.github.io/ponto-certo/`.
4. Esse é o link que você compartilha com as funcionárias (celular ou computador da
   loja) e usa você mesmo para o painel admin.

### Opção B — Firebase Hosting (se preferir tudo no mesmo lugar do Firebase)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting     # escolha o projeto existente, pasta pública = "."
firebase deploy
```

## 4. Ir alterando depois

Igual ao sistema de gestão: edite `index.html`, teste localmente abrindo o arquivo
no navegador (ou rode `npx serve .` para simular um servidor), depois:

```bash
git add .
git commit -m "descrição da mudança"
git push
```

Se estiver usando GitHub Pages, a atualização aparece sozinha em ~1 minuto após o
push. Se for Firebase Hosting, rode `firebase deploy` de novo.

Pode pedir pro Claude Code te ajudar em qualquer uma dessas etapas — ele tem acesso
ao terminal e ao repositório e consegue rodar os comandos de git e deploy junto com
você.

## Estrutura de dados no Firestore

Tudo fica numa coleção só, `ponto_certo`, com estes documentos:

- `config` — nome da loja, latitude/longitude, raio permitido (m), senha do admin.
- `employees` — lista de funcionárias cadastradas.
- `ponto:{idDaFuncionaria}:{AAAA-MM}` — os 4 horários batidos em cada dia daquele mês.

## Limitações a saber

- A precisão do GPS do navegador varia de ~5 a 50 m dependendo do aparelho — configure
  o raio permitido com uma margem de segurança.
- A senha do painel admin é uma proteção simples (nível "não deixar qualquer um
  mexer"), não uma autenticação forte. Não reutilize uma senha importante nela.
- Cada funcionária escolhe o próprio nome numa lista — não há senha individual por
  funcionária nesta versão. Se quiser adicionar PIN por pessoa, é uma mudança pequena.
