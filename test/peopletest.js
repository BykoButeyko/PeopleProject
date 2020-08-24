const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async (accounts) => {

    let instance;

    beforeEach(async () => {
        instance = await People.deployed();
    });

    it("shouldn't create a person with age over 150 years", async function () {
        await truffleAssert.fails(instance.createPerson("Bob", 200, 190, {
            value: web3.utils.toWei("1", "ether")
        }), truffleAssert.ErrorType.REVERT);
    });
    it("shouldn't create a person without a payment", async function () {
        await truffleAssert.fails(instance.createPerson("Bob", 50, 190, {
            value: 1000
        }), truffleAssert.ErrorType.REVERT);
    });
    it("should set all people properties correctly", async function () {
        await instance.createPerson("Bob", 65, 190, {
            value: web3.utils.toWei("1", "ether")
        })
        let result = await instance.getPerson();
        assert(result.senior === true && result.age.toNumber() === 65, "Senior level not set");
    });
    it("should set age correctly", async function () {
        let result = await instance.getPerson();
        assert(result.age.toNumber() === 65, "Age not set correctly");
    });
    it("Should set senior status properly", async () => {
        await instance.createPerson("Barbara", 65, 171, {
            value: web3.utils.toWei("1", "ether"),
            from: accounts[0]
        });
        let result = await instance.getPerson();
        assert(result.senior === true && result.age.toNumber() === 65, "Senior level not set");
    });
    it("Sholudn't be deleted by an another account owner", async () => {
        await truffleAssert.fails(instance.deletePerson(accounts[0], {
                from: accounts[5]
            }),
            truffleAssert.ErrorType.REVERT);
    });
    it("Should be able to delete your own account", async () => {
        let instance = await People.new();
        await instance.createPerson("Bob", 65, 190, {
            value: web3.utils.toWei("1", "ether"),
            from: accounts[0]
        });
        let person = await instance.getPerson();
        await truffleAssert.passes(instance.deletePerson(accounts[0], {
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
