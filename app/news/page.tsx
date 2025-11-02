import { Card } from "components/ui/card";
import { Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Stay updated with the latest news, product releases, and announcements from Turtle Island TCG Store.",
  openGraph: {
    title: "News & Updates | Turtle Island TCG",
    description:
      "Stay updated with the latest news, product releases, and announcements from Turtle Island TCG Store.",
  },
};

type NewsPost = {
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  image?: string;
};

// Example news posts - you can later fetch these from a CMS or database
const newsPosts: NewsPost[] = [
  {
    id: "1",
    date: "November 2, 2024",
    title: "Phantasmal Flames Pre-Orders Now Open!",
    content:
      "We're excited to announce that pre-orders for Pokémon Phantasmal Flames are now live! This highly anticipated set releases November 14th, 2024. Secure your booster boxes, Elite Trainer Boxes, and singles before they sell out. Pre-order customers get priority shipping on release day!",
    tags: ["Pokemon", "Pre-Order", "New Release"],
    image: "/flames.png",
  },
  {
    id: "2",
    date: "November 1, 2024",
    title: "Magic: The Gathering Foundations Avatar Set Release",
    content:
      "Mark your calendars! The MTG Foundations Avatar Set drops November 21st. This special release features exclusive artwork and powerful new cards for Standard play. Pre-orders start next week - don't miss out on this limited quantity release!",
    tags: ["MTG", "Foundations", "Upcoming"],
    image: "/avatarpromo.jpg",
  },
  {
    id: "3",
    date: "October 31, 2024",
    title: "One Piece: Carrying On His Will - Release Day Success",
    content:
      "Thank you to everyone who made the November 7th release of 'Carrying On His Will' a huge success! We've restocked most products and have additional singles available. Check out our One Piece collection for the latest cards from this epic set.",
    tags: ["One Piece", "Restock"],
    image: "/carry.png",
  },
  {
    id: "4",
    date: "October 25, 2024",
    title: "New Singles Inventory Added Daily",
    content:
      "We're continuously expanding our singles collection across all TCGs! Check back daily for newly listed cards from Magic: The Gathering, Pokémon, One Piece, Dragon Ball, and Final Fantasy. Looking for something specific? Use our search feature or ask our staff!",
    tags: ["Singles", "Inventory Update"],
  },
  {
    id: "5",
    date: "October 20, 2024",
    title: "Free Shipping Threshold Lowered to $300",
    content:
      "Great news for our online shoppers! We've lowered our free shipping threshold from $400 to $300 for all New Zealand orders. This makes it even easier to get your favorite cards delivered right to your door. Excludes large shipments only.",
    tags: ["Shipping", "Announcement"],
  },
];

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          News & Updates
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Stay up to date with the latest releases, restocks, and store
          announcements from Turtle Island TCG.
        </p>
      </div>

      <div className="space-y-6">
        {newsPosts.map((post) => (
          <NewsPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function NewsPostCard({ post }: { post: NewsPost }) {
  return (
    <Card className="overflow-hidden border border-border bg-card transition-shadow hover:shadow-lg">
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold tracking-tight text-foreground md:text-2xl">
          {post.title}
        </h2>

        {/* Image */}
        {post.image && (
          <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        )}

        {/* Content */}
        <p className="mb-4 text-base leading-relaxed text-foreground/90">
          {post.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

