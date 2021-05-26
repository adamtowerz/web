import Link from "next/link";
import SingleColumn from "@/components/layout/SingleColumn";
import ArticleImage from "@/components/layout/ArticleImage";
import ArticleImageSet from "@/components/layout/ArticleImageSet";
import ArticleSection from "@/components/layout/ArticleSection";

export default function Home() {
  return (
    <SingleColumn footer>
      <Link href="/honors">Honors Portfolio</Link>
      <h1>Junior Year</h1>
      <article>
        {/* <p>
          Junior year was a blur. I took the spring off to work which with the
          advent of covid-19 turned out to be fairly serendipitious.
        </p>
        <hr /> */}
        <ArticleSection title="Apartment">
          <p>
            <ArticleImage
              src="/honors/junior1.png"
              caption="A very long and thin room."
              left
            />
            I finally had my own door: a lovely hinged plank of white-painted
            wood with a grey handle. With it came the ability to actually have
            my own space. You kind of forget how much that matters when you
            sleep three feet away from someone for two years. But I'm never
            giving it up again. Here's a picture of the end of my awkwardly thin
            room, I can't fit a queen bed in here but beggers can't be choosers.
          </p>
          <p>
            <ArticleImage
              src="/honors/junior2.png"
              caption="Life ain't bad."
              right
            />
            Though we did have an absolutely bangin' view of the city. On a good
            day we had the city in the middle, the space needle on the right,
            and Mt. Ranier on the left. Life definitely wasn't bad. Carson (one
            of my roommates) orchestrated the capture of two lovely blue
            recliners from his grandparents, so we drove down and in exchange
            for some manual labor escaped with the new center pieces of our
            living room. Being able to finally invest in (or rather steal)
            furniture made a massive difference in my quality of life, I've
            watched (and fallen asleep during) many movies in those lovely
            chairs.
          </p>
        </ArticleSection>
        <ArticleSection title="DubHacks '19">
          <p>
            <ArticleImage
              src="/honors/junior3.png"
              caption="Such a cute team."
              right
            />
            I joined the DubHacks team in January of 2019, and come October it
            was finally time for our big annual hackathon. We'd raised almost
            one hundred thousands dollars, invested in building bespoke software
            solutions, and brought one thousand people to the HUB. It had to go
            well right? Right??
          </p>
          <p>
            I'm creating tension for nothing, it actually went off almost
            perfectly. Of course our t-shirts for attendees were stuck on a
            derailed train in Oregon and judging was too slow leading to a team
            member awkwardly stalling for time on stage with hunders of people
            watching and waiting (the most I have ever cringed in my life), but
            honestly: pretty darn good. Deleriously wandering around at 4am
            seeing tons of students hacking away was incredibly fufilling. It
            was also super rewarding to see the investment I'd made in checkin
            technology work so well, I'd written code so we could do QR code
            based checkin and we managed to checkin 700+ hackers in an hour.
          </p>
        </ArticleSection>
        <ArticleSection title="JailBird">
          <ArticleImage
            src="/honors/junior4.png"
            caption="Stork Market Crash."
            left
          />
          <p>
            JailBird is a party card game created by my group during the
            Entrepreneurship Minor at UW's Creating a Company Series. In CaC
            students form groups and over the course of two quarters start,
            operate, and exit a small product-based business. As card game
            lovers we decided to design, manufacture, and sell a party card
            game.
          </p>
          <p>
            I managed the technical operations including our website and
            direct-to-consumer ecommerce business. When we had momentum I was{" "}
            <i>in it</i>, but then we grossly mismanaged manufacturing and those
            shenanigans just went on and on and on and on. I wasn't <i>in it</i>{" "}
            anymore. I suppose I learned that its real darn hard to make
            physical things, especially compared to software. But honestly, I
            should've left the moment the class was over. I was simultaneously
            chronically disappointed in our operational excellence (or lack
            thereof) and unwilling to step in and try and do better;{" "}
            <b>I should've just left</b>. Instead I dragged it out for a bit,
            and eventually, when push came to shove, quit.
          </p>
          <p>
            The game looks hecka cute and is super fun, the art team did an
            excellent job.{" "}
            <b>
              I just wasn't <i>in it</i>.
            </b>
          </p>
        </ArticleSection>
        <ArticleSection title="Early Covid">
          <p>
            Covid-19 seemed to start slow and then come all at once. I was at a
            concert with friends in early March, and then we went to Whistler,
            Canada. No worries at all, just hearing news from China and
            expecting the story to blow over by the summer.
          </p>
          <ArticleImageSet caption="The calm before the long, long storm">
            <ArticleImage src="/honors/junior6.png" />
            <ArticleImage src="/honors/junior7.png" />
            <ArticleImage src="/honors/junior5.png" />
          </ArticleImageSet>
          <p>
            Once it did hit, it was a weird and scary time. The covid-19
            pandemic obviously took a while to resolve (and it hasn't fully
            resolved yet at time of writing) but most of the time we knew the
            deal. At the start, however, no one really knew what was safe and
            what wasn't. At that point, could you even order takeout? I remember
            reading an article in The New Yorker before deciding it was safe to
            order some poké (it was some good poké). Thankfully I was in the
            priviledged position of being able to hide away in doors and
            continue to play video games and write code. It was a bit miserable
            and shopping for food and essentials was nerve-wracking but that
            quickly became the norm. I'd already decided that I was going to
            take the spring off, and I'm glad I did as Zoom university was (and
            is) a complete waste of time and energy.
          </p>
        </ArticleSection>
        <ArticleSection title="Productiv">
          <p>
            I took spring off to do a double length internship with a technology
            startup called Productiv. This was the direct result of my learnings
            from CSE599 and my time at Google, so I was thrilled to work in a
            smaller and faster paced environment. I got exactly what I was
            looking for: a ton of ownership, an expectation to ship quickly, and
            I was learning a lot. It was a bit frusturating at times because I
            had to learn how to operate in a much smaller organization than I
            was used to, but my coworkers were great and I picked it up quickly.
          </p>
          <p>
            Although I'd met my boss and a few other employees in person
            pre-pandemic, I onboarded entirely remotely. The first two-thirds of
            my first day consisted of me standing around in my apartment
            building's lobby waiting to pickup a MacBook that was shipped to me
            &mdash; super, super exciting. Meeting people over Zoom is hard, and
            thankfully we did weekly "coffee chats" where employees were paired
            up to have casual chats, but nonetheless it was hard to feel apart
            of the company when the surface area of my interaction was the
            computer screen. Eventually when I got to demo my work I felt much
            more engaged, it felt really good to show off what I was working on
            to the whole company and get praise and appreciation. And, it turns
            out that the feature I was working on would later be the cover image
            of{" "}
            <a href="https://www.wsj.com/articles/startup-productiv-raises-45-million-in-new-funding-11617190200">
              a Wall Street Journal article
            </a>{" "}
            about the company.
          </p>
          <p>
            Overall, this experience validated that startups were where I wanted
            to be. So I stayed, and, at least at the time of writing, am still
            working at Productiv.
          </p>
        </ArticleSection>
        <ArticleSection title="Hack '20">
          <p>
            <ArticleImage src="/honors/junior8.png" caption="Reality" right />
            After an incredible in-person DubHacks '19 it felt terrible to have
            to change the formula and try doing it online. One fundamental
            pillar of our event was the social experience of meeting new people
            and organically engaging with like-minded peers and no amount of
            Zoom and Slack could match the dynamism of real life. With that in
            mind DubHacks tech (which I was running) got to work building a
            virtual experience to that could house the same organic social
            dynamism of real life. We called it <i>Reality</i> and it was an
            old-school Pokémon-esque virtual world with drop-in-drop-out audio.
            This is all a fancy way of saying "you move with the arrow-keys and
            you could talk to people".
          </p>
          <p>
            Reality took months to develop but witnessing hackers meet and
            engage in our world was an incredible experience.
          </p>
        </ArticleSection>
        <hr />
        <p>
          Freshman year was about new people and sophmore year about finding my
          passions. So maybe it seems like a let down that junior year doesn't
          have an obvious theme or set of learnings to list here, but I don't
          think it is. Junior year was a time of validation and refinement:
          ensuring that those things I thought I thought were right. Continuous
          radical change is generally pointless, instead you want to tune down
          the magnitude of change as you approach your goal (I am painfully
          aware that it is a very me thing to turn life into an optimization
          problem, but its also not inaccurate). This year was a part of that
          approach towards a more and more accurate Adam, there wasn't radical
          change (beyond pandemic adaptation) because things were going well.
          Cheers to that.
        </p>
      </article>
      <div className="d-flex sp-between">
        <Link href="/honors/sophmore">← Sophmore year</Link>
        <Link href="/honors/freshman">TODO: Senior year →</Link>
      </div>
    </SingleColumn>
  );
}
