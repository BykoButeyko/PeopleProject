const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async (accounts) => {

    it("should increse the balance", async () => {
        let instance = await People.new();
        let balance = await web3.eth.getBalance(People.address);
        await instance.createPerson("David", 21, 175, {
            from: accounts[1],
            value: web3.utils.toWei("1", "ether")
        });
        let newBalance = await web3.eth.getBalance(People.address);
        await truffleAssert.passes(newBalance > balance, "Transaction failed");
    });

    it("shouldnt be withdrawed by anyone but owner", async () => {
        let instance = await People.new();
        await instance.createPerson("Monica", 44, 166, {
            from: accounts[1],
            value: web3.utils.toWei("1", "ether")
        });
        await truffleAssert.fails(instance.withdrawAll({
            from: accounts[1]
        }));
    });

    it("should be withdrawed by owner", async () => {
        let instance = await People.new();
        await instance.createPerson("Monica", 44, 166, {
            from: accounts[1],
            value: web3.utils.toWei("1", "ether")
        });
        await truffleAssert.passes(instance.withdrawAll({
            from: accounts[0]
        }));
        let finalBalance = await web3.eth.getBalance(People.address);
        await assert(parseInt(finalBalance) === 0, "Withdraw failed");
    });
});