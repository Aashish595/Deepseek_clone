import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
// import { ThemeProvider } from "@/context/ThemeContext";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          {/* <ThemeProvider> */}
            <AppContextProvider>
              <Toaster
                toastOptions={{
                  success: { style: { background: "black", color: "white" } },
                  error: { style: { background: "red", color: "white" } },
                }}
              />
              {children}
            </AppContextProvider>
          {/* </ThemeProvider> */}
        </body>
      </html>
    </ClerkProvider>
  );
}