const People = artifacts.require("People");
const truffleAssert = require("truffle-assertions");

contract("People", async function () {
    it("shouldn't create a person with age over 150 years", async function () {
        let instance = await People.deployed();
        await truffleAssert.fails(instance.createPerson("Bob", 200, 190, {
            value: web3.utils.toWei("1", "ether")
        }), truffleAssert.ErrorType.REVERT);
    });
    it("shouldn't create a person without a payment", async function () {
        let instance = await People.deployed();
        await truffleAssert.fails(instance.createPerson("Bob", 50, 190, {
            value: 1000
        }), truffleAssert.ErrorType.REVERT);
    });
    it("should set all people properties correctly", async function () {
        let instance = await People.deployed();
        await instance.createPerson("Bob", 65, 190, {
            value: web3.utils.toWei("1", "ether")
        })
        let result = await instance.getPerson();
        assert(result.senior === true && result.age.toNumber() === 65, "Senior level not set");
    });
    it("should set age correctly", async function(){
        let instance = await People.deployed();
        let result = await instance.getPerson();
        assert(result.age.toNumber() === 65, "Age not set correctly");
    });
});



contract("People", async function(accounts){
    it("Sholudn't be deleted by an another account owner", async ()=>{
        let instance = await People.deployed();
        await instance.createPerson("Bob", 65, 190, {value: web3.utils.toWei("1", "ether"), from: accounts[0]});
        await truffleAssertions.fails(instance.deletePerson(accounts[0], {from: accounts[3]}),
        truffleAssert.ErrorType.REVERT);
    });
    it("Should be able to delete your own account", async ()=>{
        let instance = await People.deployed();
        let person = await instance.getPerson();
        assert(person.age.toNumber() !==4 && person.name !== '',
        "A person has to have setted name and age before this test is executed");
        await instance.deletePerson(accounts[0], {from: accounts[0]});
        person = await instance.getPerson();
        assert(person.age.toNumber() === 0 && person.name === '',
        "Delete person was not executed correctly");
    });
});