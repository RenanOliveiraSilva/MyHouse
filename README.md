<div align="center">
  <img src="./assets/images/logo.jpg" alt="MyHouse Logo" width="100" style="border-radius: 20px;" />
  
  # 🏡 MyHouse · Projeto a Dois
  
  **O app perfeito para casais organizarem, planejarem e comprarem os móveis da sua futura casa.**
  
  [![React Native](https://img.shields.io/badge/React_Native-0.86-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo_SDK-57-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
</div>

---

## 📖 Sobre o Projeto

O **MyHouse** nasceu de uma necessidade real: um casal planejando montar a casa dos sonhos! Em vez de planilhas complexas ou listas de notas perdidas, o MyHouse oferece uma experiência mobile linda, prática e com **sincronização em tempo real**. 

Quando um marca um móvel como comprado na loja ou altera o preço no celular, a tela do outro atualiza instantaneamente no mesmo segundo! 💖

---

## ✨ Principais Funcionalidades

- **💰 Controle de Orçamento Inteligente**:
  - Definição do teto máximo de gastos com modal rápido de edição.
  - Indicador visual em tempo real de quanto foi planejado, quanto já foi pago e quanto falta comprar.
  - Cálculo automático de **folga orçamentária** e porcentagem utilizada.

- **🛋️ Organização por Cômodos (Ambientes)**:
  - Carrossel horizontal intuitivo com progresso individual de compra por cômodo (Sala, Quarto, Cozinha, etc.).
  - Criação ágil de novos ambientes com descrições personalizadas.
  - Exclusão segura de ambiente com alerta de proteção e cascata de itens.

- **📋 Visão Geral Completa ("Todos os Móveis")**:
  - Lista unificada com todos os itens da casa em uma só tela, sem precisar navegar de cômodo em cômodo.
  - Etiquetas elegantes identificando o ambiente de cada produto.

- **🔗 Links e Detalhes dos Produtos**:
  - Links diretos para lojas (*Tok&Stok, Oppa, Mobly, MadeiraMadeira, etc.*) que abrem com um toque.
  - Quantidade, preço e marcação de comprado com efeito tachado.

- **⚡ Sincronização ao Vivo (Supabase Realtime)**:
  - Banco de dados em nuvem compartilhado sem necessidade de tela de login.
  - Sincronização automática via WebSockets entre múltiplos dispositivos.

- **📴 Modo Offline / Local First**:
  - Se você não configurar o Supabase ou estiver sem internet, o app funciona perfeitamente salvando tudo no armazenamento local do celular (`AsyncStorage`).

---

## 🎨 Design & Identidade Visual

O design foi desenvolvido com foco em estética premium e acolhedora:
- **Tipografia**: 
  - `Fraunces` (Google Font Serif elegante para títulos e valores de destaque)
  - `Inter` (Sans-serif moderno e legível para a interface)
  - `DM Mono` (Monospace refinado para etiquetas, links e preços)
- **Paleta de Cores**:
  - `paper` (`#F6F4EA`) - Fundo acolhedor estilo editorial
  - `navy` (`#243757`) - Azul profundo para contrastes e botões
  - `teal` (`#3A5F6F`) - Destaque suave para itens concluídos e links
  - `sand` (`#DAD5B7`) / `stone` (`#665E52`) - Tons terrosos para barras e textos auxiliares

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- App **Expo Go** instalado no seu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 2. Clonar o Repositório e Instalar Dependências
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/myHouse.git

# Acesse a pasta do projeto
cd myHouse

# Instale os pacotes
npm install
```

### 3. Iniciar o App
```bash
npx expo start -c
```
- Escaneie o **QR Code** exibido no terminal com a câmera (iOS) ou com o app **Expo Go** (Android).
- Pressione `w` no terminal caso queira abrir no navegador web.

---

## ☁️ Como Configurar o Seu Próprio Supabase (Gratuito)

Para habilitar a sincronização em tempo real entre você e outra pessoa:

### Passo 1: Criar uma conta no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **"New Project"**, dê um nome (ex: `myHouse`) e defina uma senha para o banco de dados.

### Passo 2: Executar o Script SQL
1. No painel do seu projeto no Supabase, clique no menu lateral **SQL Editor** (ícone `>_`).
2. Clique em **"New Query"**.
3. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste repositório, copie todo o seu conteúdo, cole no editor SQL do Supabase e clique em **Run**.

> 💡 *Esse script cria automaticamente as tabelas `houses`, `rooms`, `items`, libera as permissões de acesso e ativa o canal de Realtime.*

### Passo 3: Configurar as Variáveis de Ambiente
1. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem) > **API**.
2. Copie:
   - **Project URL**
   - **Project API Keys (`anon` `public`)**
3. Na raiz do projeto `myHouse`, crie um arquivo `.env` (ou duplique o `.env.example`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
```

### Passo 4: Reiniciar o Expo
Reinicie o servidor do Expo com cache limpo:
```bash
npx expo start -c
```
Pronto! Agora qualquer celular conectado a esse projeto do Supabase estará sincronizado em tempo real! 🎉

---

## 📁 Estrutura de Pastas

```text
myHouse/
├── assets/                  # Ícones, logo e imagens da aplicação
├── src/
│   ├── app/                 # Rotas do Expo Router (_layout.tsx, index.tsx)
│   ├── components/          # Componentes visuais modulares
│   │   ├── Modals/          # Modais de criação e edição
│   │   ├── AddItemCard.tsx  # Formulário inline de adição de móveis
│   │   ├── BudgetCard.tsx   # Card do orçamento total e métricas
│   │   ├── FurnitureItemRow.tsx # Linha do móvel com checkbox e links
│   │   ├── Header.tsx       # Cabeçalho com tipografia e resumo
│   │   └── RoomCarousel.tsx # Carrossel horizontal de cômodos
│   ├── constants/           # Cores, fontes e tokens de design (theme.ts)
│   ├── hooks/               # Hook useHouseData com lógica de estado e Realtime
│   ├── services/            # Camada de dados (Supabase e AsyncStorage)
│   ├── types/               # Definições TypeScript (house.ts)
│   └── utils/               # Formatadores de moeda e URLs
├── supabase/
│   └── schema.sql           # Script SQL para criação das tabelas no Supabase
├── .env.example             # Modelo das variáveis de ambiente
├── app.json                 # Configurações do Expo
└── package.json             # Dependências do projeto
```

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">
  Feito com carinho para planejar o nosso futuro lar 🏡💛
</div>
