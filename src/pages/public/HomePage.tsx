import { CirclesImg } from "@/components/Banners/HeaderBanner";
import mask01 from "@/assets/Masks/mask-15.svg";
import banner1 from "/Banners/banner1.jpg";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <section className="relative">
      <div className="top-0 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(109,218,124,0.5)] opacity-50 blur-[80px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d1d5db33_1px,transparent_1px),linear-gradient(to_bottom,#d1d5db33_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/3 top-1/3 h-[500px] w-[500px] rounded-full bg-primary opacity-20 blur-[120px]" />
      </div>
      <div className="container mx-auto min-h-screen flex flex-col-reverse lg:flex-row items-center justify-center gap-12 px-6 lg:px-12 py-16">
        {/* Texto */}
        <div className="flex-1 text-center lg:text-left space-y-6 z-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Lleva tu práctica médica al
            <span className="text-primary"> siguiente nivel</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
            Aprendizaje <span className="font-semibold">avanzado</span> en
            emergencias médicas para profesionales de la salud
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Button>Ver cursos</Button>
            <Button variant={"ghost"}>Saber más</Button>
          </div>
        </div>

        {/* Imagen */}
        <div className="flex-1 flex justify-center">
          <CirclesImg maskSrc={mask01} imgCircles={banner1} />
        </div>
      </div>
    </section>
  );
};

export default HomePage;
