import { redirect } from "next/navigation";
import LoginForm from "./_components/LoginForm";
import Image from "next/image";

export default async function AuthPage() {
  const session = false;

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-2 min-h-screen px-4">
      <div className="lg:flex flex-col gap-4 text-center hidden items-center justify-center w-full h-full ">
        <h1 className="text-3xl font-bold uppercase">
          Welcome To BlueConnects
        </h1>
        <p className="text-lg ">
          You are about to access a Vcare corporation system. This computer
          system and the data therein are property of the Vcare corporation and
          its clients and provided for official information and use only. Access
          to this system is restricted to authorized users only. Unauthorized
          access, use, or modification of this computer system or of the data
          contained herein, or in transit to/from this system, may constitute a
          violation of federal or state criminal laws. Anyone who accesses a
          computer system without authorization or exceeds his or her access
          authority, or obtains, alters, damages, destroys, or discloses
          information, or prevents authorized use of information on the computer
          system, may be subject to administrative penalties, fines or
          imprisonment.
        </p>
      </div>
      <div className="flex items-center justify-center w-full h-full flex-col gap-4 ">
        <Image
          src="/blueconnectsLogo.png"
          alt="Logo"
          width={200}
          height={200}
        />
        <LoginForm />
      </div>
    </div>
  );
}
