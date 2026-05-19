const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy na rede Sepolia...");

  const RegistroManutencao = await ethers.getContractFactory(
    "RegistroManutencao"
  );
  const contrato = await RegistroManutencao.deploy();

  await contrato.waitForDeployment();

  const address = await contrato.getAddress();
  console.log("✅ Contrato implantado em:", address);

  // Lê o ABI gerado pelo Hardhat após a compilação
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/RegistroManut.sol/RegistroManutencao.json"
  );

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const jsonData = {
    address: address,
    network: "sepolia",
    abi: artifact.abi,
  };

  // Salva para o frontend
  const outputPath = path.join(__dirname, "../frontend/contractData.json");
  fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));

  console.log(" ABI + endereço salvos em frontend/contractData.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
