import Image from "next/image";

type Props = {
  alt: string;
  /** Tailwind classes for the image element (e.g. rounded-2xl object-cover). */
  className?: string;
  width: number;
  height: number;
  priority?: boolean;
};

/** Author portrait served from `/public/author.jpeg`. */
export function AuthorPhoto({ alt, className, width, height, priority }: Props) {
  return (
    <Image
      src="/author.jpeg"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
