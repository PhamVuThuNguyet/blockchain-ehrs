/**
 * @author Nguyetpvt
 * @email pvtnguyet.19it1@vku.udn.vn
 * @desc [Doctor smart contract to read, update patient details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let Patient = require('./Patient.js');
const AdminContract = require('./admin-contract.js');
const PrimaryContract = require("./primary-contract.js");
const { Context } = require('fabric-contract-api');

class DoctorContract extends AdminContract {

    //Read patient details based on patientId
    async readPatient(ctx, patientId) {

        let asset = await PrimaryContract.prototype.readPatient(ctx, patientId)

        // Get the doctorID, retrieves the id used to connect the network
        const doctorId = await this.getClientId(ctx);
        // Check if doctor has the permission to read the patient
        const permissionArray = asset.permissionGranted;
        if (!permissionArray.includes(doctorId)) {
            throw new Error(`The doctor ${doctorId} does not have permission to patient ${patientId}`);
        }
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
            ehr: asset.ehr,
            publicKey: asset.publicKey,
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

    //This function is to update patient medical details. This function should be called by only doctor.
    async updatePatientMedicalDetails(ctx, args) {
        args = JSON.parse(args);
        let isDataChanged = false;
        let patientId = args.patientId;
        let newChiefComplaint = args.chiefComplaint;
        let HPI = args.HPI;
        let PMH = args.PMH;
        let physicalExamination = args.physicalExamination;
        let paraclinicalTests = args.paraclinicalTests;
        let diagnosis = args.diagnosis;
        let treatment = args.treatment;
        let updatedBy = args.changedBy;
        let ehr = args.ehr;
        let Timestamp = args.Timestamp;

        const patient = await PrimaryContract.prototype.readPatient(ctx, patientId);

        if (newChiefComplaint !== null && newChiefComplaint !== '' && patient.chiefComplaint !== newChiefComplaint) {
            patient.chiefComplaint = newChiefComplaint;
            isDataChanged = true;
        }

        if (HPI !== null && HPI !== '' && patient.HPI !== HPI) {
            patient.HPI = HPI;
            isDataChanged = true;
        }

        if (PMH !== null && PMH !== '' && patient.PMH !== PMH) {
            patient.PMH = PMH;
            isDataChanged = true;
        }

        if (physicalExamination !== null && physicalExamination !== '' && patient.physicalExamination !== physicalExamination) {
            patient.physicalExamination = physicalExamination;
            isDataChanged = true;
        }

        if (paraclinicalTests !== null && paraclinicalTests !== '' && patient.paraclinicalTests !== paraclinicalTests) {
            patient.paraclinicalTests = paraclinicalTests;
            isDataChanged = true;
        }

        if (diagnosis !== null && diagnosis !== '' && patient.diagnosis !== diagnosis) {
            patient.diagnosis = diagnosis;
            isDataChanged = true;
        }

        if (treatment !== null && treatment !== '' && patient.treatment !== treatment) {
            patient.treatment = treatment;
            isDataChanged = true;
        }

        if (updatedBy !== null && updatedBy !== '') {
            patient.changedBy = updatedBy;
        }

        if (ehr !== null && ehr !== '' && patient.ehr !== ehr) {
            patient.ehr = ehr;
            isDataChanged = true;
        }

        if (Timestamp !== null && Timestamp !== '') {
            patient.Timestamp = Timestamp;
            isDataChanged = true;
        }

        if (isDataChanged === false) return;

        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientId, buffer);
    }

    //Read patients based on lastname
    async queryPatientsByLastName(ctx, lastName) {
        return await super.queryPatientsByLastName(ctx, lastName);
    }

    //Read patients based on firstName
    async queryPatientsByFirstName(ctx, firstName) {
        return await super.queryPatientsByFirstName(ctx, firstName);
    }

    //Retrieves patient medical history based on patientId
    async getPatientHistory(ctx, patientId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(patientId);
        let asset = await this.getAllPatientResults(resultsIterator, true);

        return this.fetchLimitedFields(asset, true);
    }

    //Retrieves all patients details
    async queryAllPatients(ctx, doctorId) {
        let resultsIterator = await ctx.stub.getStateByRange('', '');
        let asset = await this.getAllPatientResults(resultsIterator, false);
        const permissionedAssets = [];
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            if ('permissionGranted' in obj.Record && obj.Record.permissionGranted.includes(doctorId)) {
                permissionedAssets.push(asset[i]);
            }
        }

        return this.fetchLimitedFields(permissionedAssets);
    }

    fetchLimitedFields = (asset, includeTimeStamp = false) => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                patientId: obj.Record.patientId,
                firstName: obj.Record.firstName,
                lastName: obj.Record.lastName,
                emergPhoneNumber: obj.Record.emergPhoneNumber,
                bloodGroup: obj.Record.bloodGroup,
                publicKey: obj.Record.publicKey,
                ehr: obj.Record.ehr,
                chiefComplaint: obj.Record.chiefComplaint,
                HPI: obj.Record.HPI,
                PMH: obj.Record.PMH,
                physicalExamination: obj.Record.physicalExamination,
                paraclinicalTests: obj.Record.paraclinicalTests,
                diagnosis: obj.Record.diagnosis,
                treatment: obj.Record.treatment,
            };
            if (includeTimeStamp) {
                asset[i].changedBy = obj.Record.changedBy;
                asset[i].Timestamp = obj.Timestamp;
            }
        }

        return asset;
    };


    /**
     * @param  {Context} ctx
     * @description Get the client used to connect to the network.
     */
    async getClientId(ctx) {
        const clientIdentity = ctx.clientIdentity.getID();
        // Ouput of the above - 'x509::/OU=client/CN=hosp1admin::/C=US/ST=North Carolina/L=Durham/O=hosp1.neuralmed.com/CN=ca.hosp1.neuralmed.com'
        let identity = clientIdentity.split('::');
        identity = identity[1].split('/')[2].split('=');
        return identity[1].toString('utf8');
    }
}
module.exports = DoctorContract;