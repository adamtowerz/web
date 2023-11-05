import SingleColumn from "@/components/layout/SingleColumn";
import Article from "@/components/layout/Article";
import ArticlePara from "@/components/layout/ArticlePara";
import ArticleFootnote from "@/components/layout/ArticleFootnote";
import ArticleCodeBlock from "@/components/layout/ArticleCodeBlock";
import ArticleSection from "@/components/layout/ArticleSection";
import styles from "./blog.module.scss";

export default function ConcernsPost() {
  const title = `Concerns and why they should be separated`;
  const published_desc = "xx/xx/xx";
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
              For how important "separation of concerns" is there are very few
              resources that define it from first principles and explain how and
              why to apply it. That's what I'll do here.
            </ArticlePara>
          </section>

          <section>
            <h2>Starting at the start</h2>
            <ArticlePara>
              Separation of concerns is a technique for writing good code, but
              what defines good code is not obvious. Let's start with defining
              good code.
            </ArticlePara>

            <ArticlePara center border pad>
              <i>Good code</i> is{" "}
              <b>
                easy to understand, easy to use, easy to extend, easy to change,
                and easy to test
              </b>
              .
              <ArticleFootnote symbol="1">
                Many people have many thoughts on what defines "good code", this
                definition likely displeases them but its enough for now.
              </ArticleFootnote>
            </ArticlePara>

            <ArticlePara>
              Note that, in theory, good code can't solve harder problems than
              bad code, its just easier to work with. In practice, however,
              writing good code is a neccessary prerequisite for humans
              attempting to solve complex problems because otherwise the
              complexity will quickly overrun the author(s) &mdash; no matter
              how bright they may be. Now onto the good stuff.
            </ArticlePara>
          </section>

          <section>
            <h2>
              Defining <i>concern</i>
            </h2>
            <ArticlePara center border pad>
              A <i>concern</i> is{" "}
              <b>
                a concept a{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Modular_programming"
                  target="_blank"
                >
                  module
                </a>{" "}
                must comprehend
              </b>
            </ArticlePara>
            <ArticlePara>
              This use of "comprehension" instead of "dependence" is a subtle
              one but I think it provides a more easily applicable definition.
              "Dependency" in software tends to refer to literal dependence at
              the code level, ie the import of a package or the invocation of a
              function. "Comprehension" is at a higher level: what facts must
              our module know to accomplish its goals? There are likely many
              facts that are not, and often cannot, be encoded or enforced by
              code. Recognition of these is important for identifying subtle
              concerns that are potentially important to separate.
            </ArticlePara>
          </section>
          <section>
            <h2>Types of concerns</h2>
            <ArticlePara>
              Before diving into what it means to separate concerns, let's make
              this a bit more concrete. When thinking about software systems we
              have a few kinds of concepts that immediately come to mind. Listed
              below in order of growing concern:
            </ArticlePara>
            <ul>
              <li>Knowing how primitives are defined: types, shapes</li>
              <li>
                Knowing how to call something locally: function signatures
              </li>
              <li>
                Knowing how to call something remotely: API specs + location
              </li>
              <li>
                Knowing properties of the environment: is this production? is{" "}
                <code>process.env.X</code> arg set to <code>y</code>?
              </li>
              <li>
                Knowing how something works (datastructures, runtime,
                unspecified behavior)
              </li>
            </ul>
            <ArticlePara>
              It is important to note that this is a hierarchy. Often it is
              impossible to remove a concern entirely, but we may not have to
              comprehend as much detail as we do.
            </ArticlePara>
          </section>
          <section>
            <h2>
              Defining <i>separation</i> (2)
            </h2>
            <ArticlePara>
              Consider the module <code>A</code> which comprehends concepts{" "}
              <code>i,j,k,x,y,z</code> to accomplish goal <code>α</code>. Let's
              assume all 6 concerns are fairly complex and nuanced, and are all
              neccessary to achieve <code>α</code>. At this point <code>A</code>{" "}
              is likely quite complex.
            </ArticlePara>
            <ArticlePara>
              Starting with <code>i,j,k</code>, let's create the module{" "}
              <code>B</code> to handle these responsibilities. To invoke{" "}
              <code>B</code>, <code>A</code> must comprehend the interface of{" "}
              <code>B</code> which we will name <code>b</code>. Now given{" "}
              <code>B</code> and <code>b</code>, the complete concerns of{" "}
              <code>A</code> are now <code>b,x,y,z</code>.
            </ArticlePara>
            <ArticlePara>
              Then, lets do the same for <code>x,y,z</code> with a module{" "}
              <code>C</code>. the complete concerns of <code>A</code> are now{" "}
              <code>b,c</code>.
            </ArticlePara>
            <ArticlePara>
              At this point it is important to that the set of all concerns
              within our little system has actually increased. What was{" "}
              <code>i,j,k,x,y,z</code> (6 total) is now{" "}
              <code>i,j,k,x,y,z,b,c</code> (8 total). However, from the
              perspective of <code>A</code> we have actually achieved something:
              it only has 2 concerns (<code>b,c</code>) instead of its previous
              6.
            </ArticlePara>
          </section>
          <section>
            <h2>
              Defining <i>separation</i>
            </h2>
            <ArticlePara>
              From the perspective of an individual module, we want to reduce
              the concerns we have (or at least their magnitude). However, at a
              global level the system still requires that behavior so we can't
              simply delete everything and carry on with our day. So we must
              move the concerns to other modules, separating them from our
              module. In this case, "it's not my problem" is the right answer.
            </ArticlePara>
            <ArticlePara center border pad>
              <i>Separation of concerns</i> is{" "}
              <b>reducing the concerns of a module by moving them to others</b>
            </ArticlePara>
            <ArticlePara>
              Or, phrased using our definition from earlier:{" "}
              <b>
                "reducing the amount a module must comprehend by moving concepts
                to other modules".
              </b>
            </ArticlePara>
            <ArticlePara>
              It is critical to note that moving code from <code>A</code> to{" "}
              <code>B</code> does not inherently reduce the amount of concerns{" "}
              <code>A</code> has, it only inherently reduces the amount of code
              <ArticleFootnote symbol="2">
                Reducing the amount of code is generally good, but not a goal of
                its own. Using LoC (lines of code) as a metric to optimize will
                yield incredibly bad (yet likely fascinating) code. For
                evidence:{" "}
                <a target="_blank" href="https://codegolf.stackexchange.com/">
                  Stackoverflow's Code Golf community
                </a>
              </ArticleFootnote>
              . It requires additional work to reduce the concerns. This work is
              creating a new, simpler, interface for <code>B</code> using which{" "}
              <code>A</code> can accomplish its origional goals without
              understanding as much about other concepts as it did. It is
              critical that this new interface is "lossy" (meaning that details
              are hidden from the client) otherwise although the code has been
              moved the concerns have not been.
            </ArticlePara>
            <h3>A formal definition</h3>
            <ArticlePara>
              Given the module <code>A</code> which comprehends concepts{" "}
              <code>X,Y,Z</code> to accomplish goal <code>α</code>, construct
              the module <code>B</code> such that <code>A</code> can use{" "}
              <code>B</code> to accomplish <code>α</code> while comprehending
              less than <code>X,Y,Z</code>.
            </ArticlePara>

            <ArticlePara>
              This implies the existence of a function{" "}
              <code>c: (concept) =&gt; number</code> which can measure the
              "amount of comprehension" concepts are worth, this function is the
              developer (you) applying the hierarchy above. This is good, if
              this was fully formally provable we'd all be out of a job.
            </ArticlePara>

            <h3>With an example</h3>
            <ArticlePara>TODO</ArticlePara>
          </section>
          <section>
            <h2>Why does separating concerns yield good code?</h2>
            <ArticlePara>Call back to good code</ArticlePara>
            <ArticlePara>
              Separating our concerns enables us to make progress towards each
              of those goals.
            </ArticlePara>
            <ul>
              <li>
                <b>Easy to understand:</b> Understanding the concerns of code is
                a prerequisite to understanding the code. You can't understand
                if code is correct without understanding the concepts it
                operates on. Less concerns means simpler code which easier to
                understand.
              </li>
              <li>
                <b>Easy to change:</b> Code needs to be understood before it can
                be changed so this follows from the previous point.
              </li>
              <li>
                <b>Easy to test:</b> Good tests test concerns. With less
                concerns there is less to test. Also, concerns of a lower
                magnitude tend to be easier to test correctly: it is generally
                easier to mock a function call than an API call and it is
                definitely easier to test either of those than the complete
                behavior encapsulated by a function or API.
              </li>
            </ul>
          </section>
          <section>
            <h2>Separating concerns: an example</h2>
            <ArticlePara>
              Let's go through an example: imagine you are developing a new
              feature and there is a requirement to log analytics events when
              the user takes an action. In this case you need to comprehend the
              analytics system's primitives ("events") and how to send the
              system an event. You hopefully do not need to understand any of
              the implementation details of the analytics system. Only the
              analytics system should be concerned with how the analytics system
              works. This is an example of separation of concerns: because you
              invoke a separate system which owns the behavior of how this event
              is proccessed/organized/visualized you are not concerned about
              those details. This is great, but there's more we can do here.
            </ArticlePara>
            <ArticlePara>
              Calling a remote system is a fairly complex process that requires
              comprehension of a lot of specific information; specifically out
              new feature would have to know how to make an API request, where
              the service is, and how to interpret its errors. In this example
              it would be good to separate the concerns around sending this
              event to a remote service from our new feature that simply wants
              to log an event. We could{" "}
              <a
                href="https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)"
                target="_blank"
              >
                encapsulate
              </a>{" "}
              this concern in a local utility for our new feature, perhaps
              called "AnalyticsClient", and invoke that local function to send
              an event. This pulls out the specific information about a remote
              call and abstracts over it by creating a local utility. The verb
              "abstract" is very apt here, the utility we are creating
              ("AnalyticsClient") presents an interface (in the form of a
              callable function) to our feature that allows it to access the
              behavior it needs (sending a message to the analytics service)
              without understanding how it works. Our feature understands less
              details (less concerns) so the behavior has been 'abstracted' away
              from it.
              <ArticleFootnote symbol="3">
                I'd expect almost any concern that can be sufficiently seperated
                from not one but many businesses to be a successful company
                (even, and maybe especially, for non-technical concerns).
              </ArticleFootnote>
            </ArticlePara>
            <ArticlePara>
              At a local level we're reducing the concerns our client has by
              moving them away. At the global level these concerns still exist
              but they've been separated into more manageable pieces so the
              individual pieces can do their jobs without comprehending as much
              of the whole system. This is the core idea of separating concerns.
            </ArticlePara>
          </section>
          <h2 id="anthology">Additional thoughts:</h2>
          <section>
            <h3>Declarative programming</h3>
            <ArticlePara>
              Although separation of concerns is predominantly applied at the
              service or class level, I think there's an interesting point to be
              made at the syntax level.
            </ArticlePara>
            <ArticlePara>
              Consider this example:
              <ArticleCodeBlock block>
                {`
              for (let i = 0; i < lst.length; i++) console.log(lst[i]);
              `}
              </ArticleCodeBlock>
              In order to print the list we've introduced a new concern: a
              counter called <code>i</code>. In order to understand what this
              line does we need to comprehend the application of this counter to
              iterate through the loop. I'd argue that replacing this{" "}
              <a
                href="https://en.wikipedia.org/wiki/Imperative_programming"
                target="_blank"
              >
                imperative
              </a>{" "}
              loop with a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Declarative_programming"
                target="_blank"
              >
                declarative
              </a>{" "}
              one like the next example is a separation of concerns.
              <ArticleCodeBlock block>
                {`
              lst.forEach(el => console.log(el));
              `}
              </ArticleCodeBlock>
              Behind the scenes, inside the standard library implementation of{" "}
              <code>forEach</code>, is a counter (maybe even also called{" "}
              <code>i</code>) but its not visible to us so it has been separated
              from our code. Without the additional concern that requires extra
              comprehension the code is simpler to read and the flow is easier
              to follow.
            </ArticlePara>
          </section>
        </>
      </Article>
    </SingleColumn>
  );
}
