# Location Front

Este é o frontend da aplicação de gerenciamento de locais, construído com tecnologias modernas para oferecer uma experiência de usuário fluida e interativa.

## 🚀 Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org/)**: Framework React para produção, utilizando o App Router.
- **[React 19](https://react.dev/)**: Biblioteca para construção de interfaces de usuário.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de utilitários CSS para estilização rápida e responsiva.
- **[Framer Motion](https://www.framer.com/motion/)**: Biblioteca para animações complexas e fluidas (transições de lista, hover effects).
- **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/)**: Biblioteca para mapas interativos e customizáveis.
- **[Zod](https://zod.dev/)**: Biblioteca para validação de esquemas (usada nos formulários).
- **[Lucide React](https://lucide.dev/)**: Biblioteca de ícones.
- **[Axios](https://axios-http.com/)**: Cliente HTTP para comunicação com a API.

## 🏗️ Arquitetura e Decisões de Design

O projeto segue uma arquitetura baseada em **Features** (`src/features`), o que promove melhor organização e escalabilidade.

### Estrutura de Pastas
- `src/features/`: Contém módulos independentes da aplicação (ex: `locations`, `map`).
    - `api/`: Serviços de comunicação com o backend específicos da feature.
    - `components/`: Componentes React específicos da feature.
- `src/components/ui/`: Componentes reutilizáveis e genéricos (botões, inputs, dialogs).
- `src/schemas/`: Esquemas de validação Zod.
- `src/types/`: Definições de tipos TypeScript compartilhados.

### Principais Decisões
1.  **Feature-First Organization**: Agrupar código por funcionalidade (Locations, Map) em vez de tipo de arquivo facilita a manutenção e o entendimento do domínio.
2.  **Client-Side Interactivity**: Uso extensivo de `'use client'` para componentes que requerem interatividade (mapa, formulários, animações), mantendo o benefício do SSR onde possível (embora neste SPA a maior parte seja interativa).
3.  **Validação Robusta**: Uso do Zod para garantir que os dados de entrada nos formulários (criação e edição) estejam corretos antes de serem enviados à API.
4.  **UX Aprimorada**:
    - **Animações**: Feedback visual no hover, transições de entrada (stagger) e feedback de seleção.
    - **Mapa Interativo**: Integração profunda entre a lista de locais e o mapa (clique no mapa para criar, clique no card para focar).

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior recomendada)
- NPM ou Yarn
- Backend rodando (verifique a URL da API)

### Passo a Passo

1.  **Clone o repositório**
    ```bash
    git clone <url-do-repositorio>
    cd location-front
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configuração de Variáveis de Ambiente**
    Crie um arquivo `.env.local` na raiz do projeto e configure as variáveis necessárias:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000/api
    NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_mapbox_aqui
    ```

4.  **Rode o servidor de desenvolvimento**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

5.  **Acesse a aplicação**
    Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📝 Funcionalidades

- **Listagem de Locais**: Visualização em grid com animações de entrada.
- **Mapa Interativo**: Visualização dos locais no mapa.
- **Criação de Locais**: Clique no mapa para adicionar um novo ponto. Upload de imagem suportado.
- **Edição de Locais**: Edite nome, descrição e imagem (opcional) dos locais existentes.
- **Exclusão de Locais**: Remova locais indesejados.
- **Navegação**: Selecione um local para ver detalhes e iniciar uma rota (simulação visual).
