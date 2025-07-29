"use client";

import Image from "next/image";
import styles from "./BrandsSlider.module.css";
import { brandItems } from "@/seed/brandItems";

interface CSSProperties extends React.CSSProperties {
  '--quantity'?: number;
  '--position'?: number;
}

export const BrandsSlider = () => {
  return (
    <div className="flex justify-center items-center p-8 py-20 bg-300dn/50">
      <div className="w-full max-w-[1600px] overflow-hidden">
        <div className="flex flex-col items-center">
          <div className={styles.slider} style={{ '--quantity': brandItems.length } as CSSProperties}>
            <div className={styles.list}>
              {brandItems.map((brand, index) => (
                <div 
                  key={brand.id} 
                  className={styles.item} 
                  style={{ '--position': index + 1 } as CSSProperties}
                >
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    width={200}
                    height={150}
                    className="object-contain hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};