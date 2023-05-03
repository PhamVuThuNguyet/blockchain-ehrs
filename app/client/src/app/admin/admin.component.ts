import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { PatientService } from '../patient/patient.service';
import {
  DisplayVal,
  PatientAdminViewRecord,
  PatientViewRecord,
} from '../patient/patient';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  public adminId: any;
  public patientRecords$?: Observable<Array<PatientAdminViewRecord>>;
  private sub?: Subscription;
  public headerNames = [
    new DisplayVal(PatientAdminViewRecord.prototype.patientId, 'Patient Id'),
    new DisplayVal(PatientAdminViewRecord.prototype.citizenId, 'Citizen Id'),
    new DisplayVal(PatientAdminViewRecord.prototype.firstName, 'First Name'),
    new DisplayVal(PatientAdminViewRecord.prototype.lastName, 'Last Name'),
    new DisplayVal(PatientAdminViewRecord.prototype.sex, 'Sex'),
    new DisplayVal(PatientAdminViewRecord.prototype.birth, 'Birth'),
    new DisplayVal(
      PatientAdminViewRecord.prototype.phoneNumber,
      'Phone Number'
    ),
    new DisplayVal(
      PatientAdminViewRecord.prototype.emergPhoneNumber,
      'Emergency Phone Number'
    ),
    new DisplayVal(PatientAdminViewRecord.prototype.address, 'Address'),
    new DisplayVal(PatientAdminViewRecord.prototype.bloodGroup, 'Blood Group'),
    new DisplayVal(PatientAdminViewRecord.prototype.publicKey, 'Public Key'),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params: Params) => {
      this.adminId = params.adminId;
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  public refresh(): void {
    this.patientRecords$ = this.patientService.fetchAllPatients();
  }
}
