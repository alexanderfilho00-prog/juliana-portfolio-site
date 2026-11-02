/**
 * Fonte única dos projetos.
 *
 * Para adicionar mídia depois, edite apenas os campos `cover`, `preview`
 * e `gallery` de cada projeto. Componentes e animações não precisam mudar:
 * enquanto `src` estiver ausente, o site mostra o contêiner provisório
 * na mesma proporção.
 */

export type Ratio = '1/1' | '4/5' | '9/16' | '16/9' | '3/2' | '2/3';

/** Cor do contêiner provisório (e do fundo enquanto a mídia carrega). */
export type Swatch = 'fuchsia' | 'indigo' | 'lime';

interface MediaBase {
  /** Caminho a partir de /public (ex.: "/media/xbike/capa.webp") ou URL. Sem `src`, mostra o provisório. */
  src?: string;
  /** Texto alternativo. Obrigatório para imagem/vídeo informativo; "" apenas se for decorativo. */
  alt: string;
  ratio: Ratio;
  /** Proporção alternativa abaixo de 720px (opcional). */
  ratioMobile?: Ratio;
  fit?: 'cover' | 'contain';
  /** Equivalente a object-position, ex.: "50% 30%". */
  position?: string;
  /** Legenda curta exibida abaixo do módulo (opcional). */
  caption?: string;
}

export interface ImageMedia extends MediaBase {
  type: 'image';
}

export interface VideoMedia extends MediaBase {
  type: 'video';
  /** Imagem estática mostrada antes do play e com movimento reduzido. */
  poster?: string;
  /** Vídeo curto sem som, em loop, iniciado só quando visível. Padrão: false (com controles). */
  ambient?: boolean;
}

export type Media = ImageMedia | VideoMedia;

/** Módulos de galeria. Módulos sem nenhum `src` não são renderizados. */
export type GalleryModule =
  | { kind: 'single'; media: Media }
  | { kind: 'pair'; media: [Media, Media] }
  | { kind: 'video'; media: VideoMedia }
  | { kind: 'grid'; media: Media[] };

export interface Project {
  slug: string;
  brand: string;
  title: string;
  disciplines: string[];
  /** Uma linha, usada no índice e na meta description. */
  summary: string;
  /** O que as peças do portfólio mostram sobre a situação da marca. */
  context?: string;
  /** Objetivo declarado no portfólio. */
  objective?: string;
  /** Contribuição como está documentada no portfólio, sem ampliação. */
  contribution: string[];
  swatch: Swatch;
  cover: Media;
  preview: Media;
  gallery?: GalleryModule[];
}

