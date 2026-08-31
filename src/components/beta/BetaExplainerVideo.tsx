import MuxPlayer from "@mux/mux-player-react";
import { PlayCircle } from "lucide-react";
import { BETA_EXPLAINER_MUX_PLAYBACK_ID } from "@/constants/video";

export function BetaExplainerVideo() {
  const hasPlaybackId = Boolean(BETA_EXPLAINER_MUX_PLAYBACK_ID);

  return (
    <section className="grid gap-8 border-t border-border/60 py-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          Video explicativo
        </p>
        <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Antes de empezar, mirá este video
        </h2>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
          En aproximadamente un minuto te contamos que se puede probar durante
          la Beta y cómo aprovechar la experiencia sin usar contenido real.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border/70 bg-foreground shadow-[0_24px_80px_-48px_rgba(34,80,69,0.45)]">
        <div className="aspect-video">
          {hasPlaybackId ? (
            <MuxPlayer
              playbackId={BETA_EXPLAINER_MUX_PLAYBACK_ID}
              className="h-full w-full mux-custom"
              metadata={{
                video_id: BETA_EXPLAINER_MUX_PLAYBACK_ID,
                video_title: "Video explicativo de la Beta pública",
              }}
              thumbnailTime={5.5}
              accentColor="#20ab9f"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(32,171,159,0.22),transparent_32%),linear-gradient(135deg,#11221f_0%,#1f4038_52%,#111827_100%)] p-6 text-center text-white">
              <div className="max-w-sm">
                <PlayCircle className="mx-auto h-12 w-12 text-primary-light" />
                <p className="mt-4 text-lg font-semibold">
                  Video de Beta pendiente
                </p>
                <p className="mt-2 text-sm leading-6 text-white/72">
                  Cuando esté definido el playback ID de Mux, el reproductor se
                  mostrará automáticamente en este espacio.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
