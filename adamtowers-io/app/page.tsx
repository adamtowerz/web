import HeroImage from '../components/HeroImage';

export default function Home() {
    return (
        <div className="p-6 max-w-[600px] mx-auto">
            <HeroImage/>
            <div className="mt-6">
                <h1 style={{ fontFamily: 'var(--font-family-headline)' }}>Heya, I'm Adam</h1>
                I like to build things (mostly software), travel, play games with friends, and drive karts quick.
                <section className="mt-3 md:mt-6 grid! gap-x-4 gap-y-2 grid-cols-[min-content_1fr] auto-rows-min">
                    <i className="text-right text-nowrap">2024 - now</i>
                    <p className="mb-0!">I lead AI at <a href="https://clarify.ai/" target="_blank">Clarify</a>, where
                        we're making your CRM smarter</p>
                    <i className="text-right text-nowrap">2020 - 2024</i>
                    <p className="mb-0!">Worked at <a href="https://productiv.com/" target="_blank">Productiv</a> where
                        I
                        built a bunch of platform features then led AI initiatives including the launch of <a
                            href="https://venturebeat.com/ai/productiv-launches-sidekick-an-ai-powered-assistant-for-smarter-saas-management/"
                            target="_blank">Sidekick</a>
                    </p>
                    <i className="text-right text-nowrap">2020</i>
                    <p className="mb-0!">Founded <a href="https://next.dubhacks.co/" target="_blank">DubHacks Next</a>, the
                        first student run startup incubator at UW
                    </p>
                    <i className="text-right text-nowrap">2017 - 2021</i>
                    <p className="mb-0!"><span>University of Washington, Seattle:</span> Computer science &amp; interdisciplinary honors</p>
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
            </div>
        </div>
    );
}