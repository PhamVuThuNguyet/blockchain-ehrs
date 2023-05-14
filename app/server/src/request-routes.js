const Request = require('./models/Request.model.js');
const Notification = require('./models/Notification.model.js');
const { ROLE_ADMIN, ROLE_PATIENT, capitalize, getMessage, validateRole, ROLE_DOCTOR } = require('../utils.js');
const network = require('../../patient-asset-transfer/application-javascript/app.js');
const { REQUEST_STATUS } = require('./constants');

exports.requestToDoctor = async (req, res) => {
    try {
        const { patientId, doctorId } = req.body;
        const isExisted = await Request.findOne({ patientId, 'doctor.id': doctorId, status: REQUEST_STATUS.PENDING });
        if (isExisted) {
            res.status(409).send('Already request');
            return;
        }
        const hospitalId = +doctorId.split('-')[0].substr(4);
        const userRole = req.headers.role;
        // Set up and connect to Fabric Gateway
        await validateRole([ROLE_PATIENT, ROLE_DOCTOR, ROLE_ADMIN], userRole, res);
        const userId = hospitalId === 1 ? 'hosp1admin' : 'hosp2admin';
        const networkObj = await network.connectToNetwork(userId);
        const user = JSON.parse(await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:readPatient', patientId));
        if(user.permissionGranted && user.permissionGranted.includes(doctorId)) {
            res.status(400).send('Already grant');
            return;
        }
        // // Use the gateway and identity service to get all users enrolled by the CA
        const response = await network.getAllDoctorsByHospitalId(networkObj, hospitalId);
        const doctor = response.find((item) => item.id == doctorId);
        const newRequest = await Request.create({
            patientId,
            doctor,
            hospitalId,
        });
        res.json(newRequest);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

exports.getRequestOfPatient = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const requests = await Request.find({ patientId, status: REQUEST_STATUS.PENDING }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { patientId, doctorId, status } = req.body;
        const isExisted = await Request.findOne({ patientId, 'doctor.id': doctorId, status: REQUEST_STATUS.PENDING });
        if (!isExisted) {
            res.status(400).send('Request is not exist');
            return;
        }
        await Request.findOneAndUpdate({ patientId, 'doctor.id': doctorId, status: REQUEST_STATUS.PENDING }, { status });
        res.send();
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.createNotification = async (req, res) => {
    try {
        const { patientId, content } = req.body;
        const newNoti = await Notification.create({ patientId, content });
        res.json(newNoti);
    } catch (error) {
        res.sendStatus(500);
    }
};

exports.getNotificatonOfPatient = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const notifications = await Notification.find({ patientId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.sendStatus(500);
    }
};
