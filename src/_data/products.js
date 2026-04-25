const PRICE_TABLE = {
  PP: { 50: 149.90, 100: 279.90, 500: 1349.90, 1000: 2599.90 },
  P:  { 50: 199.90, 100: 379.90, 500: 1799.90, 1000: 3499.90 },
  M:  { 50: 399.90, 100: 789.90, 500: 3845.90, 1000: 7490.90 },
  G:  { 50: 599.90, 100: 1179.90, 500: 5749.90, 1000: 11190.90 },
};

const list = [
  {
    id: "pp",
    name: "Sacola PP",
    size: "PP",
    orientation: null,
    dims: "10 × 17 × 3,5 cm",
    desc: "Ideal para acessórios pequenos como joias e brindes compactos.",
    photo: "images/sacola-pp-foto.png",
    prices: PRICE_TABLE.PP,
  },
  {
    id: "p-vertical",
    name: "Sacola P",
    size: "P",
    orientation: "Vertical",
    dims: "13,5 × 20 × 5 cm",
    desc: "Ideal para acessórios pequenos e celulares na caixa.",
    photo: "images/sacola-p-vertical-foto.png",
    prices: PRICE_TABLE.P,
  },
  {
    id: "p-horizontal",
    name: "Sacola P",
    size: "P",
    orientation: "Horizontal",
    dims: "20 × 14 × 6 cm",
    desc: "Ideal para acessórios pequenos e celulares na caixa.",
    photo: "images/sacola-p-horizontal-foto.png",
    prices: PRICE_TABLE.P,
  },
  {
    id: "m-vertical",
    name: "Sacola M",
    size: "M",
    orientation: "Vertical",
    dims: "19 × 28 × 8 cm",
    desc: "Ideal para tablets, headphones e perfumes importados.",
    photo: "images/sacola-m-vertical-foto.jpeg",
    prices: PRICE_TABLE.M,
  },
  {
    id: "m-horizontal",
    name: "Sacola M",
    size: "M",
    orientation: "Horizontal",
    dims: "28 × 20 × 10 cm",
    desc: "Ideal para tablets, headphones e perfumes importados.",
    photo: "images/sacola-m-horizontal-foto.jpeg",
    prices: PRICE_TABLE.M,
  },
];

module.exports = {
  list,
  priceTable: PRICE_TABLE,
  sizes: ["PP", "P", "M"],
  orientations: ["Vertical", "Horizontal"],
  filters: ["Todos", "PP", "P", "M"],
};
