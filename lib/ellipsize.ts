"use client"

function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function ellipsize(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

export function generateEllipsizedText(htmlContent: string, maxLength: number): string {
  const plainText = stripHtml(htmlContent);
  return ellipsize(plainText, maxLength);
}