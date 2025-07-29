import Image from "next/image";

interface Props {
  text: string;
  author: string;
  location: string;
  highlight: string;
}

export const TestimonialCard = ({
  text,
  author,
  location,
  highlight,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-4 mx-2 rotate-12">
      <div className="text-pink-500">
      <Image
          src="/ldquo.svg"
          alt="Left double quote"
          width={72}
          height={72}
          className="-ml-4 -mt-6"
        />
      </div>
      <p className="text-gray-800 text-lg">{text}</p>
      <div className="mt-auto">
        <p className="font-semibold text-gray-900">
          {author}, {location}
        </p>
        <p className="text-sm text-gray-600 italic">
          &ldquo;{highlight}&rdquo;
        </p>
      </div>
      {/* <button className="text-pink-500 text-sm mt-2 hover:underline">
        Ver más
      </button> */}
    </div>
  );
};
