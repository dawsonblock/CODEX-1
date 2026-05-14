import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { ToolRegistry } from "@/components/registry/tool-registry"

export default function RegistryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <ToolRegistry />
        </main>
      </div>
    </div>
  )
}
