'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const expect = chai.expect;
const sinon = require('sinon');
const { ChaincodeStub } = require('fabric-shim');
const TokenERC721Contract = require('../lib/ehr-nft-contract');

describe('TokenERC721Contract', () => {
    let contract;
    let ctx;
    let chaincodeStub;

    beforeEach(() => {
        contract = new TokenERC721Contract();
        ctx = {
            stub: {},
        };
        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        chaincodeStub.getState.withArgs('name').resolves(Buffer.from('EHR NFT'));
        chaincodeStub.getState.withArgs('symbol').resolves(Buffer.from('NeuralMed'));
        ctx.stub = chaincodeStub;
    });


    describe('#OwnerOf', () => {
        it('should return the owner of the token', async () => {
            const tokenId = 'token001';
            const nft = { owner: 'patient001' };
            sinon.stub(contract, '_readNFT').resolves(nft);

            const result = await contract.ownerOf(ctx, tokenId);

            expect(result).to.equal(nft.owner);
        });

        it('should throw an error when the owner of the token is not found', async () => {
            const tokenId = 'token001';
            const nft = { owner: null };
            sinon.stub(contract, '_readNFT').resolves(nft);

            try {
                await contract.ownerOf(ctx, tokenId);
            } catch (error) {
                expect(error.message).to.equal('No owner is assigned to this token');
            }
        });
    });

    describe('#name', () => {
        it('should return the name of the contract', async () => {
            const result = await contract.contractName(ctx);

            expect(result).to.equal('EHR NFT');
        });
    });

    describe('#symbol', () => {
        it('should return the symbol of the contract', async () => {
            const result = await contract.contractSymbol(ctx);

            expect(result).to.equal('NeuralMed');
        });
    });

    describe('#TokenURI', () => {
        it('should return the URI of the token', async () => {
            const tokenId = 'token001';
            const nft = { tokenURI: 'http://example.com/nft/1' };
            sinon.stub(contract, '_readNFT').resolves(nft);

            const result = await contract.tokenURI(ctx, tokenId);

            expect(result).to.equal(nft.tokenURI);
        });
    });

    describe('#Mint', () => {
        it('should return the minted NFT', async () => {
            const patientAddress = '0x1d1211ed9a02D5Fcbc072c5787D0C221F62FA3C8';
            const tokenURI = 'https://www.youtube.com';
            const tokenID = '1';

            const result = await contract.mint(ctx, patientAddress, tokenID, tokenURI);

            const nft = {
                tokenId: parseInt(tokenID),
                owner: patientAddress,
                tokenURI: tokenURI,
            };
            sinon.stub(contract, '_readNFT').resolves(nft);

            expect(result).to.deep.equal(nft);
        });
        it('should return error when NFT is minted', async () => {
            const patientAddress = '0x1d1211ed9a02D5Fcbc072c5787D0C221F62FA3C8';
            const tokenURI = 'https://www.youtube.com';
            const tokenID = '1';

            await contract.mint(ctx, patientAddress, tokenID, tokenURI);

            const nft = {
                tokenId: parseInt(tokenID),
                owner: patientAddress,
                tokenURI: tokenURI,
            };
            sinon.stub(contract, '_readNFT').resolves(nft);

            try {
                await contract.mint(ctx, patientAddress, tokenID, tokenURI);
            } catch (error) {
                expect(error.message).to.equal(`The token ${tokenID} is already minted.`);
            }
        });
    });

    describe('#Burn', () => {
        it('should return true after burn', async () => {
            const patientAddress = '0x1d1211ed9a02D5Fcbc072c5787D0C221F62FA3C8';
            const tokenURI = 'https://www.youtube.com';
            const tokenID = '1';

            const nft = {
                tokenId: parseInt(tokenID),
                owner: patientAddress,
                tokenURI: tokenURI,
            };

            sinon.stub(contract, '_readNFT').resolves(nft);

            const result = await contract.burn(ctx, tokenID);
            expect(result).to.equal(true);
        });
    });

    describe('#TotalSupply', () => {
        it('should return the count of valid non-fungible tokens', async () => {
            const tokenID = '1';
            const nftPrefix = 'nft';
            const compositeKey = chaincodeStub.createCompositeKey(nftPrefix, [tokenID]);

            const iterator = {
                next: sinon.stub(),
            };
            iterator.next.onCall(0).resolves({ done: false, value: { key: compositeKey, value: Buffer.from('myNFT') } });
            iterator.next.onCall(1).resolves({ done: true });

            // Use the `returns` method instead of `resolves` to return a synchronous value
            chaincodeStub.getStateByPartialCompositeKey.withArgs(nftPrefix, []).returns(iterator);

            const result = await contract.TotalSupply(ctx);

            expect(result).to.equal(1);
        });
    });


});