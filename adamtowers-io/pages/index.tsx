

export default function Home() {
  return (
    <div style={{ marginTop: '20px' }}>
      <h1 style={{ fontFamily: 'serif' }}>Heya, I'm Adam</h1>
      I like to code things, travel, play games with friends, and ski.
      <hr style={{ margin: '18px 4px' }} />
      <section>
        Some fun things I've done recently
        <ul style={{ marginTop: '6px' }}>
          <li><i>2022:</i> Started karting (the thrill of Mario Kart stopped being enough)</li>
          <li><i>2020-2021:</i> Sold (sarcastic) hats on the internet</li>
          <li><i>2020:</i> Built a time tracking app, got a bunch of users, but then realized I think time tracking is silly and people should <i>just live</i></li>
          <li><i>2019:</i> Made and sold a card game about birds</li>
          <li><i>2018:</i> Made moonshine in my dorm freezer</li>
        </ul>
      </section>
      <hr style={{ margin: '18px 4px' }} />
      <section>
        Some more career-y things
        <ul style={{ marginTop: '6px' }}>
          <li><i>2020 - now:</i> Work at <a href="https://productiv.com/" target="_blank">Productiv</a> as a software engineer where I'ved worked on almost everything we do</li>
          <li><i>2020:</i> Founded <a href="https://next.dubhacks.co/" target="_blank">DubHacks Next</a>, the first student run startup incubator at UW</li>
          <li><i>2017 - 2021:</i> University of Washington, Seattle w/ honors for CS</li>
        </ul>
      </section>
      <hr style={{ margin: '18px 4px' }} />
      <section>
        Some links
        <ul style={{ marginTop: '6px' }}>
          <li><a href="https://x.com/adamtowerz" target="_blank">X (formerly Twitter)</a></li>
          <li><a href="/cal">My calendar</a></li>
          <li>adam (at) towers (dot) email</li>
        </ul>
      </section>
    </div>
  );
}
