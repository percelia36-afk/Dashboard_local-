// ...existing code...
export const metadata = {
  title: "Content Dashboard",
  description: "Creator tools",
};
import NavBar from "@/components/NavBar"; // Import NavBar for use in the layout

export default function RootLayout({ children }) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const isHome = pathname === "/";
  return (
    <html lang="en">
      <body className={isHome ? "flex" : ""}>
        {isHome && <NavBar />}
        <main className={isHome ? "flex-1" : ""}>{children}</main>
      </body>
    </html>
  );
}
