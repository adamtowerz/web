import SingleColumn from "@/components/layout/SingleColumn";
import ArticlePara from "@/components/layout/ArticlePara";

export default function ConcernsPost() {
  const title = `What's a concern and why should they be separated?`;
  const published_desc = "xx/xx/xx";
  return (
    <SingleColumn title={title} footer>
      <article>
        <h1>{title}</h1>

        <ArticlePara>
          published {published_desc}{" "}
          {/* {post.date_edit_desc && <>, last edited {post.date_edit_desc}</>} */}
        </ArticlePara>

        <section>
          <ArticlePara>
            As an active practioner of computer science (read as: someone too
            young to have any authority on the matter but you'll continue
            reading anyway), I've heard the adage "separation of concerns" too
            many times to have never found a trail guide to identifying concerns
            in the wild and separating them when appropriate. So that's what
            I'll do here.
          </ArticlePara>
        </section>

        <section>
          <h2>So what is a 'concern'</h2>
          <ArticlePara>
            To think about concerns you need to role-play. Put on the hat of the
            chunk of code, module, or system you are currently concerned about
            (no pun intended) and see the world only as it perceives it. Think
            about every function it calls, module it depends on, or system it
            messages.
          </ArticlePara>
          <ArticlePara>
            Then think about what happens when those things change. What if a
            function you call changes its behavior? Changes its signature? Or
            ceases to exist? What if the module you depend on or the system you
            message change similarly? Probably you're going to break. And also
            probably: they won't consult you before doing that.
          </ArticlePara>
          <ArticlePara>
            Initially, I'd say a concern is "code that if it were to break would
            make you sad".
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
            only safe way to interact with code is to simply not interact with
            it. And interaction is broad: invoking a function is interaction,
            calling an API is interaction, reading a constant is interaction.
          </ArticlePara>
          <ArticlePara>
            With that in mind we'll adjust the definition: a concern is "code
            you use", both internal to the module in question and outside of it.
          </ArticlePara>
          <ArticlePara>
            "Code", however, is too strict a definition. In truth we're not
            always concerned about the literal implementation of an idea as much
            as the idea itself. There's multiple levels:
            <ul>
              <li>
                Easy: bug in code <br />
                eg: a null pointer exception which needs to be patched
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
          </ArticlePara>
          <ArticlePara>
            The most concerning case here is clearly the final one, which begs a
            larger scope for what a concern is:
          </ArticlePara>
          <ArticlePara center border pad>
            a concern is "a concept you comprehend"
          </ArticlePara>
        </section>
        <section>
          <h2>So I should separate EVERYTHING?</h2>
          <ArticlePara>
            Comprehending nothing about the world outside yourself seems to be a
            terrible goal as there are only two possible outcomes of such
            absolute pursuits:
            <ul>
              <li>
                an enormous spaghetti monolith that contains absolutely
                everything so it needs not know about anything outside itself
              </li>
              <li>
                a set of tiny pure lil' modules who each know little and because
                they cannot communicate (as to talk would require comprehension
                of their shared existence) they accomplish very little
              </li>
            </ul>
          </ArticlePara>
          <ArticlePara>
            Both of these options present important principles to "separating
            concerns". The former contends that if you separate nothing you can
            accomplish everything. This is true, but inevitably the debt of your
            own construction catches up with you when the spaghetti becomes too
            dense to untangle. The latter contends that if you separate
            everything you accomplish nothing, which is strictly worse than
            accomplishing something at the cost of your engineers' happiness.
          </ArticlePara>
          <ArticlePara>
            Thankfully we're not chasing absolute separation of every concept,
            instead separation of concerns is about minimizing where reasonable
            the number of concepts a given unit of code, a module, has to
            comprehend. We can even go a step further and instead of reasoning
            about code that understands concepts we can instead reason about
            concepts that understand concepts (eg: the login system understands
            the authorization and authentication concepts).
          </ArticlePara>
          <ArticlePara>
            This rule laid out above cheats utility with the ambiguous modifier
            "where reasonable". Lets delve into how to evaluate whether concerns
            should be separated. To do that, let's first take a slight detour
            into a few types of concerns that will be helpful in evaluating
            potential oppurtunities for separation.
          </ArticlePara>
        </section>
        <section>
          <h2>Types of concerns</h2>
          <ArticlePara>
            So far we've stayed fairly abstract to concepts which can be applied
            to many kinds of systems, now let's speak specifically about
            software. When thinking about software systems we have a few kinds
            of concepts that immediately come to mind. Listed below in order of
            growing concern:
          </ArticlePara>
          <ul>
            <li>Knowing how primitives are defined: types, shapes</li>
            <li>Knowing how to call something locally: function signatures</li>
            <li>
              Knowing how to call something remotely: API specs + location
            </li>
            <li>
              Knowing how something works (datastructures, runtime, unspecified
              behavior)
            </li>
          </ul>
        </section>
        <section>
          <h2>Separating concerns</h2>
          <ArticlePara>
            Let's go through an example: imagine you are developing a new
            feature and there is a requirement to log analytics events when the
            user takes an action. In this case you need to comprehend its
            primitives ("events") and how to send the system an event. You
            hopefully do not need to understand any of the implementation
            details of the analytics system. Only the analytics system should be
            concerned with how the analytics system works.
          </ArticlePara>
          <ArticlePara>
            Calling a remote system is a fairly complex process that requires
            comprehension of a lot of specific information (how to make an API
            request, where the service is, how to interpret its errors, etc.).
            In this example it would be good to separate the concerns around
            sending this event to a remote service from the system that needs to
            log an event. We could{" "}
            <a
              href="https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)"
              target="_blank"
            >
              encapsulate
            </a>{" "}
            this concern in a local utility to our client, perhaps called
            "AnalyticsClient" and invoke that local function to send an event.
            This pulls out the specific information about a remote call and
            abstracts over it by creating a local utility. Now our client needs
            to comprehend even less about the analytics service in order to use
            it.
          </ArticlePara>
          <ArticlePara>
            At a local level we're reducing the concerns our client has by
            moving them away. At the global level these concerns still exist but
            they've been separated into more manageable pieces so the individual
            pieces can do their jobs without comprehending as much of the whole
            system. This is the core idea of separating concerns.
          </ArticlePara>
        </section>
      </article>
    </SingleColumn>
  );
}
