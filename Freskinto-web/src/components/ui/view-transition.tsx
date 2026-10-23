import * as React from "react"

type ViewTransitionProps = React.ViewTransitionProps

const ReactViewTransition = (React as { ViewTransition?: React.ComponentType<ViewTransitionProps> }).ViewTransition

/**
 * React `<ViewTransition>` (Next `experimental.viewTransition`) — jis React build mein yeh nahi
 * (tests ka stable React) wahan bachche seedhe render hote hain, bina animation ke.
 */
function ViewTransition({ children, ...props }: ViewTransitionProps) {
  if (!ReactViewTransition) return <>{children}</>
  return <ReactViewTransition {...props}>{children}</ReactViewTransition>
}

export { ViewTransition }
