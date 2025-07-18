
const hre = require("hardhat");

async function getBalance(address) {``
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}

async function main() {
  const [owner1, owner2] = await hre.ethers.getSigners();
  console.log("owner1:", owner1.address);
  console.log("owner2:", owner2.address);

  console.log("Deploying contract...");
  const IdeaRegistry = await hre.ethers.getContractFactory("IdeaRegistry");
const ideaRegistry = await IdeaRegistry.deploy(owner2.address);
await ideaRegistry.waitForDeployment();
const contractAddress = await ideaRegistry.getAddress();
  console.log("Contract deployed at:", contractAddress);


  // Simulate user (owner2) entering idea info
  const ideaTitle = "Decentralized Farming";
  const ideaDescription = "AI-powered crop disease detection";

  console.log("\n=== Initial ETH Balances ===");
  console.log("Owner1:", await getBalance(owner1.address), "ETH");
  console.log("Owner2:", await getBalance(owner2.address), "ETH");

  // owner2 (user) pays 0.001 ETH to register idea
  console.log("\n owner2 submitting and paying 0.001 ETH to owner1...");
  const tx = await ideaRegistry.connect(owner2).registerIdea(ideaTitle, ideaDescription, {
    value: hre.ethers.parseEther("0.001"),
  });
  await tx.wait();

  console.log(`\nIdea successfully registered by owner2 in tx: ${tx.hash}`);

  console.log("\n=== ETH Balances After Registration ===");
  console.log("Owner1:", await getBalance(owner1.address), "ETH");
  console.log("Owner2:", await getBalance(owner2.address), "ETH");

  const idea = await ideaRegistry.getIdea(0);
  console.log("\n=== Stored Idea Details (index 0) ===");
  console.log("Title:", idea.title);
  console.log("Description:", idea.description);
  console.log("Registered By:", idea.registeredBy);
  console.log("Paid Amount:", hre.ethers.formatEther(idea.paidAmount), "ETH");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
