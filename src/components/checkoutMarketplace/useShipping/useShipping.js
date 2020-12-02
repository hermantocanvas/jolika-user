import React, { useState, useEffect } from 'react';
import axios from 'axios';
export const courrierInfo = {
  jne: {
    regular: { label: 'JNE Reg', value: 'JNE Regular' },
    nextDay: { label: 'JNE Next Day', value: 'JNE Next Day' },
  },
  jnt: {
    regular: {
      label: 'JNT Reg',
      value: 'JNT Regular',
    },
    nextDay: {
      label: 'JNT Next Day',
      value: 'JNT Next Day',
    },
  },
  sicepat: {
    regular: {
      label: 'Sicepat Reg',
      value: 'Sicepat Regular',
    },
    nextDay: {
      label: 'Sicepat Next Day',
      value: 'Sicepat Next Day',
    },
  },
  pos: {
    regular: {
      label: 'POS Reg',
      value: 'POS Regular',
    },
    nextDay: {
      label: 'POS Next Day',
      value: 'POS Next Day',
    },
  },
  rpx: {
    regular: {
      label: 'RPX Reg',
      value: 'RPX Regular',
    },
    nextDay: {
      label: 'RPX Next Day',
      value: 'RPX Next Day',
    },
  },
  rex: {
    regular: {
      label: 'REX Reg',
      value: 'REX Regular',
    },
    nextDay: {
      label: 'REX Next Day',
      value: 'REX Next Day',
    },
  },
  sap: {
    regular: {
      label: 'SAP Reg',
      value: 'SAP Regular',
    },
    nextDay: {
      label: 'SAP Next Day',
      value: 'SAP Next Day',
    },
  },
  dse: {
    regular: {
      label: 'DSE Reg',
      value: 'DSE Regular',
    },
    nextDay: {
      label: 'DSE Next Day',
      value: 'DSE Next Day',
    },
  },
  lion: {
    regular: {
      label: 'Lion Reg',
      value: 'Lion Regular',
    },
    nextDay: {
      label: 'Lion Next Day',
      value: 'Lion Next Day',
    },
  },
  jet: {
    regular: {
      label: 'JET Reg',
      value: 'JET Regular',
    },
    nextDay: {
      label: 'JET Next Day',
      value: 'JET Next Day',
    },
  },
  wahana: {
    regular: {
      label: 'Wahana Reg',
      value: 'Wahana Regular',
    },
    nextDay: {
      label: 'Wahana Next Day',
      value: 'Wahana Next Day',
    },
  },
  ninja: {
    regular: {
      label: 'Ninja Reg',
      value: 'Ninja Regular',
    },
    nextDay: {
      label: 'Ninja Next Day',
      value: 'Ninja Next Day',
    },
  },
};

const url = {
  jne: 'api/v1/shipping/getShippingFeeJne',
  sicepat: 'api/v1/shipping/getShippingFeeSicepat',
  pos: 'api/v1/shipping/getShippingFeePos',
  rpx: 'api/v1/shipping/getShippingFeeRpx',
  rex: 'api/v1/shipping/getShippingFeeRex',
  sap: 'api/v1/shipping/getShippingFeeSap',
  dse: 'api/v1/shipping/getShippingFeeDse',
  lion: 'api/v1/shipping/getShippingFeeLion',
  jet: 'api/v1/shipping/getShippingFeeJet',
  jnt: 'api/v1/shipping/getShippingFeeJnt',
  wahana: 'api/v1/shipping/getShippingFeeWahana',
  ninja: 'api/v1/shipping/getShippingFeeNinja',
};

export const courrierNames = [
  'jne',
  'sicepat',
  'pos',
  'rpx',
  'rex',
  'sap',
  'dse',
  'lion',
  'jet',
  'jnt',
  'wahana',
  'ninja',
];

export const group = [
  { type: 'regular', label: 'Regular', feeName: 'regularFee' },
  { type: 'nextDay', label: 'Next Day', feeName: 'nextDayFee' },
];

const useShipping = (originSubdistrictId, destinationSubdistrictId, weight) => {
  const [shippingData, setShippingData] = useState([]);

  useEffect(() => {
    if (destinationSubdistrictId) {
      loadAllShippingFee();
    } else {
      setShippingData([]);
    }
  }, [destinationSubdistrictId]);

  const loadAllShippingFee = () => {
    setShippingData([]);
    for (let courrierName of courrierNames) {
      loadShippingFee({
        courrierName,
      });
    }
  };

  const loadShippingFee = async ({ courrierName }) => {
    let formData = new FormData();
    formData.append('origin', originSubdistrictId);
    formData.append('destination', destinationSubdistrictId);
    formData.append('weight', weight);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}${url[courrierName]}`,
        formData
      );
      const data = res.data.data.rajaongkir.results[0].costs;
      const regularFee = data[0] ? data[0].cost[0].value : '';
      const nextDayFee = data[1] ? data[1].cost[0].value : '';

      if (destinationSubdistrictId) {
        setShippingData((s) => [
          ...s,
          { fee: regularFee, courrierName, type: 'regular' },
          { fee: nextDayFee, courrierName, type: 'nextDay' },
        ]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return [shippingData, courrierInfo, group, loadAllShippingFee];
};

export default useShipping;
