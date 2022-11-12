const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)


describe('Documents Test', async () => { 
    let document, sender1, receiver1, sender2, receiver2;
    let docAddr_uri = "Sample_URI";
    beforeEach(async function () {
        const Document = await ethers.getContractFactory("Document");
        [sender1,receiver1,sender2,receiver2] = await ethers.getSigners()
        document = await Document.deploy();
    })
    // Test for the deployment
    describe("Deployment Test", () => {
        it("The noOfDocx should be zero", async function () {
            expect(await document.noOfDocs()).to.equal(0);
        })
        it("The Document length should be zero", async function () {
            expect(await document.documents.length).to.equal(0);
        })
    })

    // Test for adding a Document
    describe("Add Document Test", () => {
        it("The Client1 has sent a document to receiver1", async function () {
            // Connect with sender1
            await document.connect(sender1).addDocument(receiver1.address, "My Document", docAddr_uri);
            // The noOf Docx should increase to 1
            expect(await document.noOfDocs()).to.equal(1);
            // The Verified parameter should be false
            expect(await (await document.documents(0)).verified).to.equal(false);
            // The reciver should be receiver1
            expect(await (await document.documents(0)).receiver).to.equal(receiver1.address);
            // The URI Shoyld be the same
            expect(await (await document.documents(0)).doc_address).to.equal(docAddr_uri);
            // The Name should be the same
            expect(await (await document.documents(0)).name).to.equal("My Document");         
        })
        it("The Event should be emitted", async function () {
            await expect(await document.connect(sender1).addDocument(receiver1.address, "My Document", docAddr_uri)).to.emit(document, "AddedDoc").withArgs(sender1.address, receiver1.address);

        })
    })

    // Test for verifying the Document
    describe("Verify Document Test", () => {
        it("The receiver1 has verified the document sent by sender1", async function () {
            // Connect with sender1
            await document.connect(sender1).addDocument(receiver1.address, "my_doc", docAddr_uri);
            // Now the receiver1 
            await document.connect(receiver1).verifyDoc(docAddr_uri);
            // The verified should be true
            expect(await (await document.documents(0)).verified).to.equal(true)
        })
        it("The Event should be emitted", async function () {
            await document.connect(sender1).addDocument(receiver1.address, "my_doc", docAddr_uri);
            await expect(await document.connect(receiver1).verifyDoc(docAddr_uri)).to.emit(document,"Verified").withArgs(sender1.address,receiver1.address)
        })
    })

    // Test for revertions
    describe("Revertion Test", () => {
        it("The sender shouldn't send to him/herself", async function () {
            // This test should be reverted
            await (expect(document.connect(sender1).addDocument(sender1.address, "my-doc", docAddr_uri))).to.be.revertedWith("You cannot send the documents to yourself")
        })
        it("The reciver1 shouldn't be the client", async function () {
            // Connect with sender1
            await document.connect(sender1).addDocument(receiver1.address, "my-doc", docAddr_uri);
            // This test should be reverted
            await (expect(document.connect(sender1).verifyDoc(docAddr_uri))).to.be.revertedWith("You aren't allowed to verify");
            
        })
    })


 })