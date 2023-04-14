/**
 * @author Nguyetpvt
 * @email pvtnguyet.19it1@vku.udn.vn
 * @desc [The base patient class]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

const crypto = require('crypto');

class Patient {

    constructor(patientId, citizenId, firstName, lastName, password, sex, birth, phoneNumber, emergPhoneNumber, address, bloodGroup) {
        this.patientId = patientId;
        this.citizenId = citizenId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = crypto.createHash('sha256').update(password).digest('hex');
        this.sex = sex;
        this.birth = birth;
        this.phoneNumber = phoneNumber;
        this.emergPhoneNumber = emergPhoneNumber;
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.pwdTemp = true;
        this.permissionGranted = [];
        this.ehr = null;
        return this;
    };
}
module.exports = Patient