import api from '../config/api.conf';

export default requestApi = {
  updateRequest(data) {
    return api.patch('/requests', data);
  },
  getRequests(patientId) {
    return api.get('/requests/' + patientId);
  }
}