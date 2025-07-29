import { Banner } from "@/components";
import { Categories } from "@/components/ui/categories/Categories";
import { Testimonials } from "@/components/ui/testimonials/Testimonials";
import { statistics } from "@/seed";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="text-black">
        <Banner />

        <div className="py-8 sm:py-12 md:py-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center px-4">
            Bienvenida, Tenemos Todo Lo Que Buscas
          </h1>
        </div>

        <div className="bg-300dn py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 md:px-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-100dn mb-2">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm uppercase font-bold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Sobre Nosotros */}
        <div className="py-16 sm:py-20 md:py-24 px-4 md:px-[8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto min-h-[600px]">
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center md:text-left">
                Sobre Nosotros
              </h2>
              <p className="leading-relaxed text-sm sm:text-base">
                D&N Nació De Un Sueño Compartido: Crear Un Espacio De Belleza
                Que Combinara Calidad, Accesibilidad Y Autenticidad. Como
                Pareja, Transformamos Nuestra Pasión Por La Belleza En Un
                Proyecto Que Busca Acercar Lo Mejor De La Cosmética A Cada
                Persona.
              </p>
              <p className="leading-relaxed text-sm sm:text-base">
                Cada Producto Que Seleccionamos Refleja El Cuidado Y La
                Dedicación Que Ponemos En Todo Lo Que Hacemos. Aunque Esto Es
                Solo El Comienzo, Estamos Trabajando Para Expandir Nuestro
                Catálogo Con Productos Más Innovadores Y Sostenibles Para
                Nuestros Clientes.
              </p>
              <p className="leading-relaxed text-sm sm:text-base">
                Porque Creemos En Un Futuro Donde La Belleza Y El Cuidado
                Personal Sean Accesibles Para Todos, Siempre Con El Respeto Al
                Planeta.
              </p>
              <p className="font-semibold text-sm sm:text-base">
                Gracias Por Confiar En Nosotros Y Ser Parte De Este Viaje.
                Contigo, Hacemos Realidad Un Sueño Que Crece Cada Día.
              </p>
            </div>
            <div className="hidden sm:block relative w-full h-[300px] sm:h-[400px] md:h-[500px] mx-auto justify-center items-center">
              <Image
                src="/assets/imageLogo/aboutuslogo.svg"
                alt="D&N Magic Cosmetics"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <Categories />
        <Testimonials />
      </main>
    </>
  );
}
