const Notaria = artifacts.require("./Notaria.sol");
const CLPToken = artifacts.require("./CLPToken.sol");

module.exports = async function(deployer) {
  await deployer.deploy(CLPToken);
  const token = await CLPToken.deployed();
  await deployer.deploy(Notaria, token.address);
};

/*const CLPToken = artifacts.require("./CLPToken.sol");
const Tokenreceiver = artifacts.require("./TokenReceiver");

module.exports = async function(deployer) {
  await deployer.deploy(CLPToken);
  const token = await CLPToken.deployed();

  await deployer.deploy(Tokenreceiver, token.address);
};
*/
