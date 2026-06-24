import { IPodcast } from './models';

export const listPodcastSubscriptions = `
  query ListPodcastSubscriptions {
    listPodcastSubscriptions(limit: 1000) {
      items {
        id
        feedUrl
        trackName
        artistName
        collectionName
        artworkUrl100
        artworkUrl600
        primaryGenreName
        trackCount
      }
    }
  }
`;

export const createPodcastSubscription = `
  mutation CreatePodcastSubscription($input: CreatePodcastSubscriptionInput!) {
    createPodcastSubscription(input: $input) {
      id
      feedUrl
    }
  }
`;

export const deletePodcastSubscription = `
  mutation DeletePodcastSubscription($input: DeletePodcastSubscriptionInput!) {
    deletePodcastSubscription(input: $input) {
      id
    }
  }
`;

export interface PodcastSubscriptionRecord {
  id: string;
  feedUrl: string;
  trackName?: string | null;
  artistName?: string | null;
  collectionName?: string | null;
  artworkUrl100?: string | null;
  artworkUrl600?: string | null;
  primaryGenreName?: string | null;
  trackCount?: number | null;
}

export function toCreateInput(podcast: IPodcast) {
  return {
    feedUrl: podcast.feedUrl,
    trackName: podcast.trackName,
    artistName: podcast.artistName,
    collectionName: podcast.collectionName,
    artworkUrl100: podcast.artworkUrl100,
    artworkUrl600: podcast.artworkUrl600,
    primaryGenreName: podcast.primaryGenreName,
    trackCount: podcast.trackCount,
  };
}

export function toIPodcast(record: PodcastSubscriptionRecord): IPodcast {
  return {
    feedUrl: record.feedUrl,
    trackName: record.trackName ?? undefined,
    artistName: record.artistName ?? undefined,
    collectionName: record.collectionName ?? undefined,
    artworkUrl100: record.artworkUrl100 ?? undefined,
    artworkUrl600: record.artworkUrl600 ?? undefined,
    primaryGenreName: record.primaryGenreName ?? undefined,
    trackCount: record.trackCount ?? undefined,
  };
}
