import { useState, useMemo } from "react";

// ─── DATA ───
const BIRTH = new Date(2025, 9, 4);
const START = new Date(2026, 3, 4);

const GROUP_META = {
  cereal: { emoji: "🌾", color: "#D97706", bg: "#FFFBEB", label: "Cereal" },
  fruta: { emoji: "🍎", color: "#DC2626", bg: "#FEF2F2", label: "Fruta" },
  verdura: { emoji: "🥦", color: "#16A34A", bg: "#F0FDF4", label: "Verdura" },
  proteina: { emoji: "🐟", color: "#2563EB", bg: "#EFF6FF", label: "Proteína" },
  legumbre: { emoji: "🫘", color: "#9333EA", bg: "#FAF5FF", label: "Legumbre" },
  lacteo: { emoji: "🧀", color: "#0891B2", bg: "#ECFEFF", label: "Lácteo" },
  grasa: { emoji: "🥑", color: "#65A30D", bg: "#F7FEE7", label: "Grasa" },
};

const FOODS = [
  { id: 0, name: "Avena", group: "cereal", day: 0, prep: "Papilla fina con leche materna descongelada", combos: ["Leche materna"] },
  { id: 1, name: "Manzana cocida", group: "fruta", day: 3, prep: "Cocida al vapor, triturada. NUNCA cruda", combos: ["Avena + leche materna"] },
  { id: 2, name: "Pera", group: "fruta", day: 7, prep: "Cocida al vapor o chafada si muy madura", combos: ["Manzana", "Avena + leche materna"] },
  { id: 3, name: "Calabacín", group: "verdura", day: 10, prep: "Pelado, cocido al vapor, triturado + AOVE", combos: [] },
  { id: 4, name: "Plátano", group: "fruta", day: 13, prep: "Chafado con tenedor, bien maduro", combos: ["Pera", "Manzana cocida"] },
  { id: 5, name: "Zanahoria cocida", group: "verdura", day: 16, prep: "Cocida al vapor + AOVE. NUNCA cruda", combos: ["Calabacín + AOVE"] },
  { id: 6, name: "Patata", group: "verdura", day: 20, prep: "Cocida, triturada. Da cremosidad a purés", combos: ["Calabacín + zanahoria + AOVE"] },
  { id: 7, name: "Judía verde", group: "verdura", day: 23, prep: "Cocida al vapor, triturada + AOVE", combos: ["Patata + AOVE"] },
  { id: 8, name: "Calabaza", group: "verdura", day: 26, prep: "Cocida al vapor, triturada. Sabor dulce", combos: ["Zanahoria + patata"] },
  { id: 9, name: "Brócoli", group: "verdura", day: 29, prep: "Ramilletes al vapor + AOVE. Mezclar con patata", combos: ["Patata + calabacín + AOVE"] },
  { id: 10, name: "Fresa", group: "fruta", day: 32, prep: "Lavada, triturada. Potencial alergénico", combos: ["Plátano", "Pera"] },
  { id: 11, name: "Boniato", group: "verdura", day: 35, prep: "Cocido al vapor/horno, triturado", combos: ["Calabaza + AOVE"] },
  { id: 12, name: "Naranja", group: "fruta", day: 38, prep: "Gajos sin membrana, triturada. Rica en vit. C", combos: ["Pera", "Plátano"] },
  { id: 13, name: "Puerro", group: "verdura", day: 41, prep: "Cocido al vapor, en purés de verduras", combos: ["Patata + zanahoria + AOVE"] },
  { id: 14, name: "Arroz", group: "cereal", day: 58, prep: "Muy cocido, triturado o en grano pasado", combos: ["Calabacín + zanahoria + AOVE"] },
  { id: 15, name: "Lentejas", group: "legumbre", day: 62, prep: "Rojas, cocidas, trituradas. COMBINAR CON VIT. C", combos: ["Patata + zanahoria + AOVE + naranja"] },
  { id: 16, name: "Pescado blanco", group: "proteina", day: 72, prep: "Merluza/lenguado al vapor, desmigado SIN espinas. 20-30g", combos: ["Patata + judía verde + AOVE"] },
  { id: 17, name: "Yema de huevo", group: "proteina", day: 76, prep: "Huevo duro 10-12 min, solo yema, chafada en puré", combos: ["Calabacín + patata + AOVE"] },
  { id: 18, name: "Garbanzos", group: "legumbre", day: 88, prep: "Cocidos a presión, triturados o hummus + AOVE", combos: ["Calabacín + tomate + AOVE"] },
  { id: 19, name: "Tomate", group: "verdura", day: 92, prep: "Escaldado, pelado, sin pepitas, cocido", combos: ["Calabacín + arroz + AOVE"] },
  { id: 20, name: "Guisantes", group: "legumbre", day: 100, prep: "Cocidos, triturados (la piel puede costar)", combos: ["Patata + zanahoria + AOVE"] },
  { id: 21, name: "Pasta", group: "cereal", day: 104, prep: "Muy blanda: meravella, fideos, macarrones cortados", combos: ["Tomate + brócoli + AOVE"] },
  { id: 22, name: "Melocotón", group: "fruta", day: 108, prep: "Pelado, maduro, chafado o en gajos blandos", combos: ["Plátano", "Pera"] },
  { id: 23, name: "Pescado azul", group: "proteina", day: 120, prep: "Sardina/salmón al vapor, desmigado. NO atún/pez espada", combos: ["Patata + brócoli + AOVE"] },
  { id: 24, name: "Huevo entero", group: "proteina", day: 124, prep: "Tortilla francesa sin sal, revuelto, duro", combos: ["Tomate + arroz", "Calabacín + patata"] },
  { id: 25, name: "Yogur natural", group: "lacteo", day: 134, prep: "Sin azúcar ni sabores. Con cuchara", combos: ["Plátano", "Melocotón + avena"] },
  { id: 26, name: "Queso fresco", group: "lacteo", day: 138, prep: "Pasteurizado, tipo Burgos. Sin sal. En trocitos", combos: ["Tomate + AOVE"] },
  { id: 27, name: "Albaricoque", group: "fruta", day: 150, prep: "Pelado, chafado o en trocitos blandos", combos: ["Yogur", "Plátano"] },
  { id: 28, name: "Aguacate", group: "grasa", day: 154, prep: "Chafado con tenedor. En tiras para BLW", combos: ["Plátano", "Solo"] },
  { id: 29, name: "Mandarina", group: "fruta", day: 158, prep: "Pelada, sin semillas. Vit. C para legumbres", combos: ["Pera", "Con legumbres"] },
  { id: 30, name: "Apio", group: "verdura", day: 162, prep: "Cocido al vapor hasta muy blando", combos: ["Patata + zanahoria"] },
  { id: 31, name: "Chirivía", group: "verdura", day: 166, prep: "Cocida al vapor, triturada. Sabor dulce", combos: ["Patata + puerro"] },
  { id: 32, name: "Frutos secos", group: "grasa", day: 170, prep: "SIEMPRE en crema o triturados. NUNCA enteros", combos: ["Avena + leche materna", "Yogur"] },
  { id: 33, name: "Acelgas", group: "verdura", day: 183, prep: "Cocidas. Ya permitidas a los 12 meses", combos: ["Patata + AOVE"] },
  { id: 34, name: "Espinacas", group: "verdura", day: 187, prep: "Cocidas, en pequeñas cantidades", combos: ["Arroz + tomate + AOVE"] },
  { id: 35, name: "Kiwi", group: "fruta", day: 191, prep: "Pelado, chafado. Rico en vit. C", combos: ["Plátano", "Pera"] },
  { id: 36, name: "Piña", group: "fruta", day: 195, prep: "Pelada, trocitos blandos o triturada", combos: ["Plátano"] },
  { id: 37, name: "Ciruela", group: "fruta", day: 199, prep: "Pelada, chafada. Ayuda al tránsito", combos: ["Pera", "Yogur"] },
  { id: 38, name: "Quinoa", group: "cereal", day: 203, prep: "Cocida, en grano bien blando", combos: ["Verduras + AOVE"] },
];

