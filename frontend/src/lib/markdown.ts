// Ported exactly from BIZPLANMay15withAPI.html prototype
export function markdownToHtml(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  const blocks: Array<{ type: "text" | "table"; lines: string[] }> = [];
  let current: { type: "text" | "table"; lines: string[] } = { type: "text", lines: [] };
  let inTable = false;

  for (const line of lines) {
    const isTableLine = line.trim().startsWith("|");

    if (isTableLine) {
      if (!inTable) {
        if (current.lines.length > 0) blocks.push(current);
        current = { type: "table", lines: [] };
        inTable = true;
      }
      current.lines.push(line);
    } else {
      if (inTable) {
        blocks.push(current);
        current = { type: "text", lines: [] };
        inTable = false;
      }
      current.lines.push(line);
    }
  }

  if (current.lines.length > 0) blocks.push(current);

  return blocks
    .map((b) => (b.type === "table" ? tableToHtml(b.lines) : textToHtml(b.lines.join("\n"))))
    .join("\n");
}

function tableToHtml(lines: string[]): string {
  const clean = lines.filter((l) => l.trim());
  if (clean.length < 3) return clean.join("\n");

  const headers = clean[0]
    .split("|")
    .map((c) => c.trim())
    .filter(Boolean);

  const rows = clean.slice(2).map((line) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean)
  );

  let html = "<table><thead><tr>";
  headers.forEach((h) => (html += `<th>${h}</th>`));
  html += "</tr></thead><tbody>";
  rows.forEach((row) => {
    html += "<tr>";
    row.forEach((cell) => (html += `<td>${cell}</td>`));
    html += "</tr>";
  });
  html += "</tbody></table>";
  return html;
}

function textToHtml(text: string): string {
  if (!text) return "";

  return text
    .split("\n\n")
    .map((para) => {
      let p = para.trim();
      if (!p) return "";

      p = p.replace(/^### (.+)$/gm, "<h3>$1</h3>");
      p = p.replace(/^## (.+)$/gm, "<h2>$1</h2>");
      p = p.replace(/^# (.+)$/gm, "<h1>$1</h1>");
      p = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      p = p.replace(/\*(.+?)\*/g, "<em>$1</em>");

      if (/^[✅•\-*] /m.test(p)) {
        const items = p.split(/\n(?=[✅•\-*] )/).map((li) => li.replace(/^[✅•\-*] /, "").trim());
        return "<ul>" + items.map((x) => `<li>${x}</li>`).join("") + "</ul>";
      }

      if (/^\d+\. /m.test(p)) {
        const items = p.split(/\n(?=\d+\. )/).map((li) => li.replace(/^\d+\. /, "").trim());
        return "<ol>" + items.map((x) => `<li>${x}</li>`).join("") + "</ol>";
      }

      p = p.replace(/\n/g, "<br/>");

      if (/^<(h\d|ul|ol)/.test(p)) return p;
      return `<p>${p}</p>`;
    })
    .filter(Boolean)
    .join("");
}
