import { ImageResponse } from "next/og";
import Image from "next/image";
// Apple touch icon (used when the site is saved to an iOS home screen).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return <Image
            src="../icon.svg"
            alt="LearnToCP"
            width={40}
            height={40}
            draggable={false}
            className="select-none"
          />
}
