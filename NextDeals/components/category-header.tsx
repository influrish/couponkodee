interface CategoryHeaderProps {
  title: string
  description: string
}

export function CategoryHeader({ title, description }: CategoryHeaderProps) {
  return (
    <div className="text-center py-12">
      <h1 className="article-title text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      <p className="article-subtitle text-xl text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </div>
  )
}
