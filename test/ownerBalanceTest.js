const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async (accounts) => {

    it("shouldn't delete person if not called by contract owner", async () => {
        let instance = await People.deployed();
        await instance.createPerson("Kata", 29, 170, {
            value: web3.utils.toWei("1", "ether"),
            from: accounts[1]
        });
        await truffleAssert.fails(instance.deletePerson(accounts[1], {
            from: accounts[1]
        }), truffleAssert.ErrorType.REVERT);
    });

    it("should delete person if called by contract owner", async () => {
        let instance = await People.deployed();
        await instance.createPerson("Kata", 29, 170, {
            value: web3.utils.toWei("1", "ether"),
            from: accounts[1]
        });
        await truffleAssert.passes(instance.deletePerson(accounts[1], {
            from: accounts[0]
        }));
    });
})