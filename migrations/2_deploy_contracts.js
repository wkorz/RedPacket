// var MyContract = artifacts.require("./MyContract.sol");

//module.exports = function(deployer) {
  // deployer.deploy(MyContract);
//};
var nosecret = artifacts.require("./NoSecret.sol");
 
module.exports = function(deployer) {
  deployer.deploy(nosecret);
};
