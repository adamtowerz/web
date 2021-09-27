import Popover from "./Popover";
import Link from "next/link";

const Content = () => {
  return (
    <>
      <p>
        <b>I code, love mountain sports, and will beat you at Mario Kart.</b>
        <br />
        <i>(that might also be my tinder bio...)</i>
      </p>

      <p>
        I'm a senior at the University of Washington, Seattle, studying computer
        science and entrepreneurship. Over the last 3 years of college I’ve
        founded{" "}
        <Popover
          popoverContent={
            <div>
              <p>
                In early 2019, as part of{" "}
                <a
                  href="https://courses.cs.washington.edu/courses/cse599a1/19wi/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CSE 599
                </a>
                , I founded a company with a group of students (some undergrad,
                some grad) focused on providing employment compensation
                analytics so people could be confident they were being paid what
                they deserved.
              </p>
              <p>
                The company was called{" "}
                <a
                  href="https://bottomline.me"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bottomline
                </a>{" "}
                , and took first in our course cohort when presenting at Pioneer
                Square Labs, and ranked third in the Dempsey startup
                competition. We spun out of the class and were focused on
                building the product and executing on our go-to-market plan when
                life got in the way and slowly many cofounders had to step away
                for other obligations.
              </p>
              <p>
                I'm incredibly proud of the work we did even though we had to
                make the difficult decision to walk away, and that experience
                was extremely formative in pushing me towards startups and
                smaller companies.
              </p>
            </div>
          }
        >
          a software startup
        </Popover>
        , manufactured and sold{" "}
        <Popover
          popoverContent={
            <p>
              As part of an entrepreneurship course I worked with a group of
              students to design, manufacture, and sell a product within 2
              quarters. Our product was a party card game called{" "}
              <a
                href="https://jailbirdgame.com"
                target="_blank"
                rel="noreferrer"
              >
                JailBird
              </a>
              . I built the website, managed our ecommerce operations, and ran
              marketing.
            </p>
          }
        >
          a party card game
        </Popover>
        , and{" "}
        <Popover popoverContent={<i>don't tell my parents..</i>}>
          brewed moonshine in my dorm room freezer
        </Popover>
        . I also ran the technology team at{" "}
        <Popover
          popoverContent={
            <div>
              <p>
                <a href="https://dubhacks.co" rel="noreferrer" target="_blank">
                  DubHacks
                </a>{" "}
                is the largest hackathon in the Pacific Northwest. It brings
                hundreds of students together to hack on some of the world's
                most important problems.
              </p>
              <p>
                The technology team operates the website, application process,
                resume bank, and submission judging process. I recruited and
                managed this team, and coordinated with other teams within our
                organization.
              </p>
            </div>
          }
        >
          DubHacks
        </Popover>
        , was the head teaching assistant for{" "}
        <Popover
          popoverContent={
            <div>
              <p>
                I was a TA for and then head TA of{" "}
                <a
                  href="https://cs.uw.edu/340"
                  target="_blank"
                  rel="noreferrer"
                >
                  CSE 340
                </a>
                , a human-computer interaction (HCI) class taught using Android.
                The first time I TA'd this course was the first time it was ever
                taught. I had to learn the content right before I taught it
                which was stressful but rewarding.
              </p>
              <p>
                While head TA, I managed a group of 4 other TAs and worked on
                technical course infrastructure including our automated testing
                framework for assignments. I was also a part of discussing the
                pedagogy of the class, and iterating as we received feedback.
              </p>
            </div>
          }
        >
          a human-computer interaction course
        </Popover>
        , and am a part of UW’s{" "}
        <Popover
          popoverContent={
            <div>
              <p>
                The{" "}
                <a
                  href="https://honors.uw.edu/about/"
                  target="_blank"
                  rel="noreferrer"
                >
                  interdisciplinary honors program
                </a>{" "}
                has replaced my general education requirements with smaller
                interdisciplinary courses. I've appreciated the honors program
                as it has pushed me to take classes that are outside of my
                "strike zone" and that have highly passionate and engaged
                professors.
              </p>
              <p>
                It also provided me a living community my freshman year where I
                met many of my college friends.
              </p>
            </div>
          }
        >
          interdisciplinary honors program
        </Popover>
        . My time at university is going by quickly, but I strongly believe I am
        making the most of it.
      </p>

      <p>
        My goal for my early career is to learn as much as I can by working on
        interesting problems with interesting people, and I've been working hard
        to achieve that. After my freshman year I worked on exploring{" "}
        <Popover
          popoverContent={
            <div>
              <p>
                <b>Product Management Intern during the summer of 2018</b>
              </p>
              <p>
                <i>
                  I was an intern with Intuit Futures, an internal research
                  division. Although I was a PM intern, I was writing my own
                  code in order to do the analysis detailed below.
                </i>
              </p>
              <ul>
                <li>
                  GooD (Get Out Of Debt): Leveraged Mint data to explore
                  opportunities for Intuit in consumer credit debt. Worked
                  closely with data analysts to understand and categorize credit
                  debt repayment patterns and build the tooling to visualize and
                  modify those patterns in order to drive insights. Improved the
                  granularity of the analysis by a factor of 10, and set the
                  stage for future work by creating more agile tooling.
                </li>
                <li>
                  Blockchain Executive Papers: Coordinated closely with internal
                  teams to prepare 3 executive papers on blockchain and its
                  current market state (competitive intelligence) for Intuit
                  executives.
                </li>
              </ul>
            </div>
          }
        >
          product opportunities for Mint users with credit debt at Intuit
        </Popover>
        . The next summer I went to Mountain View again, this time to work on{" "}
        <Popover
          popoverContent={
            <div>
              <p>
                <b>
                  Technical Program Management Intern during the summer of 2019
                </b>
              </p>
              <p>
                Worked on process improvements across Search by gathering
                requirements, designing, implementing, documenting, and then
                iterating on solutions.
              </p>
              <ul>
                <li>
                  Worked with teams in Israel and New York to design a new
                  solution to support legal compliance for changing legislation
                  in Europe. Designed to meet the needs of multiple stakeholders
                  across leadership and partner relations.
                </li>
                <li>
                  Collaborated with the support organization to drive process
                  improvements to a feedback pipeline. Expanded it from just
                  Googler reports to external users as well, leading to new and
                  actionable reports.
                </li>
                <li>
                  Implemented a set of cascading pagers for an executive team,
                  and provided documentation for usage and support
                </li>
              </ul>
            </div>
          }
        >
          keeping Google Search safe and trustworthy
        </Popover>{" "}
        (at Google, duh). From those experiences I realized I wanted to work
        somewhere smaller: so I spent this spring and summer at{" "}
        <Popover
          popoverContent={
            <div>
              <b>
                Software Engineering Intern during the spring &amp; summer of
                2020
              </b>
              <p>
                <a
                  href="https://productiv.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Productiv
                </a>{" "}
                is a high-growth technology startup building a SaaS management
                platform.
              </p>
              <p>
                Working there validated my hypothesis that I would thoroughly
                enjoy working in a small and fast paced environment. I had an
                unparalleled amout of ownership over my work, and was shipping
                new things frequently.
              </p>
            </div>
          }
        >
          Productiv
        </Popover>
        , a fast-growing startup.
      </p>

      <p>
        Beyond college and career, I love playing board games, watching
        professional League of Legends, and bantering with friends. I enjoy
        gravity-assist sports, namely downhill mountain biking and skiing, and
        I’ve been trying to get into running (but this is attempt #4, so we’ll
        see if I stick to it).
      </p>

      <p>
        I’m always happy to chat, feel free to email me at{" "}
        <a href="mailto:adam@towers.email">adam@towers.email</a>. You can find
        the silhouette of my calendar <Link href="/cal">here</Link>. Tap an
        underlined section to learn more.
      </p>
    </>
  );
};

export default Content;
