import Link from "next/link";
import Image from "next/image";

import styles from "../../styles/pages/honors/index.module.scss";
import SingleColumn from "@/components/layout/SingleColumn";

export default function Home() {
  return (
    <SingleColumn footer>
      <h1>Adam Towers' Honors Portfolio</h1>
      <div className="d-flex">
        <article>
          <p>
            I've never been one for classrooms. Partially because it's a fairly
            boring medium, and partially because most are pedagogical disasters.
            I might expand on this argument elsewhere, but the takeaway for now
            is that I've never been one for classrooms. But that's not to that
            say I'm stupid -- personally I would strongly contend for the
            opposite (but who am I to judge). I've just found that most of the
            more valuable learnings in my relatively short life thus far have
            taken place whilst not sitting in the dreaded hallmark of structured
            education: a plastic chair with a dinky half-desk attached.
          </p>

          <p>
            So where have they taken place? Unlike above, I won't bore you with
            the types of chairs involved although I do assure you they were
            varied in both design and comfort. This portfolio will cover the
            different places outside of classrooms and lecture halls where I've
            learned important things throughout my college experience. I'll also
            callout some of the specific classes that I loved.
          </p>

          <p>
            I can't guarantee that you'll find my stories and artifacts useful,
            educational, or worthwhile. After all, I don't even know who you
            are. What I can guarantee is that they'll be interesting, and that
            they'll be written exactly how this introduction is: honestly &amp;
            with a whole lot of tone. Read on if you please, it might be fun.
          </p>
        </article>
        <div className={styles.heroImg}>
          <Image
            alt="Me, standing in the UW Quad"
            src="/honors/home.png"
            fill
            style={{ objectFit: "cover" }}
            quality={60}
          />
        </div>
      </div>

      <Link href="/honors/freshman">Let's get started: freshman year →</Link>
    </SingleColumn>
  );
}