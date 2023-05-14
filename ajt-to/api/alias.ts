import { AliasRecord } from "../db";



export async function getAliases(): Promise<AliasRecord[]> {
  return [
    {
      label: '8760',
      link: 'https://8760app.com',
      alias: '8760',
      internal: false
    },
    {
      link: 'https://justblackhats.com',
      alias: 'JustBlackHats',
      internal: false
    },
    {
      link: 'https://xkcd.com/927',
      alias: 'standards',
      internal: false
    },
    {
      link: 'https://xkcd.com/927',
      alias: '927',
      internal: false
    },
    {
      label: 'adamt.eth',
      link: 'https://rainbow.me/adamt.eth	',
      alias: 'eth',
      internal: false
    },
    {
      alias: 'github',
      link: 'https://github.com/adamtowerz',
      label: 'GitHub',
      internal: false,
    },
    {
      alias: 'website',
      link: 'https://adamtowers.io',
      internal: false,
      priority: 1,
    },
    {
      label: 'public cal',
      alias: 'cal',
      link: 'https://adamtowers.io/cal',
      internal: false,
      priority: 2,
    },
    {
      label: '@adamtowerz',
      alias: 'twitter',
      link: 'https://twitter.com/adamtowerz',
      internal: false,
      priority: 2,
    }
  ]
}

export async function getLinkForAlias(alias): Promise<AliasRecord['link'] | undefined> {
  const aliases = await getAliases();

  return aliases.find(i => i.alias === alias)?.link;
}
