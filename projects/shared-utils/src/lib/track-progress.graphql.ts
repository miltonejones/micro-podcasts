export const listTrackProgress = `
  query ListTrackProgress {
    listTrackProgress(limit: 1000) {
      items {
        id
        progress
        podcastFeedUrl
        updatedAt
      }
    }
  }
`;

export const createTrackProgress = `
  mutation CreateTrackProgress($input: CreateTrackProgressInput!) {
    createTrackProgress(input: $input) {
      id
      updatedAt
    }
  }
`;

export const updateTrackProgress = `
  mutation UpdateTrackProgress($input: UpdateTrackProgressInput!) {
    updateTrackProgress(input: $input) {
      id
      updatedAt
    }
  }
`;

export interface TrackProgressRecord {
  id: string;
  progress: number;
  podcastFeedUrl: string;
  updatedAt: string;
}
