import { IPodcast, ITrack, ParsedEpisode } from '../models';

export const mockPodcasts: IPodcast[] = [
  {
    collectionId: 1001,
    collectionName: 'The Vanilla Stack',
    artistName: 'Statecast Studios',
    artworkUrl100: 'https://picsum.photos/seed/podcast1/100',
    artworkUrl600: 'https://picsum.photos/seed/podcast1/600',
    feedUrl: 'https://example.com/feeds/vanilla-stack.xml',
    primaryGenreName: 'Technology',
    trackCount: 42,
  },
  {
    collectionId: 1002,
    collectionName: 'Micro Frontend Weekly',
    artistName: 'Federation FM',
    artworkUrl100: 'https://picsum.photos/seed/podcast2/100',
    artworkUrl600: 'https://picsum.photos/seed/podcast2/600',
    feedUrl: 'https://example.com/feeds/microfrontend-weekly.xml',
    primaryGenreName: 'Technology',
    trackCount: 18,
  },
  {
    collectionId: 1003,
    collectionName: 'Signal & Noise',
    artistName: 'Reactive Radio',
    artworkUrl100: 'https://picsum.photos/seed/podcast3/100',
    artworkUrl600: 'https://picsum.photos/seed/podcast3/600',
    feedUrl: 'https://example.com/feeds/signal-and-noise.xml',
    primaryGenreName: 'Comedy',
    trackCount: 7,
  },
];

export const mockPodcast: IPodcast = mockPodcasts[0];

export const mockEpisodes: ParsedEpisode[] = [
  {
    title: 'Episode 3: Native Federation in Practice',
    description: 'We dig into shipping micro-frontends without a bundler-level module federation step.',
    pubDate: '2026-06-01T00:00:00.000Z',
    link: 'https://example.com/episodes/3',
    guid: 'episode-3',
    duration: '1845',
    author: 'Statecast Studios',
    enclosure: { url: 'https://example.com/audio/episode-3.mp3', type: 'audio/mpeg', length: '1000000' },
  },
  {
    title: 'Episode 2: Signals All the Way Down',
    description: 'Why we replaced the hand-rolled pub/sub store with Angular signals.',
    pubDate: '2026-05-25T00:00:00.000Z',
    link: 'https://example.com/episodes/2',
    guid: 'episode-2',
    duration: '2210',
    author: 'Statecast Studios',
    enclosure: { url: 'https://example.com/audio/episode-2.mp3', type: 'audio/mpeg', length: '1000000' },
  },
  {
    title: 'Episode 1: Porting STATECAST',
    description: 'The story of porting a vanilla TS podcast app into an Angular micro-frontend.',
    pubDate: '2026-05-18T00:00:00.000Z',
    link: 'https://example.com/episodes/1',
    guid: 'episode-1',
    duration: '1530',
    author: 'Statecast Studios',
    enclosure: { url: 'https://example.com/audio/episode-1.mp3', type: 'audio/mpeg', length: '1000000' },
  },
];

export const mockTrack: ITrack = {
  title: mockEpisodes[0].title,
  audioUrl: mockEpisodes[0].enclosure!.url,
  guid: mockEpisodes[0].guid,
  description: mockEpisodes[0].description,
  duration: mockEpisodes[0].duration,
  episode: mockEpisodes[0],
  podcastFeedUrl: mockPodcast.feedUrl || '',
};
