const sex = {
  M: 'Male',
  F: 'Female'
}

export default convertProfile = (profile) => {
  return {
    name: `${profile.firstName} ${profile.lastName}`,
    info: [
      [
        {
          key: "Birth",
          value: profile.birth,
        },
        {
          key: "Gender",
          value: sex[profile.sex],
        },
        {
          key: "Address",
          value: profile.address,
        },
        {
          key: "Phone",
          value: profile.phoneNumber,
        },
        {
          key: "Email",
          value: "",
        },
      ],
      [
        {
          key: "Blood type",
          value: profile.bloodGroup,
        },
        {
          key: "Weight",
          value: "",
        },
        {
          key: "Height",
          value: "",
        },
      ],
      [
        {
          key: "EHR Create date",
          value: "",
        },
        {
          key: "Last update",
          value: "",
        },
      ],
    ],
  };
};
