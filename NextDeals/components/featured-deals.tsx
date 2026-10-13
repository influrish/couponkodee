import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Reverted import
import { Badge } from "@/components/ui/badge" // Reverted import
import { Button } from "@/components/ui/button" // Reverted import
import { Star, TrendingDown } from "lucide-react"
import Image from "next/image"

interface FeaturedDealsProps {
  products: any[]
}

export function FeaturedDeals({ products }: FeaturedDealsProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="article-title text-3xl font-bold mb-2">Featured Deals</h2>
          <p className="text-muted-foreground">Hand-picked deals with the biggest savings</p>
        </div>
        <Button variant="outline">View All Deals</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.images?.[0]?.image?.url || "/placeholder.svg"}
                  alt={product.images?.[0]?.alt || product.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    if (!target.src.endsWith("/placeholder.svg")) {
                      target.src = "/placeholder.svg"
                    }
                  }}
                />
                {product.pricing?.discountPercentage > 0 && (
                  <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {product.pricing.discountPercentage}% OFF
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <Badge variant="secondary" className="mb-2 text-xs">
                {product.category?.name}
              </Badge>

              <CardTitle className="text-lg mb-2 line-clamp-2">{product.title}</CardTitle>

              {product.rating && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  {product.reviewCount > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount.toLocaleString()} reviews)
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-primary">₹{product.pricing?.currentPrice}</span>
                {product.pricing?.originalPrice > product.pricing?.currentPrice && (
                  <span className="text-sm text-muted-foreground line-through">₹{product.pricing?.originalPrice}</span>
                )}
              </div>

              <Button className="w-full" asChild>
                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer">
                  View Deal
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
