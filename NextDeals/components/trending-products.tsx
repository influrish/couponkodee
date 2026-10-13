"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card" // Reverted import
import { Badge } from "@/components/ui/badge" // Reverted import
import { Button } from "@/components/ui/button" // Reverted import
import { TrendingUp, Star } from "lucide-react"
import Image from "next/image"

interface TrendingProductsProps {
  products: any[]
}

export function TrendingProducts({ products }: TrendingProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  // Extract unique categories from products
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category?.name)))]

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "All" ? products : products.filter((p) => p.category?.name === selectedCategory)

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="article-title text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Trending Now
          </h2>
          <p className="text-muted-foreground">Most searched products this week</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {filteredProducts.slice(0, 8).map((product) => {
          const imgSrc = !imgErrors[product.id] && product.images?.[0]?.image?.url ? product.images[0].image.url : "/placeholder.svg"

          return (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative mb-4 overflow-hidden rounded-lg bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={product.images?.[0]?.alt || product.title}
                    className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImgErrors((prev) => ({ ...prev, [product.id]: true }))}
                  />
                {product.pricing?.discountPercentage > 0 && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                    {product.pricing.discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <Badge variant="secondary" className="mb-2 text-xs">
                {product.category?.name}
              </Badge>

              <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>

              {product.rating && (
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                </div>
              )}

              <div className="text-lg font-bold text-primary">₹{product.pricing?.currentPrice}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
