# OVRLYK°

Site de loja de roupas oversize/streetwear, feito só com **HTML, CSS e JavaScript puro** — sem frameworks, sem build, sem dependências para instalar.

> Mais alto, mais visado. Drop 001 — streetwear oversize.

---

## Estrutura de arquivos

```
ovrlyk/
├── index.html            → estrutura da página
├── style.css              → todo o visual do site
├── script.js               → catálogo, carrinho, filtros, newsletter
├── favicon.svg             → ícone da aba (navegadores modernos)
├── favicon.ico              → ícone da aba (compatibilidade)
├── apple-touch-icon.png      → ícone ao salvar na tela inicial (iOS)
└── imagens/
    ├── camiseta-basica.svg
    ├── camiseta-manga-longa.svg
    ├── regata-ampla.svg
    ├── moletom-canguru.svg
    ├── moletom-gola-alta.svg
    ├── moletom-zip.svg
    ├── calca-cargo.svg
    ├── calca-moletom-reta.svg
    ├── calca-sarja-ampla.svg
    ├── bone-aba-reta.svg
    ├── meia-kit3.svg
    └── bolsa-transversal.svg
```

**Importante:** todos os arquivos e pastas acima precisam ficar juntos, na mesma estrutura relativa. O `index.html` chama os outros por caminho relativo (`style.css`, `script.js`, `imagens/...`), então nada pode ser movido ou renomeado sozinho sem atualizar as referências.

---

## Como usar

Não precisa instalar nada. Duas formas de abrir:

1. **Direto no navegador** — dá duplo clique no `index.html`.
2. **Hospedar de verdade** (recomendado, evita alguns bloqueios de navegador com arquivos locais) — suba a pasta inteira em qualquer hospedagem estática, por exemplo:
   - [Netlify](https://app.netlify.com/drop) (arraste a pasta e pronto)
   - [Vercel](https://vercel.com)
   - GitHub Pages
   - Qualquer hospedagem compartilhada tradicional

---

## O que já funciona

- **Catálogo** com 12 produtos em 4 categorias (camisetas, moletons, calças, acessórios), com filtro por chips
- **Carrinho** completo: adicionar, aumentar/diminuir quantidade, remover, total calculado ao vivo, gaveta lateral animada
- **Selo de estoque limitado** ("Restam X unidades") em produtos com poucas peças
- **Newsletter** (formulário simulado, sem envio real)
- Responsivo (funciona em celular), com foco visível no teclado e respeito à preferência de "reduzir movimento" do sistema

## O que é só exemplo / precisa de atenção

- **Carrinho não é salvo** — ele vive na memória da página. Se recarregar, zera. (Fizemos assim de propósito, para não depender de armazenamento do navegador.)
- **Botão "Finalizar pedido"** só mostra um alerta de exemplo. Para vender de verdade, precisa integrar com um gateway de pagamento (Stripe, Mercado Pago, PagSeguro etc.) e algum backend.
- **Imagens dos produtos são ilustrações vetoriais** (estilo "ficha técnica"/flat sketch), não fotos reais — veja a seção abaixo para trocar por fotos.
- **Newsletter não envia e-mail de verdade** — precisa de um serviço por trás (Mailchimp, um backend próprio, etc.).

---

## Como trocar as imagens dos produtos por fotos reais

Cada produto, dentro de `script.js`, tem um campo `img`:

```js
{ id:1, name:"Camiseta Oversize Básica", cat:"camisetas", price:89.90, fig:"T", sku:"CT-101", stock:14, img:"imagens/camiseta-basica.svg" }
```

Para usar uma foto real:

1. Coloque o arquivo da foto dentro da pasta `imagens/` (ex: `camiseta-basica.jpg`)
2. Troque o valor de `img` para o novo caminho: `img:"imagens/camiseta-basica.jpg"`
3. Também aceita link direto de internet: `img:"https://exemplo.com/foto.jpg"`

Se deixar `img:""` (vazio), o produto volta a mostrar a letra estilizada como reserva.

---

## Como adicionar ou editar produtos

Também em `script.js`, dentro do array `products`. Cada item segue este formato:

```js
{
  id: 13,                     // número único, não repetir
  name: "Nome do produto",
  cat: "camisetas",            // camisetas | moletons | calcas | acessorios
  price: 129.90,
  fig: "T",                     // letra mostrada se não houver imagem
  sku: "CT-120",
  stock: 10,                     // quantidade em estoque
  img: "imagens/novo-produto.svg" // ou "" para usar a letra
}
```

Basta adicionar um novo objeto na lista (ou editar um existente) e salvar — o site atualiza sozinho, sem precisar mexer em mais nada.

---

## Personalização visual rápida

Todas as cores e fontes do site ficam centralizadas no topo do `style.css`, dentro de `:root`:

```css
:root{
  --ink:#0E0D0C;         /* fundo geral (escuro) */
  --panel:#1A1713;        /* superfícies elevadas (cards, menu do carrinho) */
  --panel-2:#24201A;       /* variação um pouco mais clara do panel */
  --paper:#F3EEE3;          /* cor do texto principal e das áreas claras */
  --paper-dim:#948C7C;       /* texto secundário */
  --accent:#3D5CFF;           /* cor de destaque (botões, links, preço em promoção) */
  --line: rgba(243,238,227,0.14); /* linhas divisórias sutis */
}
```

Trocar o valor de `--accent`, por exemplo, muda a cor de destaque em todo o site de uma vez (botões, chip ativo, preço, etc).

**Fontes usadas** (carregadas via Google Fonts no `index.html`):
- **Anton** — títulos grandes (estilo pôster)
- **Fraunces** — frase de destaque do hero e do manifesto (serifada, itálica)
- **Space Grotesk** — texto do corpo
- **JetBrains Mono** — textos técnicos (SKU, preço, tags)

---

## Navegadores

Testado visualmente para Chrome, Firefox, Safari e Edge nas versões atuais. Usa recursos modernos de CSS (Grid, `backdrop-filter`, `clamp()`) e JavaScript (arrow functions, template literals) — não é compatível com Internet Explorer.

---

Feito largo, vendido em bytes. 🖤