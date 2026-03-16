const contractAddress = "0x0276836Cb9dCe02D3a5D55b89D5518eBA9F44FE9";

const abi = [
  "function registrarManutencao(string,string,string,string)",
  "function totalManutencoes() view returns(uint256)",
  "function listarManutencao(uint256) view returns(uint256,string,string,string,string,uint256)",
];

let provider;
let signer;
let contract;

async function conectar() {
  if (!window.ethereum) {
    alert("MetaMask não instalada");
    return;
  }

  provider = new ethers.BrowserProvider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();

  contract = new ethers.Contract(contractAddress, abi, signer);

  document.getElementById("statusText").innerText = "Conectado";

  document.getElementById("statusDot").className = "dot green";
}

async function registrar() {
  const maquina = document.getElementById("maquina").value;
  const descricao = document.getElementById("descricao").value;
  const prioridade = document.getElementById("prioridade").value;
  const operador = document.getElementById("operador").value;

  if (!maquina || !descricao || !prioridade || !operador) {
    alert("Preencha todos os campos");

    return;
  }

  try {
    const tx = await contract.registrarManutencao(
      maquina,
      descricao,
      prioridade,
      operador
    );

    await tx.wait();

    alert("Manutenção registrada!");

    listar();
  } catch (error) {
    console.error(error);

    alert("Erro ao registrar");
  }
}

async function listar() {
  const lista = document.getElementById("lista");

  lista.innerHTML = "";

  const total = await contract.totalManutencoes();

  for (let i = 0; i < total; i++) {
    const m = await contract.listarManutencao(i);

    const card = document.createElement("div");

    card.className = "item";

    const data = new Date(Number(m[5]) * 1000).toLocaleString();

    card.innerHTML = `

<strong>ID:</strong> ${m[0]} <br>
<strong>Máquina:</strong> ${m[1]} <br>
<strong>Descrição:</strong> ${m[2]} <br>
<strong>Prioridade:</strong> ${m[3]} <br>
<strong>Operador:</strong> ${m[4]} <br>
<strong>Data:</strong> ${data}

`;

    lista.appendChild(card);
  }
}

document.getElementById("connectBtn").addEventListener("click", conectar);

document.getElementById("registrarBtn").addEventListener("click", registrar);

document.getElementById("listarBtn").addEventListener("click", listar);
