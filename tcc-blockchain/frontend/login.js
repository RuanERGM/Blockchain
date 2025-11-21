// Recupera usuários salvos ou cria lista vazia
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// BOTÕES
const btnLogin = document.getElementById("btnLogin");
const btnCadastrar = document.getElementById("btnCadastrar");

// LOGIN
btnLogin.addEventListener("click", () => {
  const nome = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  // Verifica se existe
  const user = usuarios.find((u) => u.nome === nome && u.senha === senha);

  if (!user) {
    alert("Usuário ou senha incorretos!");
    return;
  }

  // Salva usuário ativo
  localStorage.setItem("usuarioLogado", nome);

  // Vai para a tela de manutenção
  window.location.href = "home.html";
});

// CADASTRO
btnCadastrar.addEventListener("click", () => {
  const nome = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!nome || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  // Verifica duplicação
  const existe = usuarios.some((u) => u.nome === nome);

  if (existe) {
    alert("Usuário já existente!");
    return;
  }

  // Cria novo usuário
  usuarios.push({ nome, senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  alert("Usuário cadastrado com sucesso!");
});
