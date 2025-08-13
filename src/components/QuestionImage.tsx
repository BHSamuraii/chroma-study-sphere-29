import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface QuestionImageProps {
  src: string;
  alt?: string;
  ratio?: number; // default 16:9
  className?: string;
}

export const QuestionImage: React.FC<QuestionImageProps> = ({
  src,
  alt = "Quiz question image",
  ratio = 16 / 9,
  className = "",
}) => {
  return (
    <figure className={`w-full mx-auto max-w-2xl rounded-lg border border-border bg-muted/20 overflow-hidden shadow-sm ${className}`}>
      <AspectRatio ratio={ratio} className="flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
        />
      </AspectRatio>
      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
};
