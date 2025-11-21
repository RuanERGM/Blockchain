// =======================
// Variáveis principais
// =======================
let contrato;
let provider;
let signer;

const contractJsonPath = "contractData.json";
const TARGET_CHAIN_ID = 11155111; // Sepolia
const TARGET_CHAIN_ID_HEX = "0xaa36a7";

// =======================
// Usuário logado
// =======================
let usuarioLogado = null;

function carregarUsuario() {
  usuarioLogado = localStorage.getItem("usuarioLogado");

  // Se o usuário NÃO está logado e não está na página de login → volta pro login
  if (!usuarioLogado && !window.location.href.includes("login.html")) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = "login.html";
    return;
  }

  // Se existir o elemento para exibir o nome do usuário
  const userLabel = document.getElementById("userName");
  if (userLabel && usuarioLogado) {
    userLabel.textContent = usuarioLogado;
  }

  console.log("Usuário logado:", usuarioLogado);
}

// =======================
// Status visual da rede
// =======================
function setStatus(text, dotColor = "yellow") {
  const statusText = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");
  if (statusText) statusText.textContent = text;
  if (statusDot) {
    statusDot.classList.remove("yellow", "green", "red");
    statusDot.classList.add(dotColor);
  }
}

// =======================
// Troca para Sepolia
// =======================
async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: TARGET_CHAIN_ID_HEX }],
    });

    setStatus("Rede Sepolia selecionada", "green");
  } catch (err) {
    console.error("Erro ao mudar rede:", err);
    alert("Não foi possível mudar para Sepolia.");
    setStatus("Rede incorreta", "red");
    throw err;
  }
}

// =======================
// Conectar MetaMask
// =======================
async function connectMetaMask() {
  try {
    if (!window.ethereum) {
      alert("MetaMask não encontrada!");
      setStatus("MetaMask ausente", "red");
      return;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    let network = await provider.getNetwork();
    console.log("Chain atual:", network.chainId);

    if (network.chainId !== TARGET_CHAIN_ID) {
      await switchToSepolia();
      network = await provider.getNetwork();
    }

    const data = await fetch(contractJsonPath + "?_=" + Date.now()).then((r) =>
      r.json()
    );

    if (!data.address || !data.abi)
      throw new Error("contractData.json inválido.");

    contrato = new ethers.Contract(data.address, data.abi, signer);

    const code = await provider.getCode(data.address);
    if (!code || code === "0x") {
      setStatus("Contrato inválido", "red");
      alert("Contrato não encontrado na rede.");
      return;
    }

    setStatus("Conectado à Sepolia", "green");
  } catch (err) {
    console.error("Erro ao conectar:", err);
    setStatus("Erro de conexão", "red");
    alert("Erro: " + (err.message || err));
  }
}

// =======================
// Registrar Manutenção
// =======================
async function registrarManutencao() {
  if (!contrato) return alert("Conecte à MetaMask primeiro!");

  const descricao = document.getElementById("descricao")?.value;
  const dataInput = document.getElementById("data")?.value;
  const prioridade = document.getElementById("prioridade")?.value;

  const operador = usuarioLogado; // 🔥 Agora pega o usuário automaticamente

  if (!descricao || !dataInput)
    return alert("Preencha todos os campos obrigatórios!");

  const timestamp = Math.floor(new Date(dataInput).getTime() / 1000);

  try {
    const tx = await contrato.registrar(
      descricao,
      timestamp,
      prioridade,
      operador
    );

    document.getElementById("resultado").innerText = "⏳ Enviando transação...";

    await tx.wait();

    document.getElementById(
      "resultado"
    ).innerText = `✅ Registrado: ${tx.hash}`;
  } catch (err) {
    console.error("Erro ao registrar:", err);
    document.getElementById("resultado").innerText = `❌ Erro: ${
      err.message || err
    }`;
  }
}

// =======================
// Listar Manutenções
// =======================
async function listarManutencoes() {
  if (!contrato) return alert("Conecte à MetaMask primeiro!");

  try {
    const total = await contrato.totalManutencoes();
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    for (let i = 0; i < total; i++) {
      const m = await contrato.listarManutencao(i);

      const descricao = m[0];
      const data = new Date(Number(m[1]) * 1000).toLocaleDateString("pt-BR");
      const prioridade = m[2];
      const operador = m[3] ?? "—";

      const prioridadeClasse = prioridade.toLowerCase();

      lista.innerHTML += `
        <div class="card-item">
          <div class="card-title">${descricao}</div>
          <div class="card-date">📅: ${data}</div>
          <div class="card-op">👷: ${operador}</div>
          <span class="badge ${prioridadeClasse}">${prioridade}</span>
        </div>
      `;
    }
  } catch (err) {
    console.error("Erro ao listar:", err);
    alert("Erro ao listar manutenções.");
  }
}

// =======================
// Eventos da página
// =======================
document.addEventListener("DOMContentLoaded", () => {
  // Só verifica login se NÃO estiver na página de login
  if (!window.location.href.includes("login.html")) {
    carregarUsuario();
  }

  const connectBtn = document.getElementById("connectBtn");
  const registrarBtn = document.getElementById("registrarBtn");
  const listarBtn = document.getElementById("listarBtn");

  if (connectBtn) connectBtn.onclick = connectMetaMask;
  if (registrarBtn) registrarBtn.onclick = registrarManutencao;
  if (listarBtn) listarBtn.onclick = listarManutencoes;
});

document.getElementById("voltarBtn").addEventListener("click", () => {
  window.location.href = "login.html";
});
