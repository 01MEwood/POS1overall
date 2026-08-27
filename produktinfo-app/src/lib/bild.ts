/**
 * Bild-Upload: Datei → verkleinerte JPEG/PNG-DataURL.
 * Logos und Produktfotos werden clientseitig skaliert, damit localStorage
 * und PDF-Größe klein bleiben.
 */
export async function dateiZuDataUrl(datei: File, maxKante: number): Promise<string> {
  if (!datei.type.startsWith('image/')) {
    throw new Error('Bitte eine Bilddatei wählen (PNG oder JPG).');
  }
  const url = URL.createObjectURL(datei);
  try {
    const bild = await ladeBild(url);
    const skala = Math.min(1, maxKante / Math.max(bild.width, bild.height));
    const breite = Math.max(1, Math.round(bild.width * skala));
    const hoehe = Math.max(1, Math.round(bild.height * skala));

    const canvas = document.createElement('canvas');
    canvas.width = breite;
    canvas.height = hoehe;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Bildverarbeitung wird von diesem Browser nicht unterstützt.');
    ctx.drawImage(bild, 0, 0, breite, hoehe);

    // PNG behält Transparenz (wichtig für Logos), JPG spart Platz bei Fotos.
    const alsPng = datei.type === 'image/png';
    return canvas.toDataURL(alsPng ? 'image/png' : 'image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ladeBild(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const bild = new Image();
    bild.onload = () => resolve(bild);
    bild.onerror = () => reject(new Error('Bild konnte nicht gelesen werden.'));
    bild.src = url;
  });
}
