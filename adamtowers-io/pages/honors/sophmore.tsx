import Link from "next/link";
import SingleColumn from "@/components/layout/SingleColumn";
import ArticleImage from "@/components/layout/ArticleImage";
import ArticleImageSet from "@/components/layout/ArticleImageSet";
import ArticleSection from "@/components/layout/ArticleSection";

export default function Home() {
  return (
    <SingleColumn footer>
      <Link href="/honors">Honors Portfolio</Link>
      <h1>Sophmore Year</h1>
      <article>
        <p>
          If freshman year was about meeting the people I'd stick with, then
          sophmore year was about meeting the passions I'd stick with. This is
          an awfully artsy way of saying that{" "}
          <b>I discovered technology entrepreurship.</b> I also got my lowest
          grade ever in college, participated in an extremely dysfunctional hall
          council, and survived the snowmageddon.
        </p>
        <hr />
        <ArticleSection title="Math 308">
          <p>
            After getting into CSE I immediately took a lazy 12 credit quarter.
            "Linear algebra?", I thought to myself as I figured out my course
            load, "well I know linear and I know algebra, how bad can it be?".
            Well.. it was bad, real bad.
          </p>
          <p>
            <ArticleImage
              src="/honors/sophmore1.png"
              caption="Still salty."
              right
            />
            I had this professor who was supposedly a genius. And it wasn't even
            supposedly, it was extremely obvious he was a genius. The mad lad
            discovered the sets of numbers that modern cryptography uses so we
            can browse the internet with a semblance of privacy. And I'd think
            that was super super cool if he wasn't such a god awful lecturer. I
            don't want your sympathy. It's not even that bad a grade. I'm
            writing about this because I want you to know that I got the last
            laugh. While Koblitz was droning on about content I would re-teach
            myself with YouTube a year later, I quietly sat at the back and
            applied for jobs. So despite how INCREDIBLY BORING AND USELESS AND
            PAINFUL those lectures were I MADE IT WORK (please do appreciate the
            pun on the word "work" here).
          </p>
        </ArticleSection>
        <ArticleSection title="DH '18">
          <p>
            <ArticleImage
              src="/honors/sophmore2.png"
              caption="Caffeine and snacks and caffeine and snacks."
              left
            />
            Fall quarter wasn't all bad though, it was also the time of year for
            DubHacks: "the largest hackathon in the PNW" (little did I know at
            the time how many times I would say that sentence). With a gang of
            friends new and old I attended the event and over 36 hours developed
            a tool that interpeted people's facial expressions and presented
            them in a visualization that could be more easily understood by
            people with social disabilities like autism spectrum disorders.
            Which sounds super impressive, but like most hackathon projects was
            an amalgamation of off-the-shelf pieces assembled in a pretty way
            with little chance of meaningful commercialization (this idea is
            important for later, but no spoilers). Nonetheless it was an amazing
            experience and we won a bunch of prizes, including a longboard I
            still ride to this day.
          </p>
          <p>
            Having been on the DubHacks team for 3 years now, this event was the
            start of my most meaningful contribution to this campus and I am so
            so happy I attended.
          </p>
        </ArticleSection>
        <ArticleSection title="CSE 599">
          <p>
            In the winter I took Software Entrepreneurship, a multi-disciplinary
            elective that brings together engineers, designers, and business
            students to pitch and build software startups: so that's exactly
            what we did. The class started with every student pitching a company
            in a minute and then teams formed around the most popular ideas (how
            did my idea do, you wonder? Shot down immediately :D). Over the next
            8 weeks we ideated, validated, prototyped, and presented our work.
            There's a rare feeling of being <i>in it</i> that I've only felt a
            few times in my life. In this class, I was <i>in it</i>.
          </p>
          <p>
            My team toiled for weeks, pivoting left and right trying to find a
            direction that would be a great business. Eventually we settled on
            compensation analytics, we wanted to use crowd-sourced data to help
            people get paid what they deserve and to help companies acquire and
            retain talent by crafting best-in-class offers. I vividly remember
            the energy of presenting in front of a crowd of peers and investors
            downtown at Pioneer Square Labs' offices, this was <i>it</i>.
          </p>
          <p>
            The final went well and our startup, Bottomline, took first. So we
            kept going.
          </p>
        </ArticleSection>
        <ArticleSection title="Bottomline">
          <p>
            After the class the natural next step was the Dempsey startup
            competition. CSE, or Ed specifically, was gracious enough to fund
            our competition expenses including a banner for the tabling stage
            and t-shirts so we coud look fly (or as fly as a bunch of tech nerds
            with a logo on their chest could ever look). We practiced and
            practiced, honing our demo and pitch. Eventually we got to the final
            4 (of more than 100 teams) and got to pitch to an audience, another
            moment I will never forget. We took 3rd, winning $7k on a big check
            for our efforts.
          </p>
          <p>
            <ArticleImage
              src="/honors/sophmore4.png"
              caption="That check was such a pain to carry around."
              right
            />
            After the momentum of the competition and the class began to fade,
            so did we. Some of us had internships, some had fulltime jobs;
            everyone had other obligations. I tried to hang-on for a while but
            eventually when push came to shove as my internship sucked up my
            energy, I left and the team disbanded. I wasn't the first to leave,
            but it felt shitty to be the straw that broke the camel's back.
          </p>
          <p>
            I'm still incredibly proud of the work we did, even though in the
            end this wasn't <i>it</i>. But importantly, this experience proved
            to me that this was what I wanted to do. Not <i>this</i> as
            Bottomline specifically,{" "}
            <b>
              but now I knew small technology startups were where I wanted to
              be.
            </b>{" "}
            I then spent that summer at Google, oops.
          </p>
        </ArticleSection>
        <ArticleSection title="TAing CSE 340">
          <p>
            I've always enjoyed teaching, so it was a natural step to be a TA.
            After trying to be an intro CS TA and getting denied (their loss), I
            moved my eyes upfield to higher level classes. One that piqued my
            interest was CSE 340, a human centered interaction (HCI) class
            taught through Android programming that had never been taught
            before.
          </p>
          <p>
            I knew nothing about the course material, but I applied anyway
            because I liked both interface programming and the chaos of new
            classes. I was definitely right about the chaos, the course staff
            worked really hard to adjust the pacing and difficulty as we went. I
            particularly enjoyed participating in the pedagocial discussions
            about how we were constructing and grading the assignments and
            exams. I got to take on much more responsibility than a normal a TA,
            and I enjoyed the oppurtunity to have a longterm impact on the
            course.
          </p>
          <p>
            I also returned to be the head TA the following quarter. It was
            satisfying to iterate further on the work I'd started in the
            course's inaugural quarter.
          </p>
        </ArticleSection>
        <ArticleSection title="Hall Council Ls">
          <p>
            So far I've covered material where I was thriving doing exactly what
            I should be doing. Hall council was not that. For the peanut
            gallery's reference: hall council is a dorm-level organization that
            puts on programming (not my kind of programming, the event kind) for
            dorm residents. Off the bat this is something I really do not care
            about at all, but I did it anyway because I had a bunch of friends
            doing it: problem one. My squad interviewed for every role and got
            all but one of the seats on the executive board for our dorm, and I
            was going to do marketing. I really do not care about marketing:
            problem two. And then, to put insult to injury the friend group that
            ran the hall council fractured and some people were not talking to
            each other by the end of it: problem three. Absolute dysfunction.
          </p>
          <p>
            Although, in terms of raw output we were actually one of the best
            hall councils. We had more engagement and attendance than almost any
            other hall that year, but what does that say about the other hall
            councils though...
          </p>
          <p>
            Problem three is hopefully a one-off, but one and two have a simple
            solution that I've been working on: <b>living intentionally</b>.
            Don't do things on autopilot, don't do things because they're right
            in front of me, do things only because I want to do them and care
            about doing them well.
          </p>
        </ArticleSection>
        <ArticleSection title="Summer">
          <p>
            Outside of working, this summer was amazing (not to say work wasn't
            fun, because that's about all it was). I had some close friends
            visit me down in the Bay; one interesting facet of going away for
            school is that I had two separate lives: my family (and dog) at
            home, and my friends at school. This was a fun crossover event. I
            remember thinking at the time{" "}
            <b>"wow, I have friends that will literally fly to come see me"</b>{" "}
            and feeling all warm and happy. Anyway, here's some picz
          </p>
          <ArticleImageSet caption="There's something about showing people around that makes old views especially beautiful">
            <ArticleImage src="/honors/sophmore6.png" />
            <ArticleImage src="/honors/sophmore8.png" />
            <ArticleImage src="/honors/sophmore7.png" />
          </ArticleImageSet>
          <p>
            <ArticleImage
              src="/honors/sophmore9.png"
              caption="I really, really want to go back."
              right
            />
            Along with having friends come to visit I was working one city over
            from my girlfriend. Introducing her to my parents felt like a
            growing up moment, not that they hadn't met previous romantic
            entanglements of mine but this time it was college, so obviously it
            was different (it wasn't, but reading into things as rites of
            passage seems like a part of growing up). We also went on a trip
            together to San Francisco to attend a music festival, that also felt
            like a step in getting older.
          </p>
          <p>
            I think this summer marked a latent transformation in the kinds of
            relationships I had/have with friends and partners.
          </p>
        </ArticleSection>
        <ArticleSection title="Google">
          <p>
            So it was really validating to get an internship at Google, I mean
            there's a whole movie about it starring Owen Wilson and I got to
            walk around Mountain View saying "wow" in his voice. And my team was
            super cool and I can tell you very little about it, which makes it
            extra cool. Nonetheless, this was not a fit for me.
          </p>
          <p>
            <ArticleImage
              src="/honors/sophmore5.png"
              caption="Meeting bikes! What pragmatism!"
              right
            />
            I worked with some incredibly bright and talented people, but I
            never felt an incredible pressure to work hard. For many people
            that's great, they want a fourty hour week that pays well; one day
            I'll want that too, probably when I have a family and other
            priorities. At the moment, though, I love the pressure and the
            ownership that comes with it.{" "}
            <b>
              I want things to break and people to get mad when I fuck up,
              because if I'm insulated from causing trouble then I'm not having
              a big enough impact.
            </b>
          </p>
        </ArticleSection>
        <hr />
        <p>
          This year grew the depth of my relationships and cemented my career
          path, which is sort of the whole point of college. Oddly the themes
          and lessons of this year are so obviously self-evident that I don't
          have to say much here. I'll leave this paragraph, though, because some
          people (hopefully you, I guess) find meandering streams of
          conciousness interesting. It's the most literal picture of my brain
          that I can provide. Anyways, onwards.
        </p>
      </article>
      <div className="d-flex sp-between">
        <Link href="/honors/freshman">← Freshman year</Link>
        <Link href="/honors/junior">Junior year →</Link>
      </div>
    </SingleColumn>
  );
}
