import api from '../config/api.conf';

export default doctorApi = {
  getDoctorsByHospitalId(hospitalId) {
    return api.get('/doctors/' + hospitalId + '/_all');
  }
}