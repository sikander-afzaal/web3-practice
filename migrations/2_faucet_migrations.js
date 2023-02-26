const FaucetContract = artifacts.require("Faucet");

module.exports = (deployer) => {
  deployer.deploy(FaucetContract);
};
