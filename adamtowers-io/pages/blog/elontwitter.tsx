import SingleColumn from "@/components/layout/SingleColumn";
import Article from "@/components/layout/Article";
import ArticlePara from "@/components/layout/ArticlePara";
import ArticleFootnote from "@/components/layout/ArticleFootnote";
import ArticleCodeBlock from "@/components/layout/ArticleCodeBlock";

export default function ElonTwitterPost() {
  const title = `Elon bought Twitter`;
  const published_desc = "04/25/22";
  return (
    <SingleColumn title={title} footer>
      <Article footnotes>
        <>
          <h1>{title}</h1>

          <ArticlePara>
            published {published_desc}{" "}
            {/* {post.date_edit_desc && <>, last edited {post.date_edit_desc}</>} */}
          </ArticlePara>

          <section>
            <ArticlePara>
             So, Elon Musk bought Twitter. And everyone has opinions. So here's mine.
            </ArticlePara>

            <ArticlePara>
                <ol>
                    <li>Twitter definitley hasn't kept pace with social media competition (fb, snap, tiktok, etc.) in terms of revenue or users.</li>
                    <li>The above isn't inherently a bad thing. Lots of people use the app and are very happy with it.</li>
                    <li>But, lots of people use the app and think it has lots of problem.</li>
                </ol>
            </ArticlePara>

          </section>
        </>
      </Article>
    </SingleColumn>
  );
}
