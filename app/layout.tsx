import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://industrial-contracting-project.vercel.app'),
  title: 'منظومة المقاولات | ERP متكامل لشركات المقاولات الصناعية',
  description: 'نظام ERP لإدارة المشروعات والمشتريات والمخازن والمستخلصات والتكاليف والدورة المحاسبية لشركات المقاولات الصناعية.',
  openGraph: {
    title: 'منظومة المقاولات | ERP متكامل لشركات المقاولات الصناعية',
    description: 'نظام ERP لإدارة المشروعات والمشتريات والمخازن والمستخلصات والتكاليف والدورة المحاسبية لشركات المقاولات الصناعية.',
    url: '/',
    siteName: 'منظومة المقاولات',
    locale: 'ar_EG',
    type: 'website',
    images: [{ url: '/og.png', width: 2048, height: 1080, alt: 'منظومة المقاولات — ERP متكامل لشركات المقاولات الصناعية' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'منظومة المقاولات | Industrial Contracting ERP',
    description: 'إدارة المشروعات والتكاليف والدورة المحاسبية لشركات المقاولات الصناعية.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
