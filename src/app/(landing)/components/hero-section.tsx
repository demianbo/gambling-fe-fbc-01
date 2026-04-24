import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to GamblingApp</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Your premier destination for entertainment and gaming. Start your journey today.
      </p>
      <Button size="lg" className="gap-2">
        Get Started
      </Button>
    </section>
  )
}