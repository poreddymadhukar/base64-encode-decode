import { useState } from "react";
import {
  Check,
  Clipboard,
  Download,
  Eraser,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import QRCode from "qrcode";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

type Status = { kind: "idle" | "success" | "error"; message: string };

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "This content could not be encoded as a QR code.";
}

export default function App() {
  const [input, setInput] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");
  const [status, setStatus] = useState<Status>({
    kind: "idle",
    message: "Ready to generate",
  });

  const generateQr = async () => {
    if (!input.trim()) {
      setQrDataUrl("");
      setQrSvg("");
      setStatus({ kind: "error", message: "Enter some text or a URL first." });
      return;
    }

    try {
      const options = {
        errorCorrectionLevel: "M" as const,
        margin: 4,
        width: 1024,
      };
      const [dataUrl, svg] = await Promise.all([
        QRCode.toDataURL(input, options),
        QRCode.toString(input, { ...options, type: "svg" }),
      ]);
      setQrDataUrl(dataUrl);
      setQrSvg(svg);
      setStatus({
        kind: "success",
        message: "QR code generated successfully.",
      });
    } catch (error) {
      setQrDataUrl("");
      setQrSvg("");
      setStatus({
        kind: "error",
        message: `Could not generate a QR code. ${getErrorMessage(error)}`,
      });
    }
  };

  const copyContent = async () => {
    if (!input) return;
    try {
      await navigator.clipboard.writeText(input);
      setStatus({ kind: "success", message: "Content copied to clipboard." });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Clipboard access was unavailable. Select and copy the content manually.",
      });
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    try {
      const blobContent =
        type === "image/png"
          ? Uint8Array.from(atob(content.split(",")[1]), (character) =>
              character.charCodeAt(0),
            )
          : content;
      const url = URL.createObjectURL(new Blob([blobContent], { type }));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      setStatus({ kind: "success", message: `${filename} downloaded.` });
    } catch {
      setStatus({
        kind: "error",
        message: "The download could not be started. Please try again.",
      });
    }
  };

  const clear = () => {
    setInput("");
    setQrDataUrl("");
    setQrSvg("");
    setStatus({ kind: "idle", message: "Ready to generate" });
  };

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="app-shell">
        <section className="workspace" aria-labelledby="page-title">
          <div className="command-header">
            <div>
              <p className="eyebrow">Developer utility</p>
              <h1 id="page-title">QR Code Generator</h1>
              <p className="intro">Create a QR code from any URL or text.</p>
            </div>
            <div className="privacy-note">
              <ShieldCheck size={16} aria-hidden="true" /> Runs locally in your
              browser. Your content is never uploaded.
            </div>
          </div>

          <section className="generator-panel" aria-label="QR code generator">
            <label className="input-label" htmlFor="qr-content">
              Content
            </label>
            <textarea
              id="qr-content"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Enter URL or text to generate QR code..."
              aria-describedby="input-help"
              spellCheck="false"
            />
            <div className="input-footer">
              <span id="input-help">
                URLs, plain text, phone numbers, and email text are supported.
              </span>
              <span>{input.length.toLocaleString()} characters</span>
            </div>
            <button
              className="button primary generate-button"
              type="button"
              onClick={() => void generateQr()}
            >
              <Sparkles size={16} aria-hidden="true" /> Generate QR Code
            </button>
          </section>

          <section
            className={`preview-panel ${qrDataUrl ? "has-qr" : ""}`}
            aria-labelledby="preview-title"
          >
            <div className="panel-header">
              <div>
                <span className="panel-label" id="preview-title">
                  Preview
                </span>
                {qrDataUrl && <span className="panel-meta">Ready to scan</span>}
              </div>
              {qrDataUrl && (
                <Check
                  size={18}
                  className="success-icon"
                  aria-label="QR code ready"
                />
              )}
            </div>
            <div className="qr-stage">
              {qrDataUrl ? (
                <img
                  className="qr-image"
                  src={qrDataUrl}
                  alt={`QR code for ${input.slice(0, 80)}`}
                />
              ) : (
                <div className="empty-output">
                  <QrCode size={42} strokeWidth={1.4} aria-hidden="true" />
                  <strong>Your QR code will appear here</strong>
                  <span>Enter content above, then generate your code.</span>
                </div>
              )}
            </div>
            {qrDataUrl && (
              <div className="download-actions" aria-label="Download QR code">
                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    downloadFile(qrDataUrl, "mariutil-qr-code.png", "image/png")
                  }
                >
                  <Download size={16} aria-hidden="true" /> Download PNG
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={() =>
                    downloadFile(qrSvg, "mariutil-qr-code.svg", "image/svg+xml")
                  }
                >
                  <Download size={16} aria-hidden="true" /> Download SVG
                </button>
              </div>
            )}
          </section>

          <div className="tool-actions">
            <button
              className="button"
              type="button"
              onClick={() => void copyContent()}
              disabled={!input}
            >
              <Clipboard size={16} aria-hidden="true" /> Copy Content
            </button>
            <button
              className="button"
              type="button"
              onClick={clear}
              disabled={!input && !qrDataUrl}
            >
              <Eraser size={16} aria-hidden="true" /> Clear
            </button>
          </div>
          <div
            className={`status ${status.kind}`}
            role="status"
            aria-live="polite"
          >
            <span aria-hidden="true" />
            {status.message}
          </div>

          <section className="tool-details" aria-labelledby="about-title">
            <div>
              <p className="eyebrow">About this tool</p>
              <h2 id="about-title">
                A simple QR code generator for everyday sharing.
              </h2>
            </div>
            <div className="tool-details-copy">
              <p>
                A QR code is a compact, scannable pattern that stores
                information such as a website address, a note, or contact text.
                Point a phone camera at the code to open or read its content.
              </p>
              <p>
                Paste any supported content into the field, then choose Generate
                QR Code. You can download a high-resolution PNG for sharing or
                an SVG for crisp scaling in design files.
              </p>
              <p>
                This generator works entirely in your browser. Your content is
                encoded on your device and is never uploaded to a server.
              </p>
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
