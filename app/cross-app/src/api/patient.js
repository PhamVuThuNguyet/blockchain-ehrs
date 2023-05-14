import api from '../config/api.conf';

export default patientApi = {
  getProfile(username) {
    return api.get('/patients/' + username);
  },
  grantAccessToDoctor(patientId, doctorId, data) {
    return api.patch(`/patients/${patientId}/grant/${doctorId}`, data);
  },
  revokeAccessFromDoctor(patientId, doctorId, data) {
    return api.patch(`/patients/${patientId}/revoke/${doctorId}`, data);
  }
}