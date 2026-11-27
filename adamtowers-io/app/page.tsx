import type {ReactNode} from 'react';
import HeroImage from '../components/HeroImage';
import PrintedText from '../components/PrintedText';

// A name with its brand mark inline before it, as a rounded tile sized to the surrounding text.
// Kept on one line so the mark never wraps away from the name.
function Logo({src, children}: {src: string; children: ReactNode}) {
    return (
        <span className="whitespace-nowrap">
            <img src={src} alt="" aria-hidden
                 className="inline-block size-[1em] rounded-[0.22em] mr-[0.3em] align-[-0.15em]"/>
            {children}
        </span>
    );
}

export default function Home() {
    // Larger type, and a proportionally wider column, on desktop.
    return (
        <div className="p-6 max-w-[600px] mx-auto md:max-w-[720px] md:text-[1.25rem]">
            {/* Doesn't match the current aesthetic. */}
            {/* <HeroImage/> */}
            <PrintedText className="mt-6">
                <h1 className="text-[1.5em]">Heya, I'm Adam</h1>
                I like to build things (mostly software), travel, play games with friends, and drive karts quick.
                <section className="mt-3 md:mt-6 grid gap-x-4 gap-y-2 grid-cols-[min-content_1fr] auto-rows-min">
                    <i className="text-right text-nowrap">2026 - now</i>
                    <p className="mb-0">Founded <a href="https://cura.inc" target="_blank"><Logo src="/logos/cura.png">Cura</Logo></a>, the portfolio
                        operating system for the AI-native VC</p>
                    <i className="text-right text-nowrap">2024 - 2026</i>
                    <p className="mb-0">Led AI at <a href="https://clarify.ai/" target="_blank"><Logo src="/logos/clarify.png">Clarify</Logo></a>, where
                        we made your CRM smarter</p>
                    <i className="text-right text-nowrap">2020 - 2024</i>
                    <p className="mb-0">Worked at <Logo src="/logos/productiv.svg">Productiv</Logo> where
                        I
                        built a bunch of platform features then led AI initiatives including the launch of <a
                            href="https://venturebeat.com/ai/productiv-launches-sidekick-an-ai-powered-assistant-for-smarter-saas-management/"
                            target="_blank"><Logo src="/logos/sidekick.png">Sidekick</Logo></a>
                    </p>
                    <i className="text-right text-nowrap">2020</i>
                    <p className="mb-0">Founded <a href="https://next.dubhacks.co/" target="_blank"><Logo src="/logos/dubhacks-next.png">DubHacks Next</Logo></a>, the
                        first student run startup incubator at UW
                    </p>
                    <i className="text-right text-nowrap">2017 - 2021</i>
                    <p className="mb-0"><span><Logo src="/logos/uw.svg">University</Logo> of Washington, Seattle:</span> Computer science &amp; interdisciplinary honors</p>
                </section>
                {/*<hr style={{margin: '18px 4px'}}/>*/}
                {/*<section>*/}
                {/*    Some fun things I've done*/}
                {/*    <ul style={{marginTop: '6px'}}>*/}
                {/*        <li><i>2022:</i> Started karting (the thrill of Mario Kart stopped being enough)</li>*/}
                {/*        <li><i>2020-2021:</i> Sold (sarcastic) hats on the internet</li>*/}
                {/*        <li><i>2020:</i> Built a time tracking app, got a bunch of users, but then realized I think time*/}
                {/*            tracking is silly and people should <i>just live</i></li>*/}
                {/*        <li><i>2019:</i> Made and sold a card game about birds</li>*/}
                {/*        <li><i>2018:</i> Made moonshine in my dorm freezer</li>*/}
                {/*    </ul>*/}
                {/*</section>*/}
                {/*<hr style={{margin: '18px 4px'}}/>*/}
                {/*<section>*/}
                {/*    Some links*/}
                {/*    <ul style={{marginTop: '6px'}}>*/}
                {/*        <li><a href="https://x.com/adamtowerz" target="_blank">X (formerly Twitter)</a></li>*/}
                {/*        <li><a href="/cal">My calendar</a></li>*/}
                {/*        <li>adam (at) towers (dot) email</li>*/}
                {/*    </ul>*/}
                {/*</section>*/}
            </PrintedText>
        </div>
    );
}