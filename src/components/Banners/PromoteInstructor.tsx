import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  instructors?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const PromoteInstructor = ({
  heading = "Lleva tu perfil al siguiente nivel",
  description = "Completa tu registro como instructor y empieza a crear cursos que inspiren a otros profesionales. Tu conocimiento merece ser compartido",
  button = {
    text: "¡Empezar ahora!",
    url: "https://www.shadcnblocks.com",
  },
  instructors = {
    count: 20,
    avatars: [
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-1.webp",
        alt: "Avatar 1",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-2.webp",
        alt: "Avatar 2",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-3.webp",
        alt: "Avatar 3",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-4.webp",
        alt: "Avatar 4",
      },
      {
        src: "https://www.shadcnblocks.com/images/block/avatar-5.webp",
        alt: "Avatar 5",
      },
    ],
  },
}: Hero7Props) => {
  return (
    <section className="">
      <div className="container text-center">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
          <h1 className="text-3xl font-extrabold lg:text-6xl">{heading}</h1>
          <p className="text-balance text-muted-foreground lg:text-lg">
            {description}
          </p>
        </div>
        <Button asChild size="lg" className="mt-10">
          <a href={button.url}>{button.text}</a>
        </Button>
        <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row">
          <span className="mx-4 inline-flex items-center -space-x-4">
            {instructors.avatars.map((avatar, index) => (
              <Avatar key={index} className="size-14 border">
                <AvatarImage src={avatar.src} alt={avatar.alt} />
              </Avatar>
            ))}
          </span>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-left font-medium text-muted-foreground">
              con {instructors.count}+ instructores
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PromoteInstructor };