// ─── PURCHASE INFO: real quantities per serving + purchase units ───
// gPerServing = grams of this food used per meal appearance
// purchaseUnit = what you actually buy
// purchaseGrams = grams in one purchase unit
const PURCHASE = {
  "Avena":            { g: 15,  unit: "paquete 250g copos finos",    pkg: 250 },
  "Manzana cocida":   { g: 60,  unit: "manzanas",                    pkg: 150, isUnit: true },
  "Pera":             { g: 60,  unit: "peras",                       pkg: 150, isUnit: true },
  "Calabacín":        { g: 60,  unit: "calabacines",                 pkg: 200, isUnit: true },
  "Plátano":          { g: 50,  unit: "plátanos",                    pkg: 100, isUnit: true },
  "Zanahoria cocida": { g: 50,  unit: "zanahorias",                  pkg: 80,  isUnit: true },
  "Patata":           { g: 60,  unit: "patatas",                     pkg: 150, isUnit: true },
  "Judía verde":      { g: 50,  unit: "g judía verde",               pkg: 250, isBulk: true },
  "Calabaza":         { g: 60,  unit: "trozo calabaza (~300g)",      pkg: 300 },
  "Brócoli":          { g: 50,  unit: "brócoli (pieza)",             pkg: 300, isUnit: true },
  "Fresa":            { g: 40,  unit: "bandeja fresas (250g)",       pkg: 250 },
  "Boniato":          { g: 60,  unit: "boniatos",                    pkg: 200, isUnit: true },
  "Naranja":          { g: 60,  unit: "naranjas",                    pkg: 180, isUnit: true },
  "Puerro":           { g: 40,  unit: "puerros",                     pkg: 100, isUnit: true },
  "Arroz":            { g: 25,  unit: "paquete arroz 500g",          pkg: 500 },
  "Lentejas":         { g: 40,  unit: "paquete lentejas rojas 500g", pkg: 500 },
  "Pescado blanco":   { g: 30,  unit: "filetes merluza (~100g c/u)", pkg: 100, isUnit: true },
  "Yema de huevo":    { g: 15,  unit: "huevos (solo usarás la yema)",pkg: 60,  isUnit: true },
  "Garbanzos":        { g: 40,  unit: "bote garbanzos cocidos 400g", pkg: 400 },
  "Tomate":           { g: 50,  unit: "tomates",                     pkg: 150, isUnit: true },
  "Guisantes":        { g: 40,  unit: "bolsa guisantes congelados 400g", pkg: 400 },
  "Pasta":            { g: 30,  unit: "paquete pasta pequeña 250g",  pkg: 250 },
  "Melocotón":        { g: 60,  unit: "melocotones",                 pkg: 150, isUnit: true },
  "Pescado azul":     { g: 30,  unit: "filetes salmón/sardinas (~100g)", pkg: 100, isUnit: true },
  "Huevo entero":     { g: 60,  unit: "huevos",                      pkg: 60,  isUnit: true },
  "Yogur natural":    { g: 125, unit: "yogures naturales sin azúcar", pkg: 125, isUnit: true },
  "Queso fresco":     { g: 20,  unit: "queso fresco pasteurizado (250g)", pkg: 250 },
  "Albaricoque":      { g: 50,  unit: "albaricoques",                pkg: 50,  isUnit: true },
  "Aguacate":         { g: 40,  unit: "aguacates",                   pkg: 150, isUnit: true },
  "Mandarina":        { g: 50,  unit: "mandarinas",                  pkg: 80,  isUnit: true },
  "Apio":             { g: 30,  unit: "rama de apio",                pkg: 200, isUnit: true },
  "Chirivía":         { g: 50,  unit: "chirivías",                   pkg: 100, isUnit: true },
  "Frutos secos":     { g: 8,   unit: "bote crema de almendra/cacahuete 250g", pkg: 250 },
  "Acelgas":          { g: 40,  unit: "manojo acelgas",              pkg: 300 },
  "Espinacas":        { g: 30,  unit: "bolsa espinacas baby 200g",   pkg: 200 },
  "Kiwi":             { g: 50,  unit: "kiwis",                       pkg: 80,  isUnit: true },
  "Piña":             { g: 50,  unit: "piña (1 pieza dura ~2 sem)",  pkg: 800 },
  "Ciruela":          { g: 50,  unit: "ciruelas",                    pkg: 60,  isUnit: true },
  "Quinoa":           { g: 25,  unit: "paquete quinoa 250g",         pkg: 250 },
};

