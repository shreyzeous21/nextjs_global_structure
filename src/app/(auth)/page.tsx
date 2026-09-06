import { redirect } from "next/navigation";
import LoginForm from "./_components/LoginForm";
import NetworkSVG from "./_components/NetworkSVG";

export default async function AuthPage() {
  const session = false;

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="relative hidden w-[60%] overflow-hidden bg-gradient-to-br from-[#0A1128] via-[#1A2A6C] to-[#0A1128] lg:flex lg:flex-col lg:items-center lg:justify-center">
        {/* Animated network background */}
        <div className="absolute inset-0 opacity-40">
          <NetworkSVG />
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#00D2FF]/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#3A86FF]/10 blur-3xl" />

        <div className="relative z-10 max-w-xl px-12 text-center">
          <h1 className="mb-6 text-4xl font-bold uppercase tracking-wide text-white drop-shadow-lg">
            Welcome To BlueConnects
          </h1>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p className="text-sm italic leading-relaxed text-white/70">
              You are about to access a Vcare corporation system. This computer
              system and the data therein are property of the Vcare corporation
              and its clients and provided for official information and use
              only. Access to this system is restricted to authorized users
              only. Unauthorized access, use, or modification of this computer
              system or of the data contained herein, or in transit to/from this
              system, may constitute a violation of federal or state criminal
              laws. Anyone who accesses a computer system without authorization
              or exceeds his or her access authority, or obtains, alters,
              damages, destroys, or discloses information, or prevents
              authorized use of information on the computer system, may be
              subject to administrative penalties, fines or imprisonment.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 px-6 py-12 lg:w-[40%]">
        {/* Subtle decorative orbs */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#00D2FF]/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#3A86FF]/5 blur-3xl" />

        <LoginForm />
      </div>
    </div>
  );
}
