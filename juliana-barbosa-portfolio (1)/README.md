# Portfólio — Juliana Barbosa

Site estático em Astro 5 + TypeScript, com CSS próprio (sem framework de UI nem biblioteca de animação).

Requisitos: Node.js 18.20.8+ ou 20.3+ ou 22+ (recomendado 22) e npm.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # checagem de tipos (astro check) + build estático em dist/
npm run preview    # serve o dist/ em http://localhost:4321
```

## Publicar pela Vercel

1. Envie esta pasta para um repositório no GitHub (com `package.json` na raiz).
2. Na Vercel: **Add New… → Project → Import** o repositório.
3. Configurações (a Vercel detecta Astro automaticamente; confira):
   - Framework Preset: **Astro**
   - Root Directory: `./`
   - Install Command: `npm install` (padrão; usa o `package-lock.json`)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node.js Version: 22.x (Project Settings → Build and Deployment)
   - Variáveis de ambiente: nenhuma.
4. **Deploy.** Cada push na branch principal gera um novo deploy.

O site é 100% estático: não precisa de adaptador `@astrojs/vercel`. A página `404.astro` vira `404.html` e a Vercel a usa para rotas inexistentes.

## Onde editar

- `src/data/projects.ts` — projetos (ordem do índice = ordem do array).
- `src/data/profile.ts` — formação, prática, ferramentas, marcas e contato.
- `src/styles/tokens.css` — cores, tipografia, espaço e movimento.

## Fontes

Toda a interface usa uma única família: `"Helvetica Neue", Helvetica, Arial, sans-serif`
(títulos Bold 700 com `letter-spacing: -0.06em`; texto Regular 400; navegação e listas Medium 500).

O projeto **não inclui arquivos de fonte**: a Helvetica Neue vem do sistema do visitante
(Apple: Helvetica Neue; Windows: Arial; Linux: substituto do sistema). Para a mesma aparência
em todos os aparelhos, adicione os arquivos web licenciados (ex.: `public/fonts/`) com `@font-face`
usando exatamente o nome de família `Helvetica Neue` e os pesos 400, 500 e 700.

## Movimento

- Abertura: só na primeira visita da sessão à home (painel fúcsia, letras rolando, painel sobe).
  Clique, tecla ou rolagem pulam. Não aparece com movimento reduzido.
- Cursor gatinho: só com mouse/trackpad; decorativo (`pointer-events: none`), o cursor nativo continua.
- Tudo respeita `prefers-reduced-motion`; sem JavaScript, o conteúdo aparece normalmente.

## Adicionar mídia dos projetos

1. Coloque os arquivos em `public/media/<slug>/`.
2. Em `src/data/projects.ts`, preencha `src` no item desejado:

```ts
preview: { type: 'image', src: '/media/xbike/previa.webp', alt: 'Descrição da peça', ratio: '4/5', position: '50% 30%' },
cover:   { type: 'image', src: '/media/xbike/capa.webp',  alt: '...', ratio: '16/9', ratioMobile: '4/5' },
gallery: [
  { kind: 'single', media: { type: 'image', src: '/media/xbike/01.webp', alt: '...', ratio: '16/9' } },
  { kind: 'pair',   media: [ { type: 'image', src: '...', alt: '...', ratio: '4/5' }, { type: 'image', src: '...', alt: '...', ratio: '4/5' } ] },
  { kind: 'video',  media: { type: 'video', src: '/media/xbike/reel.mp4', poster: '/media/xbike/reel.webp', alt: '...', ratio: '9/16', ambient: true } },
  { kind: 'grid',   media: [ /* imagens 1:1, 4:5... */ ] },
],
```

Campos: `type`, `src`, `alt`, `ratio`, `ratioMobile`, `fit` (`cover`/`contain`), `position` (object-position), `caption`; para vídeo, `poster` e `ambient` (loop mudo que só toca visível e sem movimento reduzido).

Sem `src`, o site mostra o contêiner provisório na mesma proporção. Módulos de galeria sem arquivo não são renderizados.
