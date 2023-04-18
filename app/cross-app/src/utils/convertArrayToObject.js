const convertArrayToObject = (data, key = 'id') => {
  const obj = {};
  data.forEach((item) => {
    obj[item[key]] = item;
  });

  return obj;
};

export default convertArrayToObject;