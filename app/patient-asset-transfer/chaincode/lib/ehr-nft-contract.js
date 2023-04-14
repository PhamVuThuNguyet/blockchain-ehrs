/* eslint-disable no-trailing-spaces */
/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const PrimaryContract = require('./primary-contract');

// Define objectType names for prefix
const nftPrefix = 'nft';

// Define key names for options
const nameKey = 'name';
const symbolKey = 'symbol';

class TokenERC721Contract extends PrimaryContract {

    /**
     * Set optional information for a token.
     *
     * @param {Context} ctx the transaction context
     * @param {String} name The name of the token
     * @param {String} symbol The symbol of the token
     */
    async Initialize(ctx, name, symbol) {
        console.info('============= START : Initialize Ledger ===========');

        // Check contract options are not already set, client is not authorized to change them once intitialized
        const nameBytes = await ctx.stub.getState(nameKey);
        if (nameBytes && nameBytes.length > 0) {
            throw new Error(
                'contract options are already set, client is not authorized to change them'
            );
        }

        await ctx.stub.putState(nameKey, Buffer.from(name));
        await ctx.stub.putState(symbolKey, Buffer.from(symbol));

        console.info('============= END : Initialize Ledger ===========');

        return true;
    }

    /**
     * OwnerOf finds the owner of a non-fungible token
     *
     * @param {Context} ctx the transaction context
     * @param {String} tokenId The identifier for a non-fungible token
     * @returns {String} Return the owner of the non-fungible token
     */
    async ownerOf(ctx, tokenId) {
        // Check contract options are already set first to execute the function
        await this.CheckInitialized(ctx);

        const nft = await this._readNFT(ctx, tokenId);
        const owner = nft.owner;
        if (!owner) {
            throw new Error('No owner is assigned to this token');
        }

        return owner;
    }

    // ============== ERC721 metadata extension ===============

    /**
     * Name returns a descriptive name for a collection of non-fungible tokens in this contract
     *
     * @param {Context} ctx the transaction context
     * @returns {String} Returns the name of the token
     */
    async contractName(ctx) {
        // Check contract options are already set first to execute the function
        await this.CheckInitialized(ctx);

        const nameAsBytes = await ctx.stub.getState(nameKey);
        return nameAsBytes.toString();
    }

    /**
     * Symbol returns an abbreviated name for non-fungible tokens in this contract.
     *
     * @param {Context} ctx the transaction context
     * @returns {String} Returns the symbol of the token
     */
    async contractSymbol(ctx) {
        // Check contract options are already set first to execute the function
        await this.CheckInitialized(ctx);

        const symbolAsBytes = await ctx.stub.getState(symbolKey);
        return symbolAsBytes.toString();
    }

    /**
     * TokenURI returns a distinct Uniform Resource Identifier (URI) for a given token.
     *
     * @param {Context} ctx the transaction context
     * @param {string} tokenId The identifier for a non-fungible token
     * @returns {String} Returns the URI of the token
     */
    async tokenURI(ctx, tokenId) {
        // Check contract options are already set first to execute the function
        await this.CheckInitialized(ctx);

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
        // Check contract options are already set first to execute the function
        await this.CheckInitialized(ctx);

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
    async mint(ctx, patientAddress, tokenId, tokenURI) {
        console.info('============= START : Mint EHR NFT ===========');

        // Check contract options are already set first to execute the function
        await this.CheckInitialized(ctx);

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

        // check contract options are already set first to execute the function
        await this.CheckInitialized(ctx);

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

    // Checks that contract options have been already initialized
    async CheckInitialized(ctx) {
        const nameBytes = await ctx.stub.getState(nameKey);
        if (!nameBytes || nameBytes.length === 0) {
            throw new Error(
                'contract options need to be set before calling any function, call Initialize() to initialize contract'
            );
        }
    }
}

module.exports = TokenERC721Contract;
