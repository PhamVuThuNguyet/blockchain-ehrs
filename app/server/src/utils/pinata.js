require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const JWT = process.env.PINATA_JWT;

const upload = async (data, type = 'patient') => {
  const formData = new FormData();
  const src = `upload/${type}/${Date.now()}.json`;
  fs.writeFileSync(src, data);

  const file = fs.createReadStream(src);
  formData.append('file', file);

  // Neural@med#2023
  try {
    const { data } = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    fs.unlinkSync(src);
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  upload,
};
