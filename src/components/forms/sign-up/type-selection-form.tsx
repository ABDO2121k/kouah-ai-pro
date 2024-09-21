import { SetStateAction } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import UserTypeCard from "./user-type-card";

type Props = {
  register: UseFormRegister<FieldValues>;
  userType: "owner" | "student";
  setUserType: React.Dispatch<SetStateAction<"owner" | "student">>;
};

const TypeSelection = ({ register, userType, setUserType }: Props) => {
  return (
    <>
      <h2 className="text-gravel md:text-4xl font-bold"> Create an account</h2>
      <p className="text-iridium md:text-sm">
        Tell us about yourself! what you do ? let&apos;s tailor your <br />{" "}
        experince so it best suits you.
      </p>
      <UserTypeCard register={register} setUserType={setUserType}  title="I own a business" text="Setting up my account for my company." value="owner" userType={userType}/>
      <UserTypeCard register={register} setUserType={setUserType}  title="I am a student" text="Setting up my account for my education." value="student" userType={userType}/>

    </>
  );
};

export default TypeSelection;
