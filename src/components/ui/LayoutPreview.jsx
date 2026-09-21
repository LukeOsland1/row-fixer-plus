const titleWidths = [90, 60, 80, 50, 75, 65, 85, 55];

export default function LayoutPreview({ rows, fullTitles, scopeLabel }) {
  const count = Math.max(1, Math.min(Number(rows) || 1, 15));
  return (
    <section className="preview-card" aria-label="Live preview">
      <div className="preview-head">
        <span>LIVE PREVIEW</span>
        <span>{scopeLabel}</span>
      </div>
      <div
        className="preview-grid"
        aria-hidden="true"
        style={{ "--columns": count }}
      >
        {Array.from({ length: count }, (_, index) => (
          <span key={index}>
            <i />
            <b style={{ width: "90%" }} />
            {fullTitles && (
              <b
                style={{
                  width: titleWidths[index % titleWidths.length] + "%",
                }}
              />
            )}
          </span>
        ))}
      </div>
      <div className="preview-readout">
        <strong>{count}</strong>
        <span>
          videos per row{fullTitles ? ", full titles on" : ""}
        </span>
      </div>
    </section>
  );
}
