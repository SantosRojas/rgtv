import { PlaylistManager } from '../components/organisms/playlist-manager.tsx'

export default function PlaylistsPage() {
  return (
    <div className="h-full overflow-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Listas de reproducción</h1>
        <PlaylistManager />
      </div>
    </div>
  )
}
