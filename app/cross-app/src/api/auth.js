import api from '../config/api.conf';

export default loginApi = {
  login(data) {
    return api.post('/login', data);
  }
}