/** @type import('hardhat/config').HardhatUserConfig */

require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades')
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");

const { secretKey } = require("./secret.json");


module.exports = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      blockGasLimit: 300000000000
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId : 97,
      accounts: [secretKey]
    },
    coverage: {
      url: 'http://localhost:8555',
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
};