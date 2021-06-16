import SingleColumn from "@/components/layout/SingleColumn";
import Article from "@/components/layout/Article";
import ArticlePara from "@/components/layout/ArticlePara";
import ArticleFootnote from "@/components/layout/ArticleFootnote";
import ArticleCodeBlock from "@/components/layout/ArticleCodeBlock";

export default function ConcernsPost() {
  const title = `Concerns and why they should be separated`;
  const published_desc = "xx/xx/xx";
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
              I've heard the adage "separation of concerns" too many times to
              have never found a trail guide to identifying concerns in the wild
              and separating them when appropriate. So that's what I'll do here.
            </ArticlePara>
            <ArticlePara>
              Following this introduction is an anthology of my thoughts
              centered around how separation of concerns relates to other
              fundamental principles of computer science.{" "}
              <a href="#anthology">Click here to skip ahead.</a>
            </ArticlePara>
          </section>

          <h2>Trail guide</h2>
          <section>
            <h3>Defining 'concerns'</h3>
            <ArticlePara>
              "Concerns" relate to the roles pieces of a system play and how
              these pieces compose together to accomplish their shared goal.
              Therefor to think about concerns we'll role-play as a part of a
              big and complicated system. This part could be a function, a file,
              a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Modular_programming"
                target="_blank"
              >
                module
              </a>
              , a server in the case of a distributed system, or any other level
              in the hierarchy of your situation. For the purpose of this piece
              we'll use "module" to refer to any of these levels.
            </ArticlePara>
            <ArticlePara>
              Think about every function you call, module you depend on, or
              system you message. Then think about what happens when those
              things change. What if the function you call changes its behavior?
              Changes its signature? Or ceases to exist? What if the module you
              depend on or the system you message change similarly? Probably
              you're going to break. And also probably: they won't consult you
              before doing that.
            </ArticlePara>
            <ArticlePara>
              Initially, let's say a concern is{" "}
              <b>"for a module: code that breaks the module when it breaks"</b>.
            </ArticlePara>
            <ArticlePara>
              In a world (this one) where every possible thing{" "}
              <a
                href="https://en.wikipedia.org/wiki/Murphy%27s_law"
                target="_blank"
              >
                that can break will break
              </a>
              , everything is a 'concern'. The inherent fragility of code (or
              rather the fragility of the humans that create it) means that the
              only truly safe way to depend on code is to simply not depend on
              it. And dependency is broad: invoking a function is dependence,
              calling an API is dependence, reading a constant is dependence.
            </ArticlePara>
            <ArticlePara>
              With that in mind, we'll adjust the definition: a concern is{" "}
              <b>"code a module uses"</b>.
            </ArticlePara>
            <ArticlePara>
              "Code", however, is too strict a definition. In truth, we're not
              always concerned about the literal implementation of an idea as
              much as the concept itself. There are multiple levels:
            </ArticlePara>
            <ul>
              <li>
                Easy: bug in code <br />
                eg: a null pointer exception that needs to be patched
              </li>
              <li>
                Medium: changes in the code's abstractions <br />
                eg: a function name changes and all clients need to be
                refactored
              </li>
              <li>
                Hard: changes in concepts implemented by the code <br />
                eg: the authentication paradigm changes and all clients must
                understand and implement the new model
              </li>
            </ul>
            <ArticlePara>
              The most concerning case here is clearly the final one, which begs
              a larger scope for what a concern is:
            </ArticlePara>
            <ArticlePara center border pad>
              a concern is <b>"a concept a module must comprehend"</b>.
            </ArticlePara>
            <ArticlePara>
              This change from "dependence" to "comprehension" is a subtle one
              but I think it offers a more easily applicable definition.
              "Dependency" in software tends to refer to literal dependence at
              the code level, ie the import of a package or the invocation of a
              function. "Comprehension" is at a higher level: what facts does
              our module require to be true to operate as intended? There are
              likely many facts that are not, and often cannot, be enforced by
              code. Recognition of these is important for identifying dangerous
              latent concerns that are potentially the most important to
              separate.
            </ArticlePara>
          </section>
          <section>
            <h3>Types of concerns</h3>
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
            <h3>Defining "separation"</h3>
            <ArticlePara>
              From our perspective as an individual module, we want to reduce
              the concerns we have (or at least their magnitude), but at a
              global level they won't go away because the system still requires
              that behavior. Instead, they'll be present in other modules.
              Because they don't go away entirely it's called "separation of
              concerns" instead of "reduction of concerns".
            </ArticlePara>
            <ArticlePara center border pad>
              separation is <b>"reducing the concerns of a module"</b>.
            </ArticlePara>
          </section>
          <section>
            <h3>Why should I separate concerns?</h3>
            <ArticlePara>
              Good code{" "}
              <ArticleFootnote symbol="1">
                Many people have many thoughts on what defines "good code", this
                definition likely displeases them but its enough for now.
              </ArticleFootnote>{" "}
              is easy to write correctly, easy to understand, easy to change,
              and easy to test. Separating our concerns enables us to make
              progress towards each of those goals.
            </ArticlePara>
            <ul>
              <li>
                <b>Easy to write correctly:</b> With less concerns, the scope of
                a module is smaller and it is easier to get it right.
              </li>
              <li>
                <b>Easy to understand:</b> Understanding the concerns of code is
                a prerequisite to understanding the code. You can't understand
                if code is correct without understanding the concepts it
                operates on. Less concerns means simpler code.
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
                definitley easier to test either of those than the complete
                behavior encapsulated by a function or API.
              </li>
            </ul>
          </section>
          <p style={{ color: "red" }}>
            nothing below this point has been changed
          </p>
          <section>
            <h3>So I should separate EVERYTHING?</h3>
            <ArticlePara>
              Comprehending nothing about the world outside yourself seems to be
              a terrible goal as there are only two possible outcomes of such
              absolute pursuits:
              <ul>
                <li>
                  an enormous spaghetti monolith that contains absolutely
                  everything so it needs not know about anything outside itself
                </li>
                <li>
                  a set of tiny pure lil' modules who each know little and
                  because they cannot communicate (as to talk would require
                  comprehension of their shared existence) they accomplish very
                  little
                </li>
              </ul>
            </ArticlePara>
            <ArticlePara>
              Both of these options present important principles to "separating
              concerns". The former contends that if you separate nothing you
              can accomplish everything. This is true, but inevitably the debt
              of your own construction catches up with you when the spaghetti
              becomes too dense to untangle. The latter contends that if you
              separate everything you accomplish nothing, which is strictly
              worse than accomplishing something at the cost of your engineers'
              happiness.
            </ArticlePara>
            <ArticlePara>
              Thankfully we're not chasing absolute separation of every concept,
              instead separation of concerns is about minimizing where
              reasonable the number of concepts a given unit of code, a module,
              has to comprehend. We can even go a step further and instead of
              reasoning about code that understands concepts we can instead
              reason about concepts that understand concepts (eg: the login
              system understands the authorization and authentication concepts).
            </ArticlePara>
            <ArticlePara>
              This rule laid out above cheats utility with the ambiguous
              modifier "where reasonable". Lets delve into how to evaluate
              whether concerns should be separated. To do that, let's first take
              a slight detour into a few types of concerns that will be helpful
              in evaluating potential oppurtunities for separation.
            </ArticlePara>
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
              <ArticleFootnote symbol="2">
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
          <h2 id="anthology">In no particular order:</h2>
          <section>
            <h3>Concerns all the way down</h3>
            <ArticlePara>
              In the above example we observed two instances of separated
              concerns that operate at very different levels of abstraction. The
              first was at the systems level, by using an analytics service our
              new feature did not have to comprehend our analytics stack. The
              second was at the callsite, instead of calling our service via an
              API we abstracted that behavior into a local function.
            </ArticlePara>
            <ArticlePara>
              A reasonable question at this point is "how deep does this go?".
              Unhelpfully, I'd offer you the answer: "all the way". You can
              think about separating the concerns of systems and modules like we
              did above, and you can also consider the concerns of indvidual
              lines of code. Consider this example:
              <ArticleCodeBlock block margin>
                {`
              for (let i = 0; i < lst.length; i++) console.log(lst[i]);
              `}
              </ArticleCodeBlock>
              In order to print out this list we've introduced a new concern: a
              counter called <code>i</code>. I'd argue that replacing this{" "}
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
              <ArticleCodeBlock block margin>
                {`
              lst.forEach(el => console.log(el));
              `}
              </ArticleCodeBlock>
              Behind the scenes, inside the implementation of{" "}
              <code>forEach</code>, is a counter (maybe even also called{" "}
              <code>i</code>) but its not visible to us and no one can mess with
              it by accident.
            </ArticlePara>
            <ArticlePara>
              Concerns exist at every level and writing code that minimzes them
              by removing or obscuring them is generally a good thing.
            </ArticlePara>
          </section>
          <section>
            <h2>Rules of separation</h2>
          </section>
          <section>
            <h2>Case Study: OSI Model</h2>
          </section>
        </>
      </Article>
    </SingleColumn>
  );
}
