const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async (accounts) => {
    it("Owner allowed to withdraw balance", async () => {
        let instance = await People.new();
        await instance.createPerson("Johanna", 28, 165, {from: accounts[2],value: web3.utils.toWei("1", "ether")});
        await truffleAssert.passes(instance.withdrawAll({from: accounts[0]}));
    });
    it("Non-Owner cannot own", async () =>{
        let instance = await People.new();
        await instance.createPerson("Johanna", 28, 165, {from: accounts[2],value: web3.utils.toWei("1", "ether")});
        await truffleAssert.fails(instance.withdrawAll({from: accounts[2]}), truffleAssert.ErrorType.REVERT);
    });
    it("Owner balance should increase after withdrawal", async () =>{
        let instance = await People.new();
        await instance.createPerson("Johanna", 28, 165, {from: accounts[2],value: web3.utils.toWei("1", "ether")});

        let balanceBefore = parseFloat(await web3.eth.getBalance(accounts[0]));
        await instance.withdrawAll();
        let balanceAfter = parseFloat(await web3.eth.getBalance(accounts[0]));
        assert(balanceBefore < balanceAfter, "Owners balance does not increased after withdrawal");
    });
    it("should reset the balance after withdrawal", async ()=> {
        let instance = await People.new();
        await instance.createPerson("Johanna", 28, 165, {from: accounts[2],value: web3.utils.toWei("1", "ether")});

        await instance.withdrawAll();

        let balance = await instance.balance();
        let floatBalance = parseFloat(balance);

        let realBalance = await web3.eth.getBalance(instance.address);

        assert(floatBalance == web3.utils.toWei("0", "ether" && floatBalance == realBalance, "Contract balance was not 0 after withdrawal"));
    })