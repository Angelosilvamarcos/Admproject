(() => {
  const STYLE_ID = "conecta-public-enhancements";
  const BUTTON_ID = "conecta-acompanhar-btn";
  const MODAL_ID = "conecta-acompanhar-modal";

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BUTTON_ID}{margin-top:12px;width:100%;max-width:360px}
      #${MODAL_ID}{position:fixed;inset:0;background:rgba(2,12,20,.86);display:none;align-items:center;justify-content:center;padding:20px;z-index:99999}
      #${MODAL_ID}.open{display:flex}
      #${MODAL_ID} .cm-modal{width:min(460px,100%);background:#071b2b;border:1px solid #29445a;border-radius:18px;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,.45)}
      #${MODAL_ID} h2{margin:0 0 8px;color:#fff}
      #${MODAL_ID} p{color:#94a3b8;line-height:1.5}
      #${MODAL_ID} label{display:block;color:#cbd5e1;font-weight:700;margin:18px 0 8px}
      #${MODAL_ID} input{box-sizing:border-box;width:100%;padding:14px 15px;border-radius:10px;border:1px solid #36536b;background:#0b1e2d;color:#fff;font-size:16px;text-transform:uppercase}
      #${MODAL_ID} .cm-actions{display:flex;gap:10px;margin-top:18px}
      #${MODAL_ID} button{flex:1;padding:13px 16px;border-radius:10px;border:1px solid #36536b;cursor:pointer;font-weight:800}
      #${MODAL_ID} .cm-primary{background:#22d3ee;color:#061522;border-color:#22d3ee}
      #${MODAL_ID} .cm-ghost{background:transparent;color:#cbd5e1}
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    if (document.getElementById(MODAL_ID)) return;
    const modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div class="cm-modal" role="dialog" aria-modal="true" aria-labelledby="cm-title">
        <h2 id="cm-title">Acompanhar solicitação</h2>
        <p>Digite o número do protocolo recebido quando a solicitação foi registrada.</p>
        <label for="cm-protocolo">Número do protocolo</label>
        <input id="cm-protocolo" maxlength="30" placeholder="CT-123456" autocomplete="off" />
        <div class="cm-actions">
          <button type="button" class="cm-ghost" id="cm-cancelar">Cancelar</button>
          <button type="button" class="cm-primary" id="cm-consultar">Consultar solicitação</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const input = modal.querySelector("#cm-protocolo");
    const close = () => modal.classList.remove("open");
    const consult = () => {
      const protocolo = input.value.trim().toUpperCase();
      if (!protocolo) {
        input.focus();
        return;
      }
      window.location.href = `/protocolo/${encodeURIComponent(protocolo)}`;
    };

    modal.querySelector("#cm-cancelar").addEventListener("click", close);
    modal.querySelector("#cm-consultar").addEventListener("click", consult);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") consult();
      if (e.key === "Escape") close();
    });
    modal.addEventListener("click", e => {
      if (e.target === modal) close();
    });
  }

  function addButton() {
    if (document.getElementById(BUTTON_ID)) return;
    const candidates = [...document.querySelectorAll("button")];
    const abrir = candidates.find(b => b.textContent.trim().includes("Abrir uma solicitação"));
    if (!abrir) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.className = "btn ghost";
    button.type = "button";
    button.textContent = "Acompanhar uma solicitação";
    button.addEventListener("click", () => {
      createModal();
      const modal = document.getElementById(MODAL_ID);
      modal.classList.add("open");
      setTimeout(() => modal.querySelector("#cm-protocolo")?.focus(), 50);
    });

    abrir.insertAdjacentElement("afterend", button);
  }

  function init() {
    addStyles();
    createModal();
    addButton();
  }

  init();
  const observer = new MutationObserver(() => addButton());
  observer.observe(document.body, { childList: true, subtree: true });
})();
