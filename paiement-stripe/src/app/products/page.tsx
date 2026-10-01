import { getServerSession } from "next-auth";
import PayNowButton from "@/components/PayNowButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const [session, products] = await Promise.all([getServerSession(authOptions), prisma.product.findMany()]);

  return (
    <main>
      <h1>Produits</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.image && <img src={product.image} alt={product.name} />}
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price.toFixed(2)} €</p>
            {session ? <PayNowButton productId={product.id} /> : <p>Connectez-vous pour acheter</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
