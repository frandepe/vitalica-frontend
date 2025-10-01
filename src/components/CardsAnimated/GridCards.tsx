import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

interface Props {
  Icon: React.ElementType;
  title: string;
  description: string;
}

export function GridCards({ Icon, title, description }: Props) {
  return (
    <section>
      <Card className="group bg-gray-50 p-4">
        <CardHeader className="pb-3">
          <CardDecorator>
            <Icon className="size-6" aria-hidden />
          </CardDecorator>
          <h3 className="mt-6 font-medium">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{description}</p>
        </CardContent>
      </Card>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    <div className="bg-gray absolute inset-0 m-auto flex size-12 items-center justify-center">
      {children}
    </div>
  </div>
);
