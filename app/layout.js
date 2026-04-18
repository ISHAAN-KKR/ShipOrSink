import './globals.css';

export const metadata = {
  title: 'AI Judges Your Life Choices',
  description: 'An AI that judges your life decisions with brutal humor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
