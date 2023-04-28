/**
 * @author Nguyetpvt
 * @email pvtnguyet.19it1@vku.udn.vn
 * @desc [NFT Smart contract]
 */
/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const PrimaryContract = require('./primary-contract');

// Define objectType names for prefix
const nftPrefix = 'nft';

class TokenERC721Contract extends PrimaryContract {

    /**
     * OwnerOf finds the owner of a non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId The identifier for a non-fungible token
     * @returns {String} Return the owner of the non-fungible token
     */
    async ownerOf(ctx, tokenId) {
        const nft = await this._readNFT(ctx, tokenId);
        const owner = nft.owner;
        if (!owner) {
            throw new Error('No owner is assigned to this token');
        }

        return owner;
    }

    // ============== ERC721 metadata extension ===============



    /**
     * TokenURI returns a distinct Uniform Resource Identifier (URI) for a given token.
     *
     * @param {Context} ctx the transaction context
     * @param {string} tokenId The identifier for a non-fungible token
     * @returns {String} Returns the URI of the token
     */
    async tokenURI(ctx, tokenId) {
        const nft = await this._readNFT(ctx, tokenId);
        return nft.tokenURI;
    }

    // ============== ERC721 enumeration extension ===============

    /**
     * TotalSupply counts non-fungible tokens tracked by this contract.
     *
     * @param {Context} ctx the transaction context
     * @returns {Number} Returns a count of valid non-fungible tokens tracked by this contract,
     * where each one of them has an assigned and queryable owner.
     */
    async TotalSupply(ctx) {

        // There is a key record for every non-fungible token in the format of nftPrefix.tokenId.
        // TotalSupply() queries for and counts all records matching nftPrefix.*
        const iterator = await ctx.stub.getStateByPartialCompositeKey(
            nftPrefix,
            []
        );

        // Count the number of returned composite keys
        let totalSupply = 0;
        let result = await iterator.next();
        while (!result.done) {
            totalSupply++;
            result = await iterator.next();
        }
        return totalSupply;
    }

    // ============== Extended Functions ===============


    /**
     * Mint a new non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId Unique ID of the non-fungible token to be minted
     * @param {String} tokenURI URI containing metadata of the minted non-fungible token
     * @returns {Object} Return the non-fungible token object
     */
    async mint(ctx, args) {
        console.info('============= START : Mint EHR NFT ===========');

        args = JSON.parse(args);
        const patientAddress = args.patientAddress;
        const tokenId = args.tokenId;
        const tokenURI = args.tokenURI;

        // Add a non-fungible token
        const tokenIdInt = parseInt(tokenId);
        if (isNaN(tokenIdInt)) {
            throw new Error(
                `The tokenId ${tokenId} is invalid. tokenId must be an integer`
            );
        }

        // Check if the token to be minted does not exist
        const exists = await this._nftExists(ctx, tokenId);
        if (exists) {
            throw new Error(`The token ${tokenId} is already minted.`);
        }

        const nft = {
            tokenId: tokenIdInt,
            owner: patientAddress,
            tokenURI: tokenURI,
        };

        const nftKey = ctx.stub.createCompositeKey(nftPrefix, [tokenId]);
        await ctx.stub.putState(nftKey, Buffer.from(JSON.stringify(nft)));

        // Emit the Transfer event
        const transferEvent = {
            from: '0x0',
            to: patientAddress,
            tokenId: tokenId,
        };
        ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)));

        console.info('============= END : Mint EHR NFT ===========');

        return nft;
    }

    /**
     * Burn a non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId Unique ID of a non-fungible token
     * @returns {Boolean} Return whether the burn was successful or not
     */
    async burn(ctx, tokenId) {
        console.info('============= START : Burn EHR NFT ===========');

        // const owner = ctx.clientIdentity.getID();
        const tokenIdInt = parseInt(tokenId);

        const nft = await this._readNFT(ctx, tokenId);

        // Delete the token
        const nftKey = ctx.stub.createCompositeKey(nftPrefix, [tokenId]);
        await ctx.stub.deleteState(nftKey);

        // Emit the Transfer event
        const transferEvent = { from: nft.owner, to: '0x0', tokenId: tokenIdInt };
        ctx.stub.setEvent('Transfer', Buffer.from(JSON.stringify(transferEvent)));

        console.info('============= END : Burn EHR NFT ===========');

        return true;
    }

    async _readNFT(ctx, tokenId) {
        const nftKey = ctx.stub.createCompositeKey(nftPrefix, [tokenId]);
        const nftBytes = await ctx.stub.getState(nftKey);
        if (!nftBytes || nftBytes.length === 0) {
            throw new Error(`The tokenId ${tokenId} is invalid. It does not exist`);
        }
        const nft = JSON.parse(nftBytes.toString());
        return nft;
    }

    async _nftExists(ctx, tokenId) {
        const nftKey = ctx.stub.createCompositeKey(nftPrefix, [tokenId]);
        const nftBytes = await ctx.stub.getState(nftKey);
        return nftBytes && nftBytes.length > 0;
    }

}

module.exports = TokenERC721Contract;
