const { ethers } = require("hardhat"); //import the hardhat

async function main() {
  const YourContract = await ethers.getContractFactory('SocialMedia'); // Replace 'YourContract' with the name of your contract
  const contract = await YourContract.deploy();

  await contract.deployed();

  console.log('Contract deployed to:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
