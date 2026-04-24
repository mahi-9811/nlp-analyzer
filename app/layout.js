import "./globals.css";

export const metadata = {
  title: "NLP Text Analyzer",
  description: "Analyze text with a local Ollama model and review saved results.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
