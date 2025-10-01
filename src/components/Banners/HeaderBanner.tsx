interface Props {
  imgCircles: string;
  maskSrc: string;
  alt?: string;
  className?: string;
}

export const CirclesImg = ({
  imgCircles,
  maskSrc,
  alt = "imagen circular",
  className,
}: Props) => {
  return (
    <div
      role="img"
      aria-label={alt}
      className="
        p-[3vw]
      "
    >
      <div
        className={`
            w-[80vw]
            max-w-[400px]
            aspect-square
            bg-center bg-cover bg-no-repeat
            block ${className}
        `}
        style={{
          backgroundImage: `url("${imgCircles}")`,
          maskImage: `url("${maskSrc}")`,
          maskRepeat: "no-repeat",
          maskPosition: "center",
          maskSize: "contain",
          WebkitMaskImage: `url("${maskSrc}")`,
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          WebkitMaskSize: "contain",
        }}
      />
    </div>
  );
};
