import { Cpu, Github } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Cpu className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">CODEX</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">Tool Builder</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/registry"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Registry
        </Link>
        <a
          href="https://github.com/dawsonblock/CODEX-1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </header>
  )
}
