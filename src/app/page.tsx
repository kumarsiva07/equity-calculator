// src/app/page.tsx
import { EquityCalculator } from '@/components/EquityCalculator'

export default function Page() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="container">
        <EquityCalculator />
      </div>
    </main>
  )
}