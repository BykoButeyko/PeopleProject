const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async function (accounts) {
    it("Should set senior status properly", async () => {
        let instance = await People.deployed();
        await instance.createPerson("Barbara", 65, 171, {
            value: web3.utils.toWei("1", "ether"),
            from: accounts[0]
        });
        let result = await instance.getPerson();
        assert(result.senior === true && result.age.toNumber() === 65, "Senior level not set");
    });
    it("Sholudn't be deleted by an another account owner", async () => {
        let instance = await People.deployed();
        await truffleAssert.fails(instance.deletePerson(accounts[0], {
                from: accounts[5]
            }),
            truffleAssert.ErrorType.REVERT);
    });
    it("Should be able to delete your own account", async () => {
        let instance = await People.deployed();
        let person = await instance.getPerson();
        await truffleAssert.passes(instance.deletePerson(accounts[5], {
            from: accounts[0]
        }))
        assert(person.age.toNumber() !== 0 && person.name !== '',
            "A person has to have setted name and age before this test is executed");
        await instance.deletePerson(accounts[0], {
            from: accounts[0]
        });
        person = await instance.getPerson();
        assert(person.age.toNumber() === 0 && person.name === '',
            "Delete person was not executed correctly");
    });
});