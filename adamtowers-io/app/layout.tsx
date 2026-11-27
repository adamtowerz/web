import "../styles/globals.css";

import type {Metadata} from 'next'
import {Playfair_Display, PT_Serif} from 'next/font/google'
import {SITE_DESCRIPTION, SITE_NAME} from './shared-metadata'

export const metadata: Metadata = {
    metadataBase: new URL('https://adamtowers.io'),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    authors: [{name: SITE_NAME}],
    // Drawn by app/icons/[name]/route.tsx, one per color scheme.
    icons: {
        icon: [
            {url: '/icons/light.png', type: 'image/png', sizes: '64x64', media: '(prefers-color-scheme: light)'},
            {url: '/icons/dark.png', type: 'image/png', sizes: '64x64', media: '(prefers-color-scheme: dark)'},
        ],
        apple: {url: '/icons/apple-touch.png', sizes: '180x180'},
    },
    openGraph: {
        type: 'website',
        siteName: SITE_NAME,
    },
    twitter: {
        // Shows the Open Graph card (app/**/opengraph-image.tsx) full width.
        card: 'summary_large_image',
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