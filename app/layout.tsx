import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'منظومة المقاولات الصناعية',
  description: 'نظام ERP محلي لإدارة حسابات ومشروعات شركات المقاولات الصناعية',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
