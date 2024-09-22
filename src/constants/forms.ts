type UserRegistrationProps = {
  id: string;
  type: "email" | "text" | "password";
  inputType: "select" | "input" | "textarea";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  name: string;
  lines?: number;
};

export const USER_REGISTRATION_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Full name",
    name: "fullname",
    type: "text",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "3",
    inputType: "input",
    placeholder: "Confirm Email",
    name: "confirmEmail",
    type: "email",
  },
  {
    id: "4",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
  {
    id: "5",
    inputType: "input",
    placeholder: "Confrim Password",
    name: "confirmPassword",
    type: "password",
  },
];

export const USER_LOGIN_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your email",
    name: "email",
    type: "email",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];

export const USER_GENERALE_FORM: UserRegistrationProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Please enter a chatbot Name",
    name: "title",
    type: "text",
    label: "Name",
  },
  {
    id: "2",
    inputType: "textarea",
    placeholder:
      "Please write the purpose of the chatbot (role, the uses , what do you need it to do ....)",
    label: "Description",
    name: "description",
    type: "text",
    lines: 4,
  },
];
