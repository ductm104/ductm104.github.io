import * as pdfjsLib from './vendor/pdf.min.mjs';
import { calcSavings, escapeHtml, formatBytes, withModeSuffix } from './utils.mjs';

const { PDFDocument } = window.PDFLib;

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdf.worker.min.mjs', import.meta.url).href;

const filesInput = document.getElementById('files');
const compressBtn = document.getElementById('compress');
const resultsEl = document.getElementById('results');

const LOSSY_CONFIG_BY_MODE = {
  low: { quality: 0.85, scale: 1.5 },
  medium: { quality: 0.75, scale: 1.2 },
  high: { quality: 0.6, scale: 1.0 },
};

compressBtn.addEventListener('click', async () => {
  const files = Array.from(filesInput.files || []);
  if (!files.length) {
    renderMessage('Select one or more PDF files.', true);
    return;
  }

  const mode = document.querySelector('input[name="mode"]:checked')?.value ?? 'medium';

  compressBtn.disabled = true;
  resultsEl.innerHTML = '';

  for (const file of files) {
    const item = document.createElement('li');
    item.innerHTML = `
      <div class="result-row">
        <strong>${escapeHtml(file.name)}</strong>
        <small>Original: ${formatBytes(file.size)}</small>
      </div>
      <small>Processing (${modeLabel(mode)})...</small>
    `;
    resultsEl.appendChild(item);

    try {
      const inputBytes = new Uint8Array(await file.arrayBuffer());
      const inputSize = inputBytes.length;
      const outputBytes =
        mode === 'lossless'
          ? await compressLossless(inputBytes)
          : await compressLossy(inputBytes, LOSSY_CONFIG_BY_MODE[mode]);

      const outputName = withModeSuffix(file.name, mode);
      const blob = new Blob([outputBytes], { type: 'application/pdf' });
      const href = URL.createObjectURL(blob);
      const savings = calcSavings(inputSize, outputBytes.length);

      item.innerHTML = `
        <div class="result-row">
          <strong>${escapeHtml(file.name)}</strong>
          <small>Original: ${formatBytes(inputSize)}</small>
        </div>
        <div class="variant-row">
          <span class="mode">${modeLabel(mode)}</span>
          <span class="size">${formatBytes(outputBytes.length)} (${savings})</span>
          <a class="download" href="${href}" download="${escapeHtml(outputName)}">Download</a>
        </div>
        <iframe class="preview" src="${href}" title="Preview ${escapeHtml(outputName)}"></iframe>
      `;
    } catch (error) {
      item.innerHTML = `
        <div class="result-row">
          <strong>${escapeHtml(file.name)}</strong>
          <small class="error">${escapeHtml(error?.message || 'Compression failed')}</small>
        </div>
      `;
    }
  }

  compressBtn.disabled = false;
});

function modeLabel(mode) {
  if (mode === 'lossless') return 'Lossless';
  return `Lossy (${mode[0].toUpperCase()}${mode.slice(1)})`;
}

async function compressLossless(inputBytes) {
  const pdf = await PDFDocument.load(inputBytes, { updateMetadata: false });
  return pdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
    objectsPerTick: 50,
  });
}

async function compressLossy(inputBytes, lossyConfig) {
  const { quality, scale } = lossyConfig;
  const sourcePdf = await pdfjsLib.getDocument({ data: inputBytes }).promise;
  const outputPdf = await PDFDocument.create();

  for (let i = 1; i <= sourcePdf.numPages; i += 1) {
    const page = await sourcePdf.getPage(i);
    const pageViewport = page.getViewport({ scale: 1 });
    const renderViewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(renderViewport.width);
    canvas.height = Math.floor(renderViewport.height);

    const context = canvas.getContext('2d', { alpha: false });
    await page.render({ canvasContext: context, viewport: renderViewport }).promise;

    const jpegBytes = await canvasToJpegBytes(canvas, quality);
    const jpg = await outputPdf.embedJpg(jpegBytes);
    const outPage = outputPdf.addPage([pageViewport.width, pageViewport.height]);
    outPage.drawImage(jpg, {
      x: 0,
      y: 0,
      width: pageViewport.width,
      height: pageViewport.height,
    });
  }

  return outputPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
  });
}

function canvasToJpegBytes(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas JPEG encoding failed'));
        blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)), reject);
      },
      'image/jpeg',
      quality,
    );
  });
}

function renderMessage(message, isError = false) {
  const item = document.createElement('li');
  item.innerHTML = `<small class="${isError ? 'error' : ''}">${escapeHtml(message)}</small>`;
  resultsEl.innerHTML = '';
  resultsEl.appendChild(item);
}
