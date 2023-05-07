import api from '../config/api.conf';

export default patientApi = {
  getProfile(username) {
    return api.get('/patients/' + username);
  },
  grantAccessToDoctor(patientId, doctorId) {
    return api.patch(`/patients/${patientId}/grant/${doctorId}`);
  },
  revokeAccessFromDoctor(patientId, doctorId) {
    return api.patch(`/patients/${patientId}/revoke/${doctorId}`);
  }
}