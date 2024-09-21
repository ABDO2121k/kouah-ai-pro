import OTPInput from "@/components/otp";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  onOTP: string;
  setOTP: Dispatch<SetStateAction<string>>;
};
const OtpForm = ({onOTP,setOTP}:Props) => {
  return <>
  <h2 className="text-gravel md:text-sm font-bold">Enter Otp</h2>
  <p className="text-iridium md:text-sm">Enter the one time password that was sent to your email</p>
  <div className="w-full justify-center flex py-5">
    <OTPInput otp={onOTP} setOTP={setOTP}/>
  </div>
  </>
};

export default OtpForm;
