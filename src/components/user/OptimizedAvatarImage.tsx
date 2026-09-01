import type { ImgHTMLAttributes } from "react";
import { getAvatarDeliveryProps } from "@/utils/avatar-url";

interface OptimizedAvatarImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  source?: string | null;
  displaySize: number;
  fallbackSource?: string;
}

export function OptimizedAvatarImage({
  source,
  displaySize,
  fallbackSource,
  onError,
  ...props
}: OptimizedAvatarImageProps) {
  const deliveryProps = getAvatarDeliveryProps(source || fallbackSource || "", displaySize);

  return (
    <img
      {...props}
      {...deliveryProps}
      width={props.width ?? displaySize}
      height={props.height ?? displaySize}
      onError={(event) => {
        if (fallbackSource && event.currentTarget.src !== fallbackSource) {
          event.currentTarget.srcset = "";
          event.currentTarget.src = fallbackSource;
        }
        onError?.(event);
      }}
    />
  );
}
