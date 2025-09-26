import Link from "next/link";
import SingleColumn from "@/components/layout/SingleColumn";
import ArticleImage from "@/components/layout/ArticleImage";
import ArticleImageSet from "@/components/layout/ArticleImageSet";
import ArticleSection from "@/components/layout/ArticleSection";

export default function Freshman() {
  return (
    <SingleColumn footer>
      <Link href="/honors">Honors Portfolio</Link>
      <h1>Freshman Year</h1>
      <article>
        <p>
          Freshman year was both incredibly fun, and a fucking grind. Coming to
          UW from out of state to compete for a spot in one of the most
          stressful majors was tough, and although I think I handled that stress
          fairly well it was hard. That being said, I don't remember much of the
          grind at all.{" "}
          <span className="thematic">
            What I do remember with high clarity is experiences with new friends
          </span>{" "}
          &mdash; maybe there's a lesson here, hmm.
        </p>
        <hr />
        <ArticleSection title="Week 1">
          <div className="d-flex align-center">
            <div style={{ marginRight: "1rem" }}>
              <p>
                <ArticleImage
                  src="/honors/freshman4.png"
                  caption="The view and additional fence in question"
                  right
                />
                I started freshman year off by immediately getting written up by
                the RA for sneaking out through a window onto the roof of my
                building with a gang of fellow hooligan college students to eat
                a pizza and admire the view. I'm still proud of how none of us
                (people who'd met earlier that day) ratted out the one fella who
                jumped an additional fence into the maintenance area for an even
                better view. No snitches in that squad.
              </p>

              <p>
                I'm not quite sure why I remember this incident so fondly, but
                it's likely rooted in how college gave me an oppurtunity to
                redefine myself and be a bit more rebellious. And honestly, its
                on the RAs for not locking the window.
              </p>
            </div>
          </div>
        </ArticleSection>
        <ArticleSection title="New friends">
          <p>
            Looking back,{" "}
            <span className="thematic">
              it's interesting to me how many people from fall quarter of
              freshman year remain in my life
            </span>
            . And it's also interesting how wrong I would've been if you asked
            me then who those would be. It's the boy I sat next to in A&amp;O,
            the girl I studied next to once for a math midterm, and the boy
            across from me in a writing class that made it. Not either of my
            roommates, nor many of the people I spent most of my time with.
            Here's a few photos from that first quarter, I'm not close with many
            of these people anymore but they're still happy memories.
          </p>
          <ArticleImageSet>
            <ArticleImage
              src="/honors/freshman2.png"
              caption="I still use this picture on dating app profiles, to mixed success"
            />
            <ArticleImage
              src="/honors/freshman1.png"
              caption="Someone told me to never wear that hoodie, I didn't listen"
            />
            <ArticleImage
              src="/honors/freshman3.png"
              caption="Never wonder how often the floor was vacuumed"
            />
          </ArticleImageSet>
        </ArticleSection>
        <ArticleSection title="CSE 390">
          <p>
            Most of my academics that year were a blur as I auto-pilot chased
            getting into CSE, but one class did escape the monotony: CSE 390, a
            special topics seminar. The seminar was taught by the{" "}
            <Link href="https://quillette.com/2020/01/11/demoted-and-placed-on-probation/">
              problematic
            </Link>{" "}
            Stuart Reges, and was a book club about{" "}
            <Link href="https://www.ynharari.com/book/homo-deus/">
              Homo Deus by Yuval Noah Harari
            </Link>
            . In the small seminar we talked about big questions like "what is
            different between humans and animals?" (spoiler: the answer was
            memes) and it was my first taste of collegiate academic discussion.
          </p>
        </ArticleSection>
        <ArticleSection title="More time w/ friends">
          <p>
            In winter and spring quarter{" "}
            <span className="thematic">
              I got close with a lot of my best friends to this day
            </span>
            . Funnily I met a lot of them by comically pining for a girl. Funny
            how things work out, and I'm endlessly appreciative for the
            forgiving social dynamics of university as I was kind of an idiot. I
            put 'kind of' in that sentence to make it a tiny bit funnier, but
            'idiot' alone is definitley more accurate. Lot of learnings here I
            won't go into :D. I am truly grateful for Terry Hall and the honors
            LLC for putting me in the same evironment as so many amazing people.
            Rare moment of sincerity over.
          </p>

          <p>
            Here's a few memories I really cherish from this time. I wish I took
            more pictures. I've always been torn on living in the moment vs
            taking photos, and I think over time I'm moving farther towards the
            latter.
          </p>

          <ArticleImageSet>
            <ArticleImage
              src="/honors/freshman9.png"
              caption="Waiting for I///U to get famous so I can tell my kids about this"
            />
            <ArticleImage
              src="/honors/freshman6.png"
              caption="Baking soft pretzels with friends, ignore the phallic one"
            />
            <ArticleImage
              src="/honors/freshman7.png"
              caption="Outdoor blurry night time arboretum adventures"
            />
          </ArticleImageSet>
        </ArticleSection>
        <ArticleSection title="Summer @ Intuit">
          <p>
            I managed to find my way to an internship that summer, mostly out of
            sheer dumb luck. It turns out that some of my hacking around speech
            and debate software in highschool piqued the interest of an Intuit
            employee who moonlighted making debate tech. I'd done some work for
            him and he introduced me to a coworker of his at Intuit and I
            somehow passed a very informal interview. Finding my way to Intuit
            really cemented a learning, although I didn't realize it at the
            time, that my casual side project hacking created oppurtunity for
            me.
          </p>

          <p>
            Over the summer I worked on evaluating the oppurtunity for Intuit to
            build features into Mint for users with consumer credit debt. I
            didn't know much, especially about credit cards or credit debt, but
            I was tenacious and asked a ton of questions. I interviewed users
            and it was brutally hard and sometimes miserable to ask them about
            their debt, some were so oblivious to the massive financial hole
            they were digging themselves into. I did learn, through some very
            hard conversations with users, that I really really enjoyed thinking
            about how to help them. This summer helped me{" "}
            <span className="thematic">
              distinguish between my presumed passion for
              engineering/programming and my real passion for building things
              that help people
            </span>
            .
          </p>
        </ArticleSection>
        <ArticleSection title="CSE">
          <div className="d-flex align-center">
            <div style={{ marginRight: "1rem" }}>
              <p>
                <ArticleImage
                  src="/honors/freshman5.png"
                  caption="Nick &amp; I, Intuit took all the interns on a cruise. Love big tech for that."
                  right
                />
                It was while I was at Intuit that I got into CSE. I remember
                that moment extremely clearly. I was sitting at my desk, which
                wasn't really a desk because the interns in my department had a
                giant table we shared in a hallway. So actually I was sitting in
                my hallway, kinda goofing off, chatting with my then coworker
                and now friend Nick. I felt a buzz from my phone and saw an
                email from the uni titled "Congrat..." the rest was cut off
                because of it being a notification. I tried to control my hopes,
                knowing very well this might not be the email I wanted it to be.
                It was, and I said that in sentence one of this paragraph, but I
                think this moment of worry is important. I don't think I'd ever
                acknowledged to myself just how insecure this process had made
                me. I smiled, hugged Nick (we weren't that close, but we were
                after), and walked outside to call my parents.
              </p>
            </div>
          </div>
          <p>
            I am happy the competitive major system for CSE is going away. I
            really wish that I didn't have so much to say about that painful,
            exhausting process. I internalized a lot of stress that I literally
            never dealt with. And I can't say I ever did process it, there was
            no growth here. I'm at least proud that I bet on myself that I could
            do it and did it first try (like not to flex, but also..), but fuck
            that shit no one deserves that experience.
          </p>
        </ArticleSection>
        <hr />
        <p>
          Bangin' year honestly. I'll moan and whine about CSE because it
          sucked, but don't get me wrong: all things told, this was an awesome
          year chock full of amazing memories in a new place with new people.
          It's always a risk moving to a new place, but{" "}
          <span className="thematic">
            by the end of this year I was extremely confident and optimistic
            about the future
          </span>
          .
        </p>
      </article>
      <div className="d-flex sp-between">
        <Link href="/honors">← Intro</Link>
        <Link href="/honors/sophmore">Sophmore year →</Link>
      </div>
    </SingleColumn>
  );
}
