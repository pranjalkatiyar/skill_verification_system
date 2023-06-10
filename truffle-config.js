require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");

const { SEED_PHRASE, INFURA_KEY } = require("./seed-phrase");
const infuraKey =
"wss://goerli.infura.io/ws/v3/494e148542714a319b50a1e6c19771ef";
const seedPhrase =
  "lucky fat march discover scout total rocket shine festival return ethics grit";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none,
    },
    goerli: {
      provider: () => new HDWalletProvider(seedPhrase, infuraKey),
      network_id: 5,
      gas: 5500000,
      confirmations: 2,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
  plugins: ["truffle-contract-size"],
};
