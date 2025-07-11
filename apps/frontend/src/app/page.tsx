import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { Hero } from '@/components/sections/Hero'
import { SearchPreview } from '@/components/sections/SearchPreview'
import { StatsSection } from '@/components/sections/StatsSection'

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <SearchPreview />
      <FeaturesSection />
      <StatsSection />
    </main>
  )
}