function calcShoppingQty(name, count) {
  const p = PURCHASE[name];
  if (!p) return { qty: count + "×", detail: "" };
  const totalG = p.g * count;
  if (p.isUnit) {
    const units = Math.ceil(totalG / p.pkg);
    return { qty: `${units}`, detail: p.unit };
  }
  if (p.isBulk) {
    const needed = Math.ceil(totalG / p.pkg);
    return { qty: `${needed}`, detail: p.unit.replace(/^g /, `× ${p.pkg}g `) };
  }
  const packs = Math.ceil(totalG / p.pkg);
  if (packs <= 1) return { qty: "1", detail: p.unit };
  return { qty: `${packs}`, detail: p.unit };
}

// ─── RECIPES ───
const RECIPES = {
  avena_base: { title: "Papilla de avena", time: "5 min", portions: "1 ración",
    ingredients: ["2 cdas copos de avena finos", "80 ml leche materna descongelada"],
    steps: ["Calentar la leche materna a fuego suave (nunca hervir).", "Añadir la avena y remover 2-3 min hasta que espese.", "Dejar templar. Servir con cuchara."],
    batch: "No merece la pena congelar. Hacerla fresca cada vez (5 min)." },
  avena_fruta: { title: "Papilla de avena con fruta", time: "10 min", portions: "1-2 raciones",
    ingredients: ["2 cdas copos de avena finos", "80 ml leche materna descongelada", "½ pieza de fruta (manzana, pera, plátano…)"],
    steps: ["Si la fruta necesita cocción (manzana, pera): cocer al vapor 8 min.", "Preparar la avena con leche materna (2-3 min a fuego suave).", "Triturar la fruta y mezclar con la papilla.", "Dejar templar. Servir."],
    batch: "La fruta cocida se puede preparar en lote y congelar. La avena hacerla fresca." },
  pure_verduras: { title: "Puré base de verduras", time: "20 min", portions: "3-4 raciones",
    ingredients: ["1 patata pequeña", "1 zanahoria", "1 calabacín pequeño (u otra verdura aprobada)", "1 cdta de AOVE"],
    steps: ["Pelar y trocear todas las verduras.", "Cocer al vapor 15 min hasta muy tiernas.", "Triturar con batidora añadiendo agua de cocción hasta textura deseada.", "Añadir AOVE y mezclar.", "Repartir en porciones individuales."],
    batch: "Congelar en cubiteras o tarritos. Dura 3 meses en congelador. Etiquetar con fecha." },
  pure_verduras_proteina: { title: "Puré de verduras con proteína", time: "25 min", portions: "2-3 raciones",
    ingredients: ["1 patata pequeña + 1 verdura aprobada", "20-30g de pescado blanco (o yema de huevo)", "1 cdta de AOVE"],
    steps: ["Pelar y trocear las verduras. Cocer al vapor 15 min.", "Si pescado: cocer al vapor 5-8 min aparte. Desmigar MUY bien sin espinas.", "Si yema: cocer huevo duro 12 min, separar yema.", "Triturar verduras con agua de cocción.", "Añadir proteína y AOVE. Mezclar."],
    batch: "Se puede congelar con el pescado incluido. No recongelar si el pescado ya estaba congelado." },
  lentejas_hierro: { title: "Lentejas bomba de hierro", time: "25 min", portions: "3-4 raciones",
    ingredients: ["40g lentejas rojas", "1 zanahoria", "½ patata", "1 cdta AOVE", "Zumo de ¼ naranja"],
    steps: ["Aclarar las lentejas.", "Pelar y trocear zanahoria y patata.", "Cocer todo junto en agua sin sal, 20-25 min.", "Triturar o chafar con tenedor.", "Añadir AOVE y chorrito de naranja. ¡Vit. C multiplica absorción del hierro!"],
    batch: "Congelar en porciones de 50-60g. Añadir la naranja al recalentar, no antes." },
  garbanzos_hummus: { title: "Hummus suave para bebé", time: "5 min", portions: "3-4 raciones",
    ingredients: ["60g garbanzos cocidos", "1 cdta AOVE", "Unas gotas de limón", "2 cdas agua de cocción"],
    steps: ["Triturar los garbanzos con batidora.", "Añadir AOVE y limón.", "Ajustar con agua de cocción hasta textura cremosa.", "Servir con tiras de verdura cocida o pan blando."],
    batch: "Congelar en porciones. Descongela bien y mantiene textura." },
  tortilla_blw: { title: "Tortilla francesa en tiras (BLW)", time: "5 min", portions: "1 ración",
    ingredients: ["1 huevo", "½ cdta AOVE"],
    steps: ["Batir el huevo.", "Calentar AOVE en sartén antiadherente a fuego medio-bajo.", "Verter el huevo, hacer tortilla fina.", "Cortar en tiras del tamaño de un dedo adulto.", "Dejar templar y servir."],
    batch: "Mejor hacerla fresca. Si sobra, guardar en nevera 24h." },
  fruta_merienda: { title: "Merienda de frutas", time: "5 min", portions: "1 ración",
    ingredients: ["½ pieza de fruta 1 (ej: plátano)", "½ pieza de fruta 2 (ej: pera, fresa…)"],
    steps: ["Si necesita cocción (manzana, pera dura): cocer al vapor 8 min.", "Chafar con tenedor o triturar según fase.", "Mezclar ambas frutas.", "Servir templado o a temperatura ambiente."],
    batch: "Las frutas cocidas se pueden congelar. El plátano chafar fresco." },
  pasta_verduras: { title: "Pasta con verduras", time: "15 min", portions: "2 raciones",
    ingredients: ["30g pasta pequeña (meravella, fideos…)", "1 tomate maduro", "Verdura aprobada al gusto", "1 cdta AOVE"],
    steps: ["Cocer la pasta MUY blanda (2-3 min más de lo indicado).", "Escaldar tomate, pelar y triturar.", "Cocer verdura al vapor.", "Mezclar pasta + tomate + verdura + AOVE."],
    batch: "Se puede congelar el conjunto. Al recalentar, añadir un poco de agua." },
  yogur_fruta: { title: "Yogur con fruta y cereales", time: "3 min", portions: "1 ración",
    ingredients: ["1 yogur natural (sin azúcar)", "½ pieza de fruta", "1 cda de avena (opcional)"],
    steps: ["Chafar o trocear la fruta.", "Mezclar con el yogur.", "Añadir cereal si se desea.", "Servir con cuchara."],
    batch: "No congelar. Preparar fresco." },
  pescado_pure: { title: "Pescado con puré de verduras", time: "20 min", portions: "2 raciones",
    ingredients: ["1 filete pequeño merluza/lenguado (30g)", "1 patata pequeña", "1 verdura aprobada", "1 cdta AOVE"],
    steps: ["Cocer verduras al vapor 15 min.", "Cocer pescado al vapor 5-8 min aparte.", "Desmigar MUY bien, revisando espinas con los dedos.", "Triturar verduras con AOVE.", "Servir pescado desmigado sobre puré o mezclar."],
    batch: "Congelar puré aparte. Pescado fresco mejor, pero se puede congelar desmigado." },
};

