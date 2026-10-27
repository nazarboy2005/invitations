/** Typeset the catalog caption onto the texture, so it deforms with the mesh. */
export function printPaperCaption(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  name: string,
  description: string,
  titleFamily: string,
  bodyFamily: string,
) {
  const shade = ctx.createLinearGradient(0, height * 0.35, 0, height);
  shade.addColorStop(0, "#100e0c00");
  shade.addColorStop(0.35, "#100e0c45");
  shade.addColorStop(1, "#100e0ce8");
  ctx.fillStyle = shade;
  ctx.fillRect(0, height * 0.35, width, height * 0.65);

  const inset = width * 0.075;
  const available = width - inset * 2;
  const bodySize = width * 0.06;
  const lineHeight = bodySize * 1.6;
  ctx.font = `400 ${bodySize}px ${bodyFamily}`;
  const lines: string[] = [];
  let line = "";
  for (const word of description.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > available) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > 2) {
    let last = lines[1];
    while (last && ctx.measureText(`${last}…`).width > available)
      last = last.slice(0, -1);
    lines[1] = `${last.trimEnd()}…`;
  }
  const visible = lines.slice(0, 2);
  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffffe0";
  const bodyY = height - width * 0.09 - visible.length * lineHeight;
  visible.forEach((text, i) =>
    ctx.fillText(text, inset, bodyY + i * lineHeight),
  );
  ctx.fillStyle = "#ffffff";
  ctx.font = `500 ${width * 0.13}px ${titleFamily}`;
  ctx.fillText(name, inset, bodyY - width * 0.17, available);
}
