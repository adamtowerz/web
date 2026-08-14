import "../styles/base.css";
import "../styles/theme.scss";
import "../styles/tailwind.css";

import type {Metadata} from 'next'
import {Playfair_Display, PT_Serif} from 'next/font/google'

export const metadata: Metadata = {
    metadataBase: new URL('https://adamtowers.io'),
    title: {
        default: 'Adam Towers',
        template: '%s | Adam Towers',
    },
    description:
        'Adam Towers builds things — mostly software. He founded Cura, the portfolio operating ' +
        'system for the AI-native VC, and previously led AI at Clarify and Productiv.',
    authors: [{name: 'Adam Towers'}],
    openGraph: {
        type: 'website',
        siteName: 'Adam Towers',
    },
    twitter: {
        card: 'summary',
        site: '@adamtowerz',
        creator: '@adamtowerz',
    },
};

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