import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy Women's Day 8/3 💕 - Dành tặng vợ yêu",
  description: "Chúc mừng ngày Quốc tế Phụ nữ 8/3. Dành tặng người phụ nữ tuyệt vời nhất!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Quicksand', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
