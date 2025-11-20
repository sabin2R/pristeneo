export default function Loading() {
    return (
      <section className="section">
        <div className="container">
          <div className="h-8 w-48 rounded bg-black/10" />
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[var(--radius-lg)] border bg-white/60 p-6">
                <div className="aspect-square w-full rounded bg-black/10" />
                <div className="mt-3 h-4 w-2/3 rounded bg-black/10" />
                <div className="mt-2 h-3 w-1/3 rounded bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  