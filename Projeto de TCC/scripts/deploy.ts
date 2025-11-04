import { ethers } from "hardhat";

async function main() {
  const MaintenanceRegistry = await ethers.deployContract(
    "MaintenanceRegistry"
  );
  await MaintenanceRegistry.waitForDeployment();

  console.log("✅ Contrato implantado com sucesso!");
  console.log(`📄 Endereço: ${MaintenanceRegistry.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
