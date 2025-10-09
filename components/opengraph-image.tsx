import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import { join } from "path";

export type Props = {
  title?: string;
};

export default async function OpengraphImage({
  title,
}: Props = {}): Promise<ImageResponse> {
  const imageFile = await readFile(
    join(process.cwd(), "./public/turtleog.jpg"),
  );
  const imageSrc = `data:image/jpeg;base64,${imageFile.toString("base64")}`;

  return new ImageResponse(
    (
      <div tw="flex h-full w-full relative">
        <img src={imageSrc} tw="h-full w-full object-cover" />
        {title ? (
          <div tw="absolute bottom-8 left-8 text-white text-6xl font-bold drop-shadow-lg">
            {title}
          </div>
        ) : null}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
