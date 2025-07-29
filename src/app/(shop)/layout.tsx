import TopMenu from "@/components/ui/top-menu/TopMenu";
import { Footer } from "@/components/ui/footer/Footer";
import { CartProvider } from "@/context/cart/CartContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-200dn from-60% via-400dn via-90% to-500dn">
        <TopMenu />
        <div>{children}</div>
        <Footer />
      </div>
    </CartProvider>
  );
}
