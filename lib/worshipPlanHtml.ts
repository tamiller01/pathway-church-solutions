type WorshipFlowItem = {
  label?: string;
  html?: string;
};

type WorshipPlan = {
  theme?: string;
  scripture?: string;
  style?: string;
  notes?: string;
  flow?: WorshipFlowItem[];
};

function escapeHtml(value: string | undefined) {
  return (value || "").replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

export function worshipPlanToHtml(plan: WorshipPlan | null | undefined): string {
  if (!plan) return "<p>Worship plan content is unavailable.</p>";

  const details = [
    ["Theme", plan.theme],
    ["Scripture", plan.scripture],
    ["Style", plan.style]
  ]
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join("");

  const notes = plan.notes ? `<p>${escapeHtml(plan.notes)}</p>` : "";
  const flow = (plan.flow || [])
    .map((item) => {
      const label = item.label || "Service element";
      const html = item.html || "";
      const firstHeading = html.match(/^\s*<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1]
        ?.replace(/<[^>]*>/g, "")
        .trim();
      if (firstHeading?.toLowerCase() === label.trim().toLowerCase()) return html;
      return `<h2>${escapeHtml(label)}</h2>${html}`;
    })
    .join("");

  return `${details}${notes}${flow || "<p>Add worship plan details here.</p>"}`;
}
