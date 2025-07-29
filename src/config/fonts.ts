import { Sansita } from "next/font/google";

export const bodySource = Sansita({ 
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"]
});

export const titleFont = Sansita({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});