import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import mask from "@/assets/Masks/mask-13.svg";
import { CirclesImg } from "./Banners/HeaderBanner";

interface TextImageProps {
  title: string;
  description?: string;
  imageSrc: string;
  buttonPrimary: {
    label: string;
    href: string;
  };
  buttonSecondary: {
    label: string;
    href: string;
  };
}

export const TextImage = ({
  title = "Blocks built with Shadcn & Tailwind",
  description = "Hundreds of finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  imageSrc = "https://shadcnblocks.com/images/block/placeholder-1.svg",
  buttonPrimary = {
    label: "Get Started",
    href: "https://shadcnblocks.com",
  },
  buttonSecondary = {
    label: "Learn More",
    href: "https://shadcnblocks.com",
  },
}: TextImageProps) => {
  const navigate = useNavigate();
  return (
    <section className="py-32 mx-auto">
      <div className="grid items-center gap-8 2xl:grid-cols-2">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="my-6 mt-0 text-4xl font-semibold text-balance lg:text-5xl">
            {title}
          </h1>
          <p className="mb-8 max-w-xl text-muted-foreground lg:text-lg">
            {description}
          </p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
            <Button onClick={() => navigate(buttonPrimary.href)}>
              {buttonPrimary.label}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(buttonSecondary.href)}
            >
              {buttonSecondary.label}
            </Button>
          </div>
        </div>
        <CirclesImg maskSrc={mask} imgCircles={imageSrc} />
      </div>
    </section>
  );
};
