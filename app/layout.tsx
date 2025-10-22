import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Last Man Standing",
  description: "The ultimate football survival game",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body
        style={{
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "Orbitron, sans-serif",
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowX: "hidden",
        }}
      >
        <main style={{ flex: 1, width: "100%" }}>{children}</main>

        <footer
          style={{
            backgroundColor: "#000",
            color: "#9ca3af",
            textAlign: "center",
            padding: "1.5rem 1rem",
            fontSize: "0.85rem",
            borderTop: "1px solid #222",
          }}
        >
          <p>© {new Date().getFullYear()} Last Man Standing | Pub Games</p>
          <p style={{ marginTop: "0.5rem" }}>
            BeGambleAware | Terms & Conditions | Privacy Policy
          </p>
        </footer>
      </body>
    </html>
  )
}