export const projects: Project[] = [
  {
    slug: 'xbike',
    brand: 'XBIKE',
    title: 'Semana do Ciclista e aula experimental',
    disciplines: ['Campanha', 'Tráfego pago'],
    summary: 'Duas frentes para a mesma marca: uma oferta de pacotes e uma campanha de prospecção de alunos.',
    context:
      'A Semana do Ciclista apresentou um pacote de 10 aulas como oferta da data. Em outra frente, um voucher de aula experimental convidou novos alunos a conhecer a experiência.',
    objective: 'Converter a data em venda de pacotes e atrair novos alunos.',
    contribution: [
      'Criação da campanha da Semana do Ciclista, com foco em conversão e aumento de pacotes.',
      'Campanha de tráfego pago para prospecção de novos alunos.',
    ],
    swatch: 'fuchsia',
    cover: { type: 'image', alt: 'Capa do projeto XBIKE', ratio: '16/9', ratioMobile: '4/5' },
    preview: { type: 'image', alt: 'Prévia do projeto XBIKE', ratio: '4/5' },
  },
  {
    slug: 'reserva-classico-easy-chic',
    brand: 'Reserva',
    title: 'Clássico & easy chic',
    disciplines: ['Lançamento', 'Campanha'],
    summary: 'Lançamento de uma linha em tricô entre o despojado e o elegante.',
    context: 'A linha de tricô foi apresentada sob o conceito “Clássico & easy chic”, no meio do caminho entre o despojado e o elegante.',
    objective: 'Aumentar as vendas da linha.',
    contribution: ['Estratégia de lançamento e criação de peças.'],
    swatch: 'lime',
    cover: { type: 'image', alt: 'Capa do projeto Reserva, Clássico & easy chic', ratio: '16/9', ratioMobile: '4/5' },
    preview: { type: 'image', alt: 'Prévia do projeto Reserva, Clássico & easy chic', ratio: '4/5' },
  },
  {
    slug: 'reserva-mini-dia-dos-pais',
    brand: 'Reserva Mini',
    title: 'Tal pai, tal filho',
    disciplines: ['Dia dos Pais', 'Conteúdo institucional'],
    summary: 'Campanha de Dia dos Pais com peças combinando para pais e filhos.',
    context: 'Para o Dia dos Pais, a campanha partiu da ideia de peças combinando, para pai e filho saírem “iguaizinhos por aí”.',
    contribution: ['Reposicionamento de marca e produção de conteúdo institucional.'],
    swatch: 'indigo',
    cover: { type: 'image', alt: 'Capa do projeto Reserva Mini, Tal pai, tal filho', ratio: '16/9', ratioMobile: '4/5' },
    preview: { type: 'image', alt: 'Prévia do projeto Reserva Mini, Tal pai, tal filho', ratio: '4/5' },
  },
  {
    slug: 'flor-do-valqueire-dia-das-maes',
    brand: 'Flor do Valqueire',
    title: 'Dia das Mães na padaria',
    disciplines: ['Campanha temática', 'Conteúdo'],
    summary: 'Campanha de Dia das Mães para uma padaria, do café da manhã ao Festival de Tortas.',
    context:
      'A data foi trabalhada em duas peças: o convite para o café da manhã especial, com buffet e cestas, e o Festival de Tortas, especial de Dia das Mães.',
    objective: 'Gerar engajamento e aumentar as vendas na data.',
    contribution: ['Criação de campanha temática para engajamento e aumento de vendas.'],
    swatch: 'fuchsia',
    cover: { type: 'image', alt: 'Capa do projeto Flor do Valqueire, Dia das Mães', ratio: '16/9', ratioMobile: '4/5' },
    preview: { type: 'image', alt: 'Prévia do projeto Flor do Valqueire, Dia das Mães', ratio: '4/5' },
  },
  {
    slug: '10-e-meio-orla-rio',
    brand: '10 e Meio Beach Club',
    title: 'Conscientização na orla',
    disciplines: ['Campanha', 'Parceria'],
    summary: 'Campanha de conscientização com os quiosques, em parceria com a Orla Rio.',
    contribution: ['Criação de campanha de conscientização com os quiosques, em parceria com a Orla Rio.'],
    swatch: 'lime',
    cover: { type: 'image', alt: 'Capa do projeto 10 e Meio Beach Club com Orla Rio', ratio: '16/9', ratioMobile: '4/5' },
    preview: { type: 'image', alt: 'Prévia do projeto 10 e Meio Beach Club com Orla Rio', ratio: '4/5' },
  },
  {
    slug: 'praia-club',
    brand: 'Praia Club',
    title: 'Jogo na praia',
    disciplines: ['Conteúdo institucional'],
    summary: 'Conteúdo recorrente para engajamento e fortalecimento da marca.',
    context: 'Entre as peças, a programação de transmissões de jogos do Brasileirão no clube.',
    objective: 'Engajamento e fortalecimento da marca.',
    contribution: ['Produção de conteúdo para engajamento e fortalecimento da marca.'],
    swatch: 'indigo',
    cover: { type: 'image', alt: 'Capa do projeto Praia Club', ratio: '16/9', ratioMobile: '4/5' },
    preview: { type: 'image', alt: 'Prévia do projeto Praia Club', ratio: '4/5' },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const projectNumber = (p: Project) => String(projects.indexOf(p) + 1).padStart(2, '0');

export const hasSrc = (m?: Media) => Boolean(m && typeof m.src === 'string' && m.src.trim() !== '');

/** Um módulo de galeria só aparece se toda a mídia dele tiver arquivo. */
export const isModuleReady = (mod: GalleryModule) => {
  const items = Array.isArray(mod.media) ? mod.media : [mod.media];
  return items.length > 0 && items.every(hasSrc);
};