function getRecipeForMeal(desc) {
  const d = desc.toLowerCase();
  if (d.includes("yogur")) return "yogur_fruta";
  if (d.includes("tortilla")) return "tortilla_blw";
  if (d.includes("hummus") || (d.includes("garbanzos") && !d.includes("pasta"))) return "garbanzos_hummus";
  if (d.includes("lentejas")) return "lentejas_hierro";
  if (d.includes("pasta") || d.includes("meravella") || d.includes("fideos")) return "pasta_verduras";
  if (d.includes("merluza") || d.includes("lenguado") || d.includes("pescado") || d.includes("rape") || d.includes("salmón") || d.includes("sardina") || d.includes("caballa")) return "pescado_pure";
  if (d.includes("avena") && (d.includes("manzana") || d.includes("pera") || d.includes("plátano") || d.includes("fresa") || d.includes("melocotón"))) return "avena_fruta";
  if (d.includes("avena") && d.includes("leche")) return "avena_base";
  if (d.includes("puré") && (d.includes("merluza") || d.includes("yema") || d.includes("huevo"))) return "pure_verduras_proteina";
  if (d.includes("puré") || (d.includes("patata") && d.includes("aove"))) return "pure_verduras";
  return "fruta_merienda";
}

// ─── UTILS ───
const INTRO_DAYS = 3;
function daysBetween(a, b) { return Math.floor((b - a) / 864e5); }
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function formatDate(d) {
  const dd = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
  const mm = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${dd[d.getDay()]} ${d.getDate()} ${mm[d.getMonth()]}`;
}
function getAgeText(date) {
  const days = daysBetween(BIRTH, date);
  const m = Math.floor(days / 30.44), rd = Math.floor(days - m * 30.44);
  return m < 1 ? `${days} días` : rd <= 0 ? `${m} meses` : `${m}m ${rd}d`;
}
function getPhase(dss) {
  if (dss < 0) return 0; if (dss < 44) return 1; if (dss < 90) return 2; if (dss < 150) return 3; return 4;
}
const PHASE_INFO = {
  0: { label: "Pre-inicio", texture: "—", color: "#9CA3AF" },
  1: { label: "Primeros sabores", texture: "Puré fino", color: "#059669" },
  2: { label: "Expansión", texture: "Puré con grumos", color: "#2563EB" },
  3: { label: "Variedad", texture: "Chafado / trocitos", color: "#7C3AED" },
  4: { label: "Consolidación", texture: "Trozos / BLW", color: "#EA580C" },
};

function getMealsForDay(dss, approved, newFood) {
  if (dss < 0 || (!approved.length && !newFood)) return [];
  const phase = getPhase(dss);
  const pick = (arr, off) => arr.length ? arr[(dss + off) % arr.length] : null;
  const cereals = approved.filter(f => f.group === "cereal");
  const fruits = approved.filter(f => f.group === "fruta");
  const vegs = approved.filter(f => f.group === "verdura");
  const prots = approved.filter(f => f.group === "proteina");
  const legs = approved.filter(f => f.group === "legumbre");
  const dairy = approved.filter(f => f.group === "lacteo");
  const meals = [];

  if (newFood) meals.push({ type: "🆕 Nuevo", desc: `${newFood.name} solo/a — ${newFood.prep}`, isNew: true, foodNames: [newFood.name] });

  if (phase === 1) {
    if (!newFood && cereals.length) {
      const c = pick(cereals, 0), f = pick(fruits, 1);
      meals.push({ type: "🍽 Mediodía", desc: f ? `Papilla de ${c.name} con leche materna + ${f.name}` : `Papilla de ${c.name} con leche materna`, foodNames: f ? [c.name, f.name] : [c.name] });
    } else if (!newFood && fruits.length) {
      const f = pick(fruits, 0);
      meals.push({ type: "🍽 Mediodía", desc: `${f.name} triturada`, foodNames: [f.name] });
    }
  }
  if (phase >= 2) {
    const v1 = pick(vegs, 0), v2 = pick(vegs, 3), prot = pick(prots, 0), leg = pick(legs, 1);
    if (v1) {
      let lunch = `Puré de ${v1.name}`, names = [v1.name];
      if (v2 && v2.id !== v1.id) { lunch += ` + ${v2.name}`; names.push(v2.name); }
      if (phase >= 3 && prot && dss % 2 === 0) { lunch += ` + ${prot.name}`; names.push(prot.name); }
      else if (phase >= 3 && leg) { lunch += ` + ${leg.name}`; names.push(leg.name);
        const cit = fruits.find(f => ["Naranja","Mandarina","Fresa","Kiwi"].includes(f.name));
        if (cit) { lunch += ` (+ ${cit.name} para hierro)`; names.push(cit.name); }
      }
      meals.push({ type: "🥗 Comida", desc: lunch + " + AOVE", foodNames: names });
    }
    const f1 = pick(fruits, 2), f2 = pick(fruits, 5);
    if (f1) {
      const yogur = dairy.find(d => d.name === "Yogur natural");
      let snack, names;
      if (phase >= 4 && yogur && dss % 3 === 0) { snack = `${yogur.name} + ${f1.name}`; names = [yogur.name, f1.name]; }
      else if (f2 && f2.id !== f1.id) { snack = `${f1.name} + ${f2.name}`; names = [f1.name, f2.name]; }
      else { snack = f1.name; names = [f1.name]; }
      meals.push({ type: "🍓 Merienda", desc: snack, foodNames: names });
    }
  }
  if (phase >= 3) {
    const c = pick(cereals, 2), v = pick(vegs, 5), prot = pick(prots, 2), cheese = dairy.find(d => d.name === "Queso fresco");
    if (c && v) {
      let dinner = `${c.name} + ${v.name}`, names = [c.name, v.name];
      if (prot && dss % 2 === 1) { dinner += ` + ${prot.name}`; names.push(prot.name); }
      else if (cheese && dss % 3 === 2) { dinner += ` + ${cheese.name}`; names.push(cheese.name); }
      meals.push({ type: "🌙 Cena", desc: dinner + " + AOVE", foodNames: names });
    }
  }
  meals.push({ type: "🤱 Leche", desc: phase <= 2 ? "Pecho / biberón a demanda todo el día" : "Pecho entre comidas y antes de dormir", isMilk: true, foodNames: [] });
  return meals;
}

function getShoppingList(plan) {
  const counts = {};
  plan.forEach(day => {
    if (day.dss < 0) return;
    day.meals.forEach(meal => {
      if (meal.isMilk) return;
      (meal.foodNames || []).forEach(name => { counts[name] = (counts[name] || 0) + 1; });
    });
    if (day.introducing) counts[day.introducing.name] = (counts[day.introducing.name] || 0) + INTRO_DAYS;
  });
  const grouped = {};
  Object.entries(counts).forEach(([name, count]) => {
    const food = FOODS.find(f => f.name === name);
    const group = food ? food.group : "otro";
    if (!grouped[group]) grouped[group] = [];
    const { qty, detail } = calcShoppingQty(name, count);
    grouped[group].push({ name, count, qty, detail });
  });
  return grouped;
}

// ═══ MAIN ═══
export default function App() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const started = today >= START;
  const [winStart, setWinStart] = useState(started ? new Date(today) : new Date(START));
  const [selDay, setSelDay] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [tab, setTab] = useState("plan");
  const [checked, setChecked] = useState({});

  const plan = useMemo(() => {
    const days = [];
    for (let i = 0; i < 15; i++) {
      const date = addDays(winStart, i), dss = daysBetween(START, date);
      const approved = FOODS.filter(f => dss >= f.day + INTRO_DAYS);
      const introducing = FOODS.find(f => dss >= f.day && dss < f.day + INTRO_DAYS);
      days.push({ date, dss, approved, introducing, phase: getPhase(dss), meals: getMealsForDay(dss, approved, introducing) });
    }
    return days;
  }, [winStart]);

  const shopList = useMemo(() => { setChecked({}); return getShoppingList(plan); }, [plan]);
  const totalOk = useMemo(() => { const dss = daysBetween(START, today); return FOODS.filter(f => dss >= f.day + INTRO_DAYS).length; }, []);
  const nav = d => { setWinStart(p => addDays(p, d * 15)); setSelDay(null); setRecipe(null); };
  const goToday = () => { setWinStart(started ? new Date(today) : new Date(START)); setSelDay(null); };
  const toggleCheck = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));

  // Recipe view
  if (recipe) {
    const r = RECIPES[recipe];
    return (
      <div style={{ minHeight: "100vh", background: "#FFF8F0", fontFamily: "'Nunito','DM Sans','Segoe UI',sans-serif", color: "#1F2937" }}>
        <div style={{ background: "linear-gradient(135deg,#D97706,#EA580C)", padding: "16px 20px", color: "white", borderRadius: "0 0 20px 20px" }}>
          <button onClick={() => setRecipe(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>← Volver al plan</button>
          <div style={{ fontSize: 20, fontWeight: 800 }}>👩‍🍳 {r.title}</div>
          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 12, opacity: 0.9 }}><span>⏱ {r.time}</span><span>🍽 {r.portions}</span></div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#D97706", marginBottom: 8 }}>🧾 Ingredientes</div>
            {r.ingredients.map((ing, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < r.ingredients.length - 1 ? "1px dotted #E5E7EB" : "none" }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid #D97706", flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}>{ing}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: 14, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#059669", marginBottom: 8 }}>📝 Pasos</div>
            {r.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < r.steps.length - 1 ? "1px dotted #E5E7EB" : "none" }}>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#EFF6FF", border: "1px solid #2563EB30", borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", marginBottom: 4 }}>❄️ Batch cooking</div>
            <div style={{ fontSize: 12, color: "#1E40AF" }}>{r.batch}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#FFF8F0 0%,#FEF3E2 40%,#F0FDF4 100%)", fontFamily: "'Nunito','DM Sans','Segoe UI',sans-serif", color: "#1F2937" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0D9488,#059669)", padding: "18px 18px 14px", color: "white", borderRadius: "0 0 22px 22px", boxShadow: "0 4px 20px rgba(13,148,136,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, opacity: 0.8, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Alimentación complementaria</div>
            <div style={{ fontSize: 21, fontWeight: 800 }}>🍼 Mi bebé</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "5px 10px", fontSize: 11, fontWeight: 600 }}>{getAgeText(today)}</div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <Chip label="📅 4 Oct 2025" /><Chip label="🥄 Inicio: 4 Abr" /><Chip label={`✅ ${totalOk}/${FOODS.length}`} />
        </div>
        <div style={{ marginTop: 8, height: 5, background: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(totalOk / FOODS.length) * 100}%`, background: "rgba(255,255,255,0.8)", borderRadius: 3, transition: "width 0.5s" }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, padding: "8px 10px", background: "rgba(255,255,255,0.6)", margin: "8px 8px 0", borderRadius: 10 }}>
        {[{ id: "plan", l: "📋 Plan" }, { id: "foods", l: "🥗 Alimentos" }, { id: "shop", l: "🛒 Compra" }, { id: "info", l: "ℹ️ Normas" }].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelDay(null); }} style={{
            flex: 1, padding: "7px 2px", border: "none", borderRadius: 7, fontSize: 11, fontWeight: tab === t.id ? 700 : 500,
            background: tab === t.id ? "#0D9488" : "transparent", color: tab === t.id ? "white" : "#6B7280", cursor: "pointer",
          }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding: "6px 8px 24px" }}>
        {/* ═══ PLAN TAB ═══ */}
        {tab === "plan" && <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "6px 0 8px" }}>
            <NavBtn onClick={() => nav(-1)}>◀</NavBtn>
            <div style={{ textAlign: "center" }}>
              <button onClick={goToday} style={{ border: "1px solid #0D9488", background: "white", color: "#0D9488", borderRadius: 7, padding: "4px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>Hoy</button>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginTop: 3 }}>{formatDate(winStart)} — {formatDate(addDays(winStart, 14))}</div>
            </div>
            <NavBtn onClick={() => nav(1)}>▶</NavBtn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {plan.map((day, i) => {
              const isToday = day.date.toDateString() === today.toDateString(), isSel = selDay === i, ph = PHASE_INFO[day.phase], pre = day.dss < 0;
              return (
                <div key={i} onClick={() => setSelDay(isSel ? null : i)} style={{
                  background: isSel ? "white" : pre ? "#F9FAFB" : "white", borderRadius: 12, padding: "9px 11px", cursor: "pointer",
                  border: isToday ? "2px solid #0D9488" : isSel ? "2px solid #D97706" : "1px solid #E5E7EB",
                  boxShadow: isSel ? "0 4px 14px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.04)", opacity: pre ? 0.5 : 1,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: isToday ? "#0D9488" : ph.color + "18", color: isToday ? "white" : ph.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{day.date.getDate()}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>
                          {formatDate(day.date)}
                          {isToday && <span style={{ background: "#0D9488", color: "white", fontSize: 8, padding: "1px 5px", borderRadius: 4, marginLeft: 4 }}>HOY</span>}
                        </div>
                        <div style={{ fontSize: 10, color: "#9CA3AF" }}>{pre ? `Faltan ${-day.dss} días` : ph.label}</div>
                      </div>
                    </div>
                    {day.introducing && <div style={{ background: GROUP_META[day.introducing.group].bg, color: GROUP_META[day.introducing.group].color, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 5 }}>🆕 {day.introducing.name}</div>}
                  </div>
                  {isSel && !pre && <div style={{ marginTop: 8, borderTop: "1px solid #E5E7EB", paddingTop: 8 }}>
                    <div style={{ fontSize: 10, color: "#6B7280", marginBottom: 3 }}>📊 {day.approved.length} alimentos · {ph.texture}</div>
                    {day.introducing && <div style={{ background: "#FFFBEB", border: "1px solid #F59E0B40", borderRadius: 9, padding: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706" }}>🆕 {day.introducing.name}</div>
                      <div style={{ fontSize: 10, color: "#92400E", marginTop: 2 }}>{day.introducing.prep}</div>
                      <div style={{ fontSize: 9, color: "#B45309", marginTop: 2 }}>Día {day.dss - day.introducing.day + 1} de {INTRO_DAYS}</div>
                    </div>}
                    {day.meals.filter(m => !m.isMilk).map((meal, mi) => {
                      const rk = getRecipeForMeal(meal.desc);
                      return <div key={mi} style={{ padding: "4px 0", borderBottom: mi < day.meals.filter(m => !m.isMilk).length - 1 ? "1px dotted #E5E7EB" : "none" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, minWidth: 80, color: meal.isNew ? "#D97706" : "#374151" }}>{meal.type}</div>
                          <div style={{ fontSize: 11, color: "#4B5563", flex: 1 }}>{meal.desc}</div>
                        </div>
                        {rk && RECIPES[rk] && <button onClick={e => { e.stopPropagation(); setRecipe(rk); }} style={{ background: "#FFFBEB", border: "1px solid #D9770630", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 600, color: "#D97706", cursor: "pointer", marginTop: 3, marginLeft: 85 }}>👩‍🍳 Ver receta</button>}
                      </div>;
                    })}
                    <div style={{ fontSize: 10, color: "#0D9488", marginTop: 5, background: "#ECFDF5", padding: "4px 7px", borderRadius: 6 }}>🤱 {day.meals.find(m => m.isMilk)?.desc}</div>
                  </div>}
                  {!isSel && !pre && day.meals.length > 0 && <div style={{ marginTop: 3, display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {day.meals.filter(m => !m.isMilk).slice(0, 3).map((m, mi) => <span key={mi} style={{ fontSize: 9, color: "#6B7280", background: "#F3F4F6", padding: "1px 4px", borderRadius: 3 }}>{m.type.split(" ")[0]} {m.desc.split(" ").slice(0, 3).join(" ")}…</span>)}
                  </div>}
                </div>
              );
            })}
          </div>
        </>}

        {/* ═══ FOODS TAB ═══ */}
        {tab === "foods" && <FoodsTab today={today} />}

        {/* ═══ SHOPPING TAB ═══ */}
        {tab === "shop" && <div style={{ marginTop: 6 }}>
          <div style={{ background: "white", borderRadius: 12, padding: 12, marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0D9488", marginBottom: 3 }}>🛒 Lista de la compra</div>
            <div style={{ fontSize: 10, color: "#6B7280" }}>Cantidades estimadas para: {formatDate(winStart)} — {formatDate(addDays(winStart, 14))}</div>
            <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>Toca un ingrediente para tacharlo</div>
          </div>

          {/* Always */}
          <div style={{ background: "#ECFDF5", borderRadius: 10, padding: 10, marginBottom: 8, border: "1px solid #05966920" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 5 }}>📌 Siempre en casa</div>
            {["AOVE virgen extra (1 botella)", "Leche materna descongelada", "Vitamina D gotas (400 UI/día)"].map((item, i) => (
              <div key={i} onClick={() => toggleCheck(`always_${i}`)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", cursor: "pointer" }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, border: "2px solid #059669", background: checked[`always_${i}`] ? "#059669" : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>
                  {checked[`always_${i}`] && "✓"}
                </div>
                <span style={{ fontSize: 12, textDecoration: checked[`always_${i}`] ? "line-through" : "none", color: checked[`always_${i}`] ? "#9CA3AF" : "#374151" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* By group with real quantities */}
          {["fruta", "verdura", "cereal", "proteina", "legumbre", "lacteo", "grasa"].map(g => {
            const items = shopList[g]; if (!items?.length) return null;
            const meta = GROUP_META[g];
            return <div key={g} style={{ background: "white", borderRadius: 10, padding: 10, marginBottom: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: meta.color, marginBottom: 5 }}>{meta.emoji} {meta.label}</div>
              {items.sort((a, b) => b.count - a.count).map((item, i) => {
                const key = `${g}_${item.name}`;
                const done = checked[key];
                return <div key={i} onClick={() => toggleCheck(key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: i < items.length - 1 ? "1px dotted #E5E7EB" : "none", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${meta.color}`, background: done ? meta.color : "white", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>
                      {done && "✓"}
                    </div>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 600, textDecoration: done ? "line-through" : "none", color: done ? "#9CA3AF" : "#374151" }}>{item.name}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: done ? "#D1D5DB" : meta.color }}>{item.qty}</div>
                    <div style={{ fontSize: 9, color: "#9CA3AF" }}>{item.detail}</div>
                  </div>
                </div>;
              })}
            </div>;
          })}

          <div style={{ background: "#EFF6FF", borderRadius: 10, padding: 10, marginTop: 6, border: "1px solid #2563EB20" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 3 }}>💡 Consejos</div>
            <div style={{ fontSize: 11, color: "#1E40AF", lineHeight: 1.6 }}>
              • Las cantidades son orientativas — el bebé puede comer más o menos<br />
              • Fruta y verdura de temporada: más barata y sabrosa<br />
              • Puedes preparar purés en batch y congelar para toda la quincena<br />
              • Lentejas rojas: se deshacen solas, ideales para bebé<br />
              • Pescado: compra fresco y congela en raciones de 30g
            </div>
          </div>
        </div>}

        {/* ═══ INFO TAB ═══ */}
        {tab === "info" && <InfoTab />}
      </div>
    </div>
  );
}

function Chip({ label }) { return <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 7, padding: "3px 7px", fontSize: 10 }}>{label}</div>; }
function NavBtn({ onClick, children }) { return <button onClick={onClick} style={{ border: "none", background: "white", color: "#374151", borderRadius: 7, padding: "7px 15px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>{children}</button>; }

function FoodsTab({ today }) {
  const dss = daysBetween(START, today);
  return <div style={{ marginTop: 6 }}>
    {["cereal", "fruta", "verdura", "proteina", "legumbre", "lacteo", "grasa"].map(g => {
      const foods = FOODS.filter(f => f.group === g), meta = GROUP_META[g];
      return <div key={g} style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: meta.color, marginBottom: 4 }}>{meta.emoji} {meta.label}</div>
        {foods.map(f => {
          const ok = dss >= f.day + INTRO_DAYS, intro = dss >= f.day && dss < f.day + INTRO_DAYS;
          return <div key={f.id} style={{ background: ok ? meta.bg : intro ? "#FFFBEB" : "white", border: `1px solid ${ok ? meta.color + "30" : intro ? "#F59E0B40" : "#E5E7EB"}`, borderRadius: 9, padding: "6px 9px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
            <div><div style={{ fontSize: 11, fontWeight: 600 }}>{ok ? "✅" : intro ? "🔄" : "⏳"} {f.name}</div><div style={{ fontSize: 9, color: "#9CA3AF" }}>{f.prep}</div></div>
            <div style={{ fontSize: 9, fontWeight: 600, color: ok ? "#059669" : intro ? "#D97706" : "#9CA3AF" }}>{ok ? "Aprobado" : intro ? "En prueba" : formatDate(addDays(START, f.day))}</div>
          </div>;
        })}
      </div>;
    })}
  </div>;
}

function InfoTab() {
  const S = [
    { t: "⛔ Prohibidos hasta 12m", c: "#DC2626", b: "#FEF2F2", i: ["Sal, azúcar, miel, galletas", "Acelgas y espinacas (hasta 12m)", "Alimentos no pasteurizados", "Zumos, procesados", "Leche de vaca como bebida", "Atún y pez espada", "Ninguna carne (decisión familiar)"] },
    { t: "⚠️ Nunca crudos", c: "#D97706", b: "#FFFBEB", i: ["Manzana cruda", "Zanahoria cruda"] },
    { t: "✅ Reglas generales", c: "#059669", b: "#F0FDF4", i: ["Cada alimento nuevo: 2-3 días en solitario", "Cuchara siempre, biberón nunca", "Aliñar verduras con AOVE", "No forzar la ingesta", "Vitamina D: 400 UI/día", "Mínimo ½ litro leche/día", "Agua en vaso desde los 6 meses"] },
    { t: "🚨 Señales de alergia", c: "#DC2626", b: "#FEF2F2", i: ["Erupción, ronchas, urticaria", "Hinchazón de labios, cara, lengua", "Vómitos o diarrea inusual", "Dificultad respirar → URGENCIAS"] },
    { t: "🔑 Hierro sin carne", c: "#7C3AED", b: "#FAF5FF", i: ["Cereales fortificados con hierro", "Legumbres + vitamina C SIEMPRE", "Huevo (especialmente yema)", "Frutos secos triturados", "Analítica ferritina a los 9-12 meses"] },
    { t: "🚨 Atragantamiento", c: "#DC2626", b: "#FEF2F2", i: ["Si tose fuerte: NO intervenir", "Si NO tose: boca abajo, 5 golpes entre omóplatos", "Si no sale: girar boca arriba, 5 compresiones en pecho", "Alternar 5 golpes / 5 compresiones", "Si pierde consciencia → 112 + RCP", "NUNCA meter dedos a ciegas"] },
    { t: "❄️ Conservación", c: "#2563EB", b: "#EFF6FF", i: ["Nevera: máx 24-48 horas", "Congelador (-18°C): hasta 3 meses", "Descongelar en nevera la noche anterior", "NUNCA recongelar", "Leche materna: templar ≈37°C, nunca microondas"] },
  ];
  return <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 8 }}>
    {S.map((s, i) => <div key={i} style={{ background: s.b, border: `1px solid ${s.c}25`, borderRadius: 12, padding: "9px 11px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: s.c, marginBottom: 4 }}>{s.t}</div>
      {s.i.map((item, j) => <div key={j} style={{ fontSize: 11, color: "#374151", padding: "2px 0", borderBottom: j < s.i.length - 1 ? "1px dotted #E5E7EB" : "none" }}>• {item}</div>)}
    </div>)}
  </div>;
}
