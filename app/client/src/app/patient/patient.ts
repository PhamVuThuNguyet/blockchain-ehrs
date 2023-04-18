export interface Timestamp {
  nanos: number;
  seconds: ISeconds;
}

export interface ISeconds {
  high: number;
  low: number;
  unsigned: boolean;
}

export interface PatientRecord {
  patientId: string;
  citizenId: string;
  firstName: string;
  lastName: string;
  address: string;
  sex: string;
  birth: string;
  emergPhoneNumber: string;
  phoneNumber: string;
  bloodGroup: string;
  allergies: boolean;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  followUp: string;
  description: string;
  docType: string;
  changedBy: string;
  Timestamp: Timestamp;
}

/*export interface ResRecord {
  Key: string;
  Record: PatientRecord;
}*/

export class PatientViewRecord {
  patientId = '';
  citizenId = '';
  firstName = '';
  lastName = '';
  address = '';
  sex = '';
  birth = '';
  emergPhoneNumber = '';
  phoneNumber = '';
  bloodGroup = '';
  allergies = false;
  symptoms = '';
  diagnosis = '';
  treatment = '';
  followUp = '';
  description = '';
  docType = '';
  changedBy = '';
  Timestamp = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.citizenId = patientRecord.citizenId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.address = patientRecord.address;
    this.sex = patientRecord.sex;
    this.birth = patientRecord.birth;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    this.phoneNumber = patientRecord.phoneNumber;
    this.bloodGroup = patientRecord.bloodGroup;
    this.allergies = patientRecord.allergies;
    this.symptoms = patientRecord.symptoms;
    this.diagnosis = patientRecord.diagnosis;
    this.treatment = patientRecord.treatment;
    this.followUp = patientRecord.followUp;
    this.description = patientRecord.description;
    this.docType = patientRecord.docType;
    this.changedBy = patientRecord.changedBy;
    this.Timestamp = patientRecord.Timestamp ? new Date(patientRecord.Timestamp.seconds.low * 1000).toDateString() : '';
  }
}

export class PatientAdminViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  docType = '';
  emergPhoneNumber = '';
  phoneNumber = '';

  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.docType = patientRecord.docType;
    this.emergPhoneNumber = patientRecord.emergPhoneNumber;
    this.phoneNumber = patientRecord.phoneNumber;
  }
}

export class PatientDoctorViewRecord {
  patientId = '';
  firstName = '';
  lastName = '';
  bloodGroup = '';
  allergies = false;
  symptoms = '';
  diagnosis = '';
  treatment = '';
  followUp = '';
  description = '';
  constructor(readonly patientRecord: PatientRecord) {
    this.patientId = patientRecord.patientId;
    this.firstName = patientRecord.firstName;
    this.lastName = patientRecord.lastName;
    this.bloodGroup = patientRecord.bloodGroup;
    this.allergies = patientRecord.allergies;
    this.symptoms = patientRecord.symptoms;
    this.diagnosis = patientRecord.diagnosis;
    this.treatment = patientRecord.treatment;
    this.followUp = patientRecord.followUp;
    this.description = patientRecord.description;
  }
}

export class DisplayVal {
  keyName: string | number | boolean;
  displayName: string;

  constructor(key: string | number | boolean, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}
