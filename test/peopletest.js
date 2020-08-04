const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async function () {
    it("shouldn't create a person with age over 150 years", async function () {
        let instance = await People.deployed();
        await truffleAssert.fails(instance.createPerson("Bob", 200, 190, {
            value: web3.utils.toWei("1", "ether")
        }), truffleAssert.ErrorType.REVERT);
    });
});