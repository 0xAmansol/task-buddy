import { CheckSquare2Icon } from "lucide-react";

import Image from "next/image";
import { GoogleLogin } from "@/components/Login";

import { Card, CardContent } from "@/components/ui/card";

const circles = [
  {
    size: "w-[834px] h-[834px]",
    top: "top-0",
    left: "left-0",
    opacity: "opacity-50",
  },
  {
    size: "w-[706px] h-[706px]",
    top: "top-[54px]",
    left: "left-[50px]",
    opacity: "opacity-50",
  },
  {
    size: "w-[561px] h-[561px]",
    top: "top-[124px]",
    left: "left-[123px]",
    opacity: "",
  },
];
const Login = () => {
  return (
    <main className="relative w-full min-h-screen bg-[#f9f9ff] overflow-hidden justify-center md:justify-start">
      <div className="md:absolute w-[1045px] h-[834px] top-[41px]  left-[400px] xl:left-[920px] bg-[#f9f9ff] hidden md:flex">
        {/* Decorative Circles */}
        <div className="absolute w-[834px] h-[834px] top-0 left-0">
          <div className="relative h-[834px] rounded-[417.18px]">
            {circles.map((circle, index) => (
              <div
                key={index}
                className={`${circle.size} ${circle.top} ${circle.left} rounded-[417.18px] ${circle.opacity} absolute border-[0.73px] border-solid border-[#7b1984]`}
              />
            ))}
          </div>
        </div>

        {/* App Screenshot */}
        <div className="flex 2xl:absolute  w-[1069px] h-[789px] top-[0px] 2xl:top-[10px] left-[400px] lg:left-[200px] ">
          <Image
            className="absolute w-[1069px] h-[789px] top-0 -left-1"
            alt="Task management interface preview"
            src="/task-list-preview.png"
            width={1069}
            height={789}
          />
        </div>
      </div>

      {/* Login Section */}
      <Card className="absolute w-[366px] border-none bg-transparent shadow-none top-[150px] 2xl:top-[350px] left-[123px] 2xl:left-[350px] justify-center md:justify-start">
        <CardContent className="p-0">
          <div className="flex flex-col gap-7">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <CheckSquare2Icon className="w-8 h-8 text-[#7b1984] " />
                <h1 className="font-bold text-[26.2px] text-[#7b1984]">
                  TaskBuddy
                </h1>
              </div>

              <p className="text-[14.6px] leading-[19.3px] text-slate-600 font-medium max-w-[400px] justify-center md:justify-start">
                Streamline your workflow and track progress effortlessly with
                our all-in-one task management app.
              </p>
            </div>

            {/* Google Login Button */}
            <div>
              <GoogleLogin />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;
