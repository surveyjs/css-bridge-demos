import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { navItems } from "@adapter/schemas";

/**
 * Landing page. A native-shadcn dashboard of cards, one per shared IA route.
 * Cards are driven by `navItems` from @adapter/schemas (no local route list).
 */
export default function HomePage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {navItems.map((item) => (
        <Card key={item.id} className="flex flex-col">
          <CardHeader className="flex-1">
            <CardTitle>{item.label}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href={item.path}>
                Open {item.label}
                <ArrowRightIcon />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
