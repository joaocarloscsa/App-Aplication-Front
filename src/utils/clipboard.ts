// /var/www/GSA/animal/frontend/src/utils/clipboard.ts

export function copyToClipboard(text: string) {
  if (!text) return;

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(text);
    return;
  }

  // fallback
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}
