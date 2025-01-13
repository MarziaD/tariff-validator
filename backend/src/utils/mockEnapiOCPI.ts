const getMockENAPITariffs = () => {
  return [
    {
      id: "1",
      region: "London",
      price_per_kwh: 0.28,
      parking_fee_per_hour: 3.0,
      connection_fee: 1.0,
    },
    {
      id: "2",
      region: "Manchester",
      price_per_kwh: 0.27,
      parking_fee_per_hour: 2.5,
      connection_fee: 1.0,
    },
    {
      id: "3",
      region: "Other",
      price_per_kwh: 0.25,
      parking_fee_per_hour: 2.0,
    },
  ];
};

module.exports = { getMockENAPITariffs };
