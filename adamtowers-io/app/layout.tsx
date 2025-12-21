import "../styles/base.css";
import "../styles/theme.scss";
import "../styles/tailwind.css";

import {Playfair_Display, PT_Serif} from 'next/font/google'

const headlineFont = Playfair_Display({
    weight: '600',
    subsets: ['latin'],
});

const textFont = PT_Serif({
    weight: '400',
    subsets: ['latin'],
})


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" style={{
            // @ts-ignore
            '--font-family-headline': headlineFont.style.fontFamily,
            '--font-family-text': textFont.style.fontFamily,
            fontFamily: 'var(--font-family-text)',
        }}>
        <body>{children}</body>
        </html>
    );
}