"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { useCountry } from "@/components/country-context"

interface ProductGridProps {
  products: any[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { formatPrice } = useCountry()
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground">Check back soon for new deals in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => {
        const imgSrc = !imgErrors[product.id] && product.images?.[0]?.image?.url ? product.images[0].image.url : "/placeholder.svg"

        return (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="relative mb-4 overflow-hidden rounded-lg bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc}
                  alt={product.images?.[0]?.alt || product.title}
                  className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImgErrors((prev) => ({ ...prev, [product.id]: true }))}
                />
              {product.pricing?.discountPercentage > 0 && (
                <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                  {product.pricing.discountPercentage}% OFF
                </Badge>
              )}
            </div>

            <Badge variant="secondary" className="mb-2 text-xs">
              {product.category?.name}
            </Badge>

            <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>

            {product.shortDescription && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.shortDescription}</p>
            )}

            {product.rating && (
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{product.rating}</span>
                {product.reviewCount > 0 && (
                  <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-bold text-primary">{formatPrice(product.pricing?.currentPrice)}</span>
              {product.pricing?.originalPrice > product.pricing?.currentPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.pricing?.originalPrice)}</span>
              )}
            </div>

            <Button className="w-full" asChild>
              <a
                href={`/out?url=${encodeURIComponent(product.affiliateUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Deal
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
