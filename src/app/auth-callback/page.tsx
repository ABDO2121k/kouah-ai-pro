import { onCompleteUserRegistrationGoogle } from "@/actions/auth";
import { Loader } from "@/components/loader";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// interface PageParams {
//   userType: "owner" | "student";
// }

export default async function SSOCallback() {
  // { params }: { params: PageParams }
  // const { userType } = params;
  const user = await currentUser();
  console.log({ user });
  if (user && user.id) {
    const response = await onCompleteUserRegistrationGoogle(
      user.emailAddresses[0]?.emailAddress || "",
      `${user.firstName} ${user.lastName}`,
      user.id,
      "owner"
    );
    console.log({ response });
    if (response.status !== 400) {
      redirect("/dashboard");
    } else {
      redirect("/");
    }
  }
  return (
    <div className="h-100 w-100 flex items-center justify-center">
      <Loader loading={true}>
        <>Loading ...</>
      </Loader>
    </div>
  );
}
