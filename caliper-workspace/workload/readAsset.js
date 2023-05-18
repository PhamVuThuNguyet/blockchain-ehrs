"use strict";

const { WorkloadModuleBase } = require("@hyperledger/caliper-core");

class MyWorkload extends WorkloadModuleBase {
  constructor() {
    super();
  }

  async initializeWorkloadModule(
    workerIndex,
    totalWorkers,
    roundIndex,
    roundArguments,
    sutAdapter,
    sutContext
  ) {
    await super.initializeWorkloadModule(
      workerIndex,
      totalWorkers,
      roundIndex,
      roundArguments,
      sutAdapter,
      sutContext
    );

    for (let i = 0; i < this.roundArguments.assets; i++) {
      const args = {
        citizenId: "0123123123",
        firstName: "Ho-Thanh",
        lastName: "Phong",
        address: "Danang",
        sex: "M",
        birth: "2001-07-06",
        phoneNumber: "0123123123",
        emergPhoneNumber: "0123123123",
        bloodGroup: "A+",
        chiefComplaint: null,
        HPI: null,
        PMH: null,
        physicalExamination: null,
        paraclinicalTests: null,
        diagnosis: null,
        treatment: null,
        patientId: "PID3",
        password: "17dfwnyx",
        changedBy: "hosp1admin",
        ipfsHash: "QmPtHfKw4pb5KNW8S3FoxXw8ycXPpsxzhWw7PNCsjtQsvV",
        publicKey: "0x3aa599bf91a161d141084b4bf9b8bca5d30c0860",
        privateKey:
          "0x128e99cf7fd00a1949244f065d0ec5662f3c2bb5773876baf8912e03503a788c",
      };
      // const ID = Math.floor(Math.random() * 10000 + 2);
      // args.patientId = "PID" + ID;
      const request = {
        contractId: this.roundArguments.contractId,
        contractFunction: "createPatient",
        invokerIdentity: "User1",
        contractArguments: [args],
        readOnly: false,
      };

      await this.sutAdapter.sendRequests(request);
    }
  }

  async submitTransaction() {
    // NOOP
    const patientId = "PID2";
    const myArgs = {
      contractId: this.roundArguments.contractId,
      contractFunction: "readPatient",
      invokerIdentity: "User1",
      contractArguments: [patientId],
      readOnly: true,
    };

    await this.sutAdapter.sendRequests(myArgs);
  }

  async cleanupWorkloadModule() {
    for (let i = 0; i < this.roundArguments.assets; i++) {
      const patientId = `PID2`;
      const request = {
        contractId: this.roundArguments.contractId,
        contractFunction: "deletePatient",
        invokerIdentity: "User1",
        contractArguments: [patientId],
        readOnly: false,
      };

      await this.sutAdapter.sendRequests(request);
    }
  }
}

function createWorkloadModule() {
  return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
