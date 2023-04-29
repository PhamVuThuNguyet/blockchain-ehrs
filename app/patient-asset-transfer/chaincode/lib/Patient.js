/**
 * @author Nguyetpvt
 * @email pvtnguyet.19it1@vku.udn.vn
 * @desc [The base patient class]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
const crypto = require('crypto');

class Patient {

    constructor(patientId, citizenId, firstName, lastName, password, sex, birth, phoneNumber, emergPhoneNumber, address, bloodGroup, ehrUrl, publicKey) {
        const patient = {};
        patient.patientId = patientId;
        patient.citizenId = citizenId;
        patient.firstName = firstName;
        patient.lastName = lastName;
        patient.password = crypto.createHash('sha256').update(password).digest('hex');
        patient.sex = sex;
        patient.birth = birth;
        patient.phoneNumber = phoneNumber;
        patient.emergPhoneNumber = emergPhoneNumber;
        patient.address = address;
        patient.bloodGroup = bloodGroup;
        patient.pwdTemp = true;
        patient.permissionGranted = [];
        patient.ehr = ehrUrl;
        patient.publicKey = publicKey;
        return patient;
    }
}
module.exports = Patient;