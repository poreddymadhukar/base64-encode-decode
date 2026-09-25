import { useState } from "react";
import { Check, Clipboard, Download, Eraser, ShieldCheck } from "lucide-react";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";

type Status = { kind: "idle" | "success" | "error"; message: string };

function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

function decodeBase64(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [status, setStatus] = useState<Status>({
    kind: "idle",
    message: "Ready to encode",
  });

  const processBase64 = () => {
    if (!input.trim()) {
      setOutput("");
      setStatus({
        kind: "error",
        message:
          mode === "encode"
            ? "Enter some text to encode first."
            : "Enter Base64 content to decode first.",
      });
      return;
    }
    try {
      const result =
        mode === "encode" ? encodeBase64(input) : decodeBase64(input);
      setOutput(result);
      setStatus({
        kind: "success",
        message:
          mode === "encode"
            ? "Text encoded successfully."
            : "Base64 decoded successfully.",
      });
    } catch {
      setOutput("");
      setStatus({
        kind: "error",
        message: "Invalid Base64 input. Please check the value and try again.",
      });
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setStatus({ kind: "success", message: "Result copied to clipboard." });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Clipboard access was unavailable. Select and copy the result manually.",
      });
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    try {
      const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        mode === "encode" ? "mariutil-base64.txt" : "mariutil-decoded.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus({ kind: "success", message: "Result downloaded." });
    } catch {
      setStatus({
        kind: "error",
        message: "The download could not be started. Please try again.",
      });
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setStatus({
      kind: "idle",
      message: mode === "encode" ? "Ready to encode" : "Ready to decode",
    });
  };

  const switchMode = (nextMode: "encode" | "decode") => {
    setMode(nextMode);
    setInput("");
    setOutput("");
    setStatus({
      kind: "idle",
      message: nextMode === "encode" ? "Ready to encode" : "Ready to decode",
    });
  };

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="app-shell">
        <section className="workspace" aria-labelledby="page-title">
          <div className="command-header">
            <div>
              <p className="eyebrow">Developer utility</p>
              <h1 id="page-title">Base64 Encoder &amp; Decoder</h1>
              <p className="intro">
                Encode text to Base64 or decode Base64 to text online.
              </p>
            </div>
            <div className="privacy-note">
              <ShieldCheck size={22} aria-hidden="true" />
              <div>
                <strong>100% Private</strong>
                <span>Your data never leaves your browser.</span>
              </div>
            </div>
          </div>

          <section
            className="generator-panel"
            aria-label="Base64 encoder and decoder"
          >
            <div
              className="mode-switch"
              role="tablist"
              aria-label="Base64 mode"
            >
              <button
                className={`button ${mode === "encode" ? "primary" : ""}`}
                type="button"
                onClick={() => switchMode("encode")}
                role="tab"
                aria-selected={mode === "encode"}
              >
                Encode
              </button>
              <button
                className={`button ${mode === "decode" ? "primary" : ""}`}
                type="button"
                onClick={() => switchMode("decode")}
                role="tab"
                aria-selected={mode === "decode"}
              >
                Decode
              </button>
            </div>

            <label className="input-label" htmlFor="base64-input">
              {mode === "encode" ? "Text to encode" : "Base64 to decode"}
            </label>
            <textarea
              id="base64-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 content to decode..."
              }
              spellCheck="false"
            />

            <div className="input-footer">
              <span>
                {mode === "encode"
                  ? "UTF-8 text is supported, including Unicode and emojis."
                  : "Whitespace is ignored while decoding."}
              </span>
              <span>{input.length.toLocaleString()} characters</span>
            </div>

            <button
              className="button primary generate-button"
              type="button"
              onClick={processBase64}
            >
              {mode === "encode" ? "Encode to Base64" : "Decode Base64"}
            </button>
          </section>

          <section
            className={`preview-panel ${output ? "has-output" : ""}`}
            aria-labelledby="output-title"
          >
            <div className="panel-header">
              <div>
                <span className="panel-label" id="output-title">
                  {mode === "encode" ? "Base64 Output" : "Decoded Text"}
                </span>
                {output && (
                  <span className="panel-meta">
                    {output.length.toLocaleString()} characters
                  </span>
                )}
              </div>
              {output && (
                <Check
                  size={18}
                  className="success-icon"
                  aria-label="Result ready"
                />
              )}
            </div>

            <textarea
              className="output-textarea"
              value={output}
              readOnly
              placeholder={
                mode === "encode"
                  ? "Your Base64 output will appear here..."
                  : "Your decoded text will appear here..."
              }
              spellCheck="false"
              aria-label="Base64 result"
            />

            {output && (
              <div className="download-actions" aria-label="Result actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => void copyOutput()}
                >
                  <Clipboard size={16} aria-hidden="true" /> Copy
                </button>
                <button
                  className="button"
                  type="button"
                  onClick={downloadOutput}
                >
                  <Download size={16} aria-hidden="true" /> Download
                </button>
              </div>
            )}
          </section>

          <div className="tool-actions">
            <button
              className="button"
              type="button"
              onClick={() => void copyOutput()}
              disabled={!output}
            >
              <Clipboard size={16} aria-hidden="true" /> Copy Result
            </button>
            <button
              className="button"
              type="button"
              onClick={clear}
              disabled={!input && !output}
            >
              <Eraser size={16} aria-hidden="true" /> Clear
            </button>
          </div>

          <div
            className={`status ${status.kind}`}
            role="status"
            aria-live="polite"
          >
            <span aria-hidden="true" /> {status.message}
          </div>

          <section className="tool-details" aria-labelledby="about-title">
            <div>
              <p className="eyebrow">About this tool</p>
              <h2 id="about-title">
                A fast and secure Base64 Encoder &amp; Decoder.
              </h2>
            </div>
            <div className="tool-details-copy">
              <p>
                Encode text into Base64 or decode Base64 back into readable
                text. The tool supports UTF-8 content, including multilingual
                text and emojis.
              </p>
              <p>
                Everything runs directly in your browser. Your text is never
                uploaded to a server, making this tool useful for encoding and
                decoding sensitive development data locally.
              </p>
              <p>
                Use Encode to convert text into Base64, or Decode to convert a
                valid Base64 string back into its original text.
              </p>
              <p>
                Base64 is commonly used when binary data or text needs to be
                represented using a text-friendly format. It is frequently
                encountered in applications involving JSON, XML, MIME data,
                APIs, data URLs, authentication headers, and other text-based
                data formats.
              </p>

              <p>
                <em>
                  <strong>Note:</strong> Base64 is an encoding format, not
                  encryption. It does not protect data from being read.
                </em>
              </p>
              <h3>How Base64 Encoding Works</h3>
              <p>
                Base64 is a generic term for conversion schemes that represent
                data using 64 printable ASCII characters (A-Z, a-z, 0-9, +, and
                /). It is commonly used to safely transport binary or text
                payloads inside formats like JSON, XML, or MIME-based emails
                without risk of corruption during transit.
              </p>
              <h3>Frequently Asked Questions</h3>
              <p>
                <strong>Q: Is my data uploaded to any server?</strong>
                <br />
                A: No. All encoding and decoding operations happen 100% locally
                within your browser's JavaScript environment for absolute
                privacy.
              </p>
              <p>
                <strong>Q: Can I encode emojis and special characters?</strong>
                <br />
                A: Yes. Full UTF-8 support is built-in, letting you handle
                unicode characters, symbols, and emojis effortlessly.
              </p>
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
