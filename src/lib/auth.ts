export const generateOTP = () => {
  //otp generation 6 digit
  let otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};


