import "../styles/globals.css";

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

// Exposed as CSS variables, which styles/globals.css maps to the --font-headline and --font-text
// design tokens.
const headlineFont = Playfair_Display({
    weight: '600',
    subsets: ['latin'],
    variable: '--font-playfair',
});

const textFont = PT_Serif({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-pt-serif',
})


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${headlineFont.variable} ${textFont.variable}`}>
        <body>{children}</body>
        </html>
    );
}