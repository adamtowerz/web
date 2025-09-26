import SingleColumn from "@/components/layout/SingleColumn";
import Article from "@/components/layout/Article";
import ArticlePara from "@/components/layout/ArticlePara";
import ArticleFootnote from "@/components/layout/ArticleFootnote";
import ArticleCodeBlock from "@/components/layout/ArticleCodeBlock";
import ArticleSection from "@/components/layout/ArticleSection";
import styles from "../../../styles/pages/blog/blog.module.scss";

export default function ConcernsPost() {
    const title = `Ephermerality, Absurdism, & Actualization`;
    const published_desc = "12/23/2020";
    return (
        <SingleColumn title={title} footer>
            <Article footnotes className={styles.slug}>
                <>
                    <h1>{title}</h1>
                    <ArticlePara>
                        published {published_desc}{" "}
                        {/* {post.date_edit_desc && <>, last edited {post.date_edit_desc}</>} */}
                    </ArticlePara>

                    <section>
                        <ArticlePara>
                            There are few, if any, bigger questions than "what is the meaning of life". I personally answer it, or at least try to answer it, in a way that you might find interesting so it's published here.
                        </ArticlePara>
                        <ArticlePara>
                            I don't think humans are special, I think we're the outcome of random chance. Somehow, somewhere, a few molecules bumped into each other the right way (or maybe the wrong way) and created a form that reproduced. Then, natural selection did its thing for a very long time and here we are.
                        </ArticlePara>
                        <ArticlePara>
                            There are three properties of our strange and coincidental existence that are particularly insightful to me when thinking about meaning.
                        </ArticlePara>
                    </section>
                    <ArticleSection title="Ephemerality">
                        <ArticlePara>
                            We are specks of dust that will appear, grow, and disappear in the blink of an eye. The universe does not establish a meaning for humans, it doesn't even know what we are.
                        </ArticlePara>
                        <ArticlePara>
                            No matter what you create, no matter what impact you have on people's lives, no matter how long you're remembered, eventually you'll be forgotten. Eventually, from the perspective of the universe, you may as well not have existed. But, my belief in the eventual heat death of the universe doesn't make what I feel here and now less real or valid.
                        </ArticlePara>
                        <ArticlePara>
                            My advice for myself is to not try and live forever. Choose a scope I care about and act to have an impact. Memories and legacies don't last forever but the impact I can have on the world and people around me is real and valuable.
                        </ArticlePara>
                    </ArticleSection>

                    <ArticleSection title="Absurdity">
                        <ArticlePara>
                            Humanity is absurd. The fact that in my hands is a machine that wields lightening to do math is absurd. And that next to me is a glass of some odd clear liquid that I must pour down my throat to survive, that's also absurd. There are so many different ways we could be (or not be), and somehow out of pure chance we landed on this one.
                        </ArticlePara>
                        <ArticlePara>
                            People are absurd too. Even though we're the deterministic outcome of synapses firing we somehow manage to be diverse, interesting, and complicated.
                        </ArticlePara>
                        <ArticlePara>
                            My advice for myself is to cherish that absurdity. Explore the world, meet all kinds of people, and never get bored.
                        </ArticlePara>
                    </ArticleSection>

                    <ArticleSection title="Actualization">
                        <ArticlePara>
                            The universe does not provide meaning. There's no scoreboard to reach the top of, or awards to win. We create those things for ourselves. Our desire to fill the void with meaning is something uniquely human, I want to think about this more.
                        </ArticlePara>
                        <ArticlePara>
                            This freedom to define our goals is both the most beautiful thing about our existence and a siren for dark paths. The worst people in history had excellent execution but terrible goals. The more you think you can accomplish, the more time you need to spend thinking about what to accomplish. If you don't spend that time upfront, you'll inevitably spend more time fixing what you've done later.
                        </ArticlePara>
                        <ArticlePara>
                            Of course, goals change along the way. I can't perfectly predict where I'll be or what I'll care about in 5 years, 25 years, or right before I die (which is hopefully far after both of those milestones). However, that isn't a reason to sit paralyzed and indefinitely ponder the future. I think that by thinking deeply about my goals now, I'll approximate my future goals. I hope that as I discover my path I won't have to course correct too much.
                        </ArticlePara>
                        <ArticlePara>
                            My advice for myself is to think critically about what I choose to care about, and to periodically rethink and adjust.
                        </ArticlePara>
                    </ArticleSection>


                    <ArticleSection title="Conclusion">
                        <ArticlePara>
                            TL;DR: care more about my impact more than my legacy; the world is weird, experience it; deeply think about my goals, but be flexible.
                        </ArticlePara>
                        <ArticlePara>
                            This was written to help me work through this topic for my own benefit, but I do hope you found some value too.
                        </ArticlePara>
                        <ArticlePara>
                            <i>Also, I got through this whole essay without an em dash. Yay.</i>
                        </ArticlePara>
                    </ArticleSection>
                </>
            </Article>
        </SingleColumn >
    );
}
