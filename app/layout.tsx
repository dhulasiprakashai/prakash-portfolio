import "./globals.css";
export const metadata = {
  title: "Prakash S — Web Apps • Automation • Integrations",
  description: "Prakash S portfolio and project management website."
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><div className="grid"/>{children}</body></html>;
}
