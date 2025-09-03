/* ====== DADOS (adicione novas operadoras aqui) ====== */
const dadosOperadoras = {
  amil: {
    nome: "Amil",
    materiais: [
      // use links reais; a presença do "download" no <a> tenta forçar baixar
      { titulo: "Guia de Planos", categoria: "Comercial", ano: "2024", link: "arquivos/amil/guia-planos-2024.pdf" },
      { titulo: "Tabela de Preços", categoria: "Tabela", ano: "2024", link: "arquivos/amil/tabela-precos-2024.xlsx" },
      { titulo: "Manual do Corretor", categoria: "Manual", ano: "2023", link: "arquivos/amil/manual-corretor-2023.pdf" }
    ],
    faq: [
      { pergunta: "Como solicitar reembolso?", resposta: "Acesse o portal Amil, menu 'Reembolso', e siga o passo a passo." },
      { pergunta: "Prazo de carência?", resposta: "Depende do plano; confira a cartilha ou a proposta do cliente." }
    ]
  },
  bradesco: {
    nome: "Bradesco Saúde",
    materiais: [
      { titulo: "Cartilha Comercial", categoria: "Cartilha", ano: "2024", link: "arquivos/bradesco/cartilha-comercial.pdf" },
      { titulo: "Tabela PME", categoria: "Tabela", ano: "2023", link: "arquivos/bradesco/tabela-pme.xlsx" }
    ],
    faq: [
      { pergunta: "Como incluir dependente?", resposta: "Pelo Portal do Corretor, em 'Gestão de Vidas' → 'Inclusão'." }
    ]
  },
  // Ex.: só seguir exemplo pra adicionar outra operadora
   sulamerica: { nome: "SulAmérica", 
   materiais: [
    { titulo: "Rede Credenciada", categoria: "Rede", ano: "2025", link: "..."}
  ],
    faq: [
      {pergunta: "Quais são as vigências?", resposta: "a resposta bla bla bla bla" }] }
};


const params = new URLSearchParams(window.location.search);
const operadoraKey = (params.get("name") || "").toLowerCase();

function extDoLink(href = "") {
  try {
    const p = new URL(href, window.location.href).pathname;
    const e = p.split(".").pop();
    return e ? e.toUpperCase() : "ARQ";
  } catch {
    const e = href.split(".").pop();
    return e ? e.toUpperCase() : "ARQ";
  }
}

/* ====== RENDER ====== */
document.addEventListener("DOMContentLoaded", () => {
  const dados = dadosOperadoras[operadoraKey];
  const titulo = document.getElementById("operadora-nome");

  if (!dados) {
    titulo.textContent = "Operadora não encontrada";
    document.getElementById("materiais-grid").innerHTML =
      '<p style="opacity:.7">Nenhum material para esta operadora.</p>';
    document.getElementById("faq-list").innerHTML =
      '<p style="opacity:.7">Nenhuma dúvida cadastrada.</p>';
    return;
  }

  titulo.textContent = dados.nome;

  // Materiais → cards estilo portfólio
  const grid = document.getElementById("materiais-grid");
  grid.innerHTML = "";
  dados.materiais.forEach((m) => {
    const ext = extDoLink(m.link);
    const a = document.createElement("a");
    a.href = m.link;
    a.target = "_blank";
    a.rel = "noopener";
    a.download = ""; // tenta baixar quando possível
    a.className = "portfolio-card";
    a.innerHTML = `
      <div class="file-thumb" aria-hidden="true">
        <span class="file-ext">${ext}</span>
      </div>
      <div class="portfolio-info">
        <h3>${m.titulo}</h3>
        <p>${m.categoria} • ${m.ano}</p>
      </div>
    `;
    grid.appendChild(a);
  });

  // FAQ → acordeão
  const faq = document.getElementById("faq-list");
  faq.innerHTML = "";
  dados.faq.forEach((q, i) => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = `
      <button class="faq-question" aria-expanded="false" aria-controls="ans-${i}">
        <span>${q.pergunta}</span>
        <svg class="chevron" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div id="ans-${i}" class="faq-answer" hidden>
        <p>${q.resposta}</p>
      </div>
    `;
    faq.appendChild(item);
  });

  // Tabs
  const btns = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-content");
  btns.forEach((b) =>
    b.addEventListener("click", () => {
      btns.forEach((x) => x.classList.remove("active"));
      panes.forEach((p) => p.classList.remove("active"));
      b.classList.add("active");
      document.getElementById(b.dataset.tab).classList.add("active");
    })
  );

  // Acordeão FAQ
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      const ans = btn.nextElementSibling;
      if (expanded) {
        ans.setAttribute("hidden", "");
        btn.parentElement.classList.remove("open");
      } else {
        ans.removeAttribute("hidden");
        btn.parentElement.classList.add("open");
      }
    });
  });
});

document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach(i => {
      i.classList.remove("open");
      i.querySelector(".faq-icon").textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("open");
      btn.querySelector(".faq-icon").textContent = "–";
    }
  });
});
