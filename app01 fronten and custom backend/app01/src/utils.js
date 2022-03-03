import moment from 'moment';
import {getDistance, getPreciseDistance} from 'geolib';
export const calculateDiscountPercent = (product_price, selling_price) => {
  return (((product_price - selling_price) * 100) / product_price).toFixed(2);
};
export const calculateProductQuantity = (id, products) => {
  return products.find((e) => e._id === id).quantity;
};
export const formatDate = (date) => {
  return moment(date).format('hh:mm |  MMM DD');
};

export const calculateTotals = (total, charge, discount) => {
  return (total + charge - discount / 100).toFixed(2);
};
export const totalDiscount = (orders) => {
  return orders.reduce((acc, curr) => {
    return acc + ((curr.total + curr.charges) * curr.discount_percent) / 100;
  }, 0);
};
export const getRelativeDistance = (loc1, loc2) => {
  return (getDistance(loc1, loc2) / 1000).toFixed(2) + ' km';
};
export const parseOpenTime = (times) => {
  let status = 'Closed';
  times.forEach((day) => {
    let time1 = moment(day.day + ' ' + day.open_time, 'dddd hh:mm a');
    let time2 = moment(day.day + ' ' + day.closed_time, 'dddd hh:mm a');
    let now = moment();
    if (now.isBetween(time1, time2)) {
      status = 'Open';
    }
  });
  return status;
};
