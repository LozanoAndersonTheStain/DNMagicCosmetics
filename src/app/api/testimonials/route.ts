import { NextResponse } from "next/server";
import { getTestimonials } from "@/utils/testimonials";

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error al obtener testimonios:", error);
    return NextResponse.json(
      { error: "Error al obtener testimonios" },
      { status: 500 }
    );
  }
}