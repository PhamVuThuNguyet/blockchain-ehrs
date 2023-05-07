import api from '../config/api.conf';

export default notificationApi = {
  createNotification(data) {
    return api.post('/notifications', data);
  },
  getNotification(patientId) {
    return api.get('/notifications/' + patientId);
  }
}