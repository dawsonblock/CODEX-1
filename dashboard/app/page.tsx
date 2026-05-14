import { ToolBuilder } from "@/components/tool-builder/tool-builder"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <ToolBuilder />
        </main>
      </div>
    </div>
  )
}
