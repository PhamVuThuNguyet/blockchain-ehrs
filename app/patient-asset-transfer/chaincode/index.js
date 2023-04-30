/**
 * @author Nguyetpvt
 * @email pvtnguyet.19it1@vku.udn.vn
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const PrimaryContract = require('./lib/primary-contract.js');
const AdminContract = require('./lib/admin-contract.js');
const PatientContract = require('./lib/patient-contract.js');
const DoctorContract = require('./lib/doctor-contract.js');
const TokenERC721Contract = require('./lib/ehr-nft-contract.js');

module.exports.contracts = [PrimaryContract, AdminContract, DoctorContract, PatientContract, TokenERC721Contract];
