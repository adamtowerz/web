import Link from "next/link";
import SingleColumn from "@/components/layout/SingleColumn";
import ArticleImage from "@/components/layout/ArticleImage";
import ArticleImageSet from "@/components/layout/ArticleImageSet";
import ArticleSection from "@/components/layout/ArticleSection";

export default function Senior() {
  return (
    <SingleColumn footer>
      <Link href="/honors">Honors Portfolio</Link>
      <h1>Senior Year</h1>
      <article>
        <p>
          I feel like I'm too close to this year to see the forest for the
          trees, maybe because I'm actively living it? I'm much happier this way
          though, I don't need to reflect on this yet. That time will come,{" "}
          <span className="thematic">
            but for now I'm here in the moment and I wouldn't have it any other
            way
          </span>
          . But obviously you can see there's content below this lil' para' so
          what's that about? There's some obvious stuff to talk about, so I'll
          do that and then maybe do another lap in a few years.
        </p>
        <hr />
        <ArticleSection title="Fall Quarter">
          <p>
            Come the fall I was back at school but there wasn't really a ton
            going on. It was the middle of the quarantine and life was sort of
            figured out. Notwithstanding the dull omnipresent fear of a sickly
            demise, things were fairly tranquil. I did a hard but cute puzzle,
            built a Lego, and played the latest Pokémon game.
          </p>
          <p>
            DubHacks '20 happened and it went fairly well; we were prepared. I
            also hacked away at some things, one has since become someone else's
            startup. I dyed my hair, played some video games, and drank Baileys.
            I went home for Christmas, and I'd gone home in September too.
            Wasn't home for Thanksgiving though, I never am.
          </p>

          <p>
            When I was home for Christmas I started an online store to sell
            sarcastic black hats &mdash;
            <a href="https://JustBlackHats.com" target="blank">
              JustBlackHats.com
            </a>
            , (go buy one or we're not friends)&mdash; and then I built an app
            to track my time which got retweeted a bunch and that was kind of
            cool:{" "}
            <a href="https://8760app.com" target="blank">
              8760
            </a>
            . Thinking back, I was super restless. Maybe that should've been
            obvious when I stayed up late after Christmas to write an essay
            about the meaning of life.
          </p>
          <p>
            My desire to create and build that when unsatiated makes me restless
            is good. It continually pushes me to learn new skills{" "}
            <span className="thematic">
              and throw myself at previously uncomfortably hard problems.
            </span>{" "}
            The restless-ness didn't last long though..
          </p>
        </ArticleSection>
        <ArticleSection title="Winter Quarter">
          <p>
            This was a packed quarter. And I loved it. I was a student, working
            part-time at work, TAing a class, doing contract software work, and
            eventually even building a student-run startup incubator at DH. I
            was on fire, flying as close to the Sun as I could. For maybe the
            longest sustained time in my life:{" "}
            <span className="thematic">
              I was <i>in it</i>.
            </span>
          </p>
          <p>
            I'd longboard from my apartment to Gasworks park, listening to music
            or a podcast, smiling. Life was electric, I was electric. I think a
            lot of people equate work with something they have to do, so the
            more someone is working the more unhappy they must be. But remember
            that whole thing about <i>living intentionally</i>, well I was doing
            it. This is what intentionality looked like for me at the time:
            doing absolutely everything I wanted to do and performing at the
            complete top of my game.
          </p>
          <p>
            I don't want this to come off as me boasting or flexing. I really
            really don't care about impressing you in this section or any
            section. Truly, I don't. Instead the takeaway should be that I felt
            good:{" "}
            <span className="thematic">
              that across all of what I was doing I was <i>in it</i>, not
              despite what I was doing but because of it.
            </span>
          </p>
        </ArticleSection>
        <ArticleSection title="Spring Quarter">
          <p>
            This section is really really fucking easy to write. The pandemic
            was coming to a close, we got our vaccines, and I finally got to see
            my friends again. That's it. That's all I can possibly say about
            this moment in time. All that matters about it.
          </p>
          <p>
            Maybe later I'll have some complicated, nuanced thoughts about
            graduation or about what comes next in my life but that's for later.
            Currently, I have so many better things to do than think about it.
            So many hugs to give, games to play, drinks to grab, jokes to make;{" "}
            <span className="thematic">
              so many moments to go and experience with people I've sorely
              missed. So I'm going to go do that.
            </span>
          </p>
        </ArticleSection>
        <p>- adam</p>
      </article>
      <div className="d-flex sp-between">
        <Link href="/honors/junior">← Junior year</Link>
      </div>
    </SingleColumn>
  );
}
