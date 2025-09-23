import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import CollectionRow from 'components/home/collection-row';
import Hero from 'components/home/hero';
import Footer from 'components/layout/footer';

export const metadata = {
  description:
    'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-(--breakpoint-2xl)">
        <Carousel title="Latest Arrivals" source={{ type: 'latest', limit: 20 }} />
        <Carousel title="Pre‑Orders" source={{ type: 'collection', handle: 'pre-orders' }} />
        <CollectionRow title="Magic: The Gathering" handle="magic-the-gathering" />
        <CollectionRow title="Pokémon" handle="pokemon" />
        <CollectionRow title="One Piece" handle="one-piece" />
        <ThreeItemGrid />
        <CollectionRow title="Dragon Ball" handle="dragon-ball" />
      </div>
      <Footer />
    </>
  );
}
