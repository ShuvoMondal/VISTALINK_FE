import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  loader: () => {
    // Redirect from /login to / (root) since login is now at root
    throw redirect({
      to: '/',
    })
  },
})
