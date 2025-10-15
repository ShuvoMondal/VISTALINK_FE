import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/login-form'
import { Card } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-lg relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <LoginForm />
      </Card>
    </div>
  )
}
