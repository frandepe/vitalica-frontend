import { CirclesImg } from "@/components/Banners/HeaderBanner";
import mask01 from "@/assets/Masks/mask-15.svg";
import banner1 from "/Banners/banner1.jpg";
import { Button } from "@/components/ui/button";
import { Award, Heart, Users } from "lucide-react";

const HomePage = () => {
  return (
    <section className="relative">
      <div className="top-0 h-full w-full bg-white dark:bg-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,218,124,0.5)] opacity-50 blur-[80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d1d5db33_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db33_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/3 top-1/3 h-[500px] w-[500px] rounded-full bg-primary opacity-20 blur-[120px]" />
      </div>
      <div className="container h-[92vh] mx-auto flex flex-col-reverse lg:flex-row items-center justify-center px-6">
        <div className="flex-1 text-center lg:text-left space-y-6 z-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Lleva tu práctica médica al
            <span className="text-primary"> siguiente nivel</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto lg:mx-0">
            Aprendizaje <span className="font-semibold">avanzado</span> en
            emergencias médicas para profesionales de la salud
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button>Ver cursos</Button>
            <Button variant={"ghost"}>Saber más</Button>
          </div>
        </div>

        <div className="flex-1 flex justify-center relative">
          <CirclesImg maskSrc={mask01} imgCircles={banner1} />

          {/* Top floating stat card */}
          <div className="absolute -top-1 right-0 lg:right-1 bg-white dark:bg-card p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-border z-20 hidden md:block">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-xl">
                <Heart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">
                  Cursos online
                </p>
                <p className="font-bold text-2xl text-gray-900 dark:text-foreground">
                  20+
                </p>
              </div>
            </div>
          </div>

          {/* Bottom left stat card */}
          <div className="absolute bottom-0 left-0 lg:left-1 bg-white dark:bg-card p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-border z-20 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-muted-foreground font-medium">
                  Instructores
                </p>
                <p className="font-bold text-2xl text-gray-900 dark:text-foreground">
                  10+
                </p>
              </div>
            </div>
          </div>

          {/* Right side badge */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 lg:right-1 bg-white dark:bg-card p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-border z-20 hidden sm:block">
            <Award className="w-7 h-7 text-primary" />
          </div>
        </div>
      </div>
      <div className="h-[700px] bg-red-700">cards</div>
    </section>
  );
};

export default HomePage;
