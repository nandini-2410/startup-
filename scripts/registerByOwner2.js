
const hre = require("hardhat");

async function getBalance(address) {
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

  console.log("\n=== Initial ETH Balances ===");
  console.log("Owner1:", await getBalance(owner1.address), "ETH");
  console.log("Owner2:", await getBalance(owner2.address), "ETH");

  console.log("\nOwner2 submitting idea and paying 0.001 ETH...");
  const tx = await ideaRegistry.connect(owner2).registerIdea(
    "Decentralized Farming",                     // ideaTitle
    "AI-powered crop disease detection",         // ideaDescription
    "3 years in agri-tech",                      // experience
    50000,                                       // minFunding
    { value: hre.ethers.parseEther("0.01") }    // payment
  );
  await tx.wait();
  console.log(`Idea registered in tx: ${tx.hash}`);

  console.log("\n=== ETH Balances After Registration ===");
  console.log("Owner1:", await getBalance(owner1.address), "ETH");
  console.log("Owner2:", await getBalance(owner2.address), "ETH");

  const ideas = await ideaRegistry.getIdeasByUser(owner2.address);
  console.log("\n=== Stored Ideas by Owner2 ===");
  ideas.forEach((idea, idx) => {
    console.log(`\n[${idx}] Title: ${idea.ideaTitle}`);
    console.log(`Description: ${idea.ideaDescription}`);
    console.log(`Experience: ${idea.experience}`);
    console.log(`Min Funding: ${idea.minFunding}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
