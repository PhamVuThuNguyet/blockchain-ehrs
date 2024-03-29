/**
 * @author Nguyetpvt
 * @email pvtnguyet.19it1@vku.udn.vn
 * @desc [Primary smart contract to initiate ledger with patient details]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Contract } = require('fabric-contract-api');
let initPatients = require('./initLedger.json');

class PrimaryContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        for (let i = 0; i < initPatients.length; i++) {
            initPatients[i].docType = 'patient';
            await ctx.stub.putState('PID' + i, Buffer.from(JSON.stringify(initPatients[i])));
            console.info('Added <--> ', initPatients[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    //Read patient details based on patientId
    async readPatient(ctx, patientId) {
        const exists = await this.patientExists(ctx, patientId);
        if (!exists) {
            throw new Error(`The patient ${patientId} does not exist`);
        }

        const buffer = await ctx.stub.getState(patientId);
        let asset = JSON.parse(buffer.toString());
        asset = ({
            patientId: patientId,
            citizenId: asset.citizenId,
            firstName: asset.firstName,
            lastName: asset.lastName,
            sex: asset.sex,
            birth: asset.birth,
            phoneNumber: asset.phoneNumber,
            emergPhoneNumber: asset.emergPhoneNumber,
            address: asset.address,
            bloodGroup: asset.bloodGroup,
            permissionGranted: asset.permissionGranted,
            password: asset.password,
            pwdTemp: asset.pwdTemp,
            ehr: asset.ehr,
            publicKey: asset.publicKey,
            privateKey: asset.privateKey,
            chiefComplaint: asset.chiefComplaint,
            HPI: asset.HPI,
            PMH: asset.PMH,
            physicalExamination: asset.physicalExamination,
            paraclinicalTests: asset.paraclinicalTests,
            diagnosis: asset.diagnosis,
            treatment: asset.treatment,
        });
        return asset;
    }

    async patientExists(ctx, patientId) {
        const buffer = await ctx.stub.getState(patientId);
        return (!!buffer && buffer.length > 0);
    }

    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        console.info('getQueryResultForQueryString <--> ', resultsIterator);
        let results = await this.getAllPatientResults(resultsIterator, false);
        return JSON.stringify(results);
    }

    async getAllPatientResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.Timestamp = res.value.timestamp;
                }
                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('End of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
}
module.exports = PrimaryContract;