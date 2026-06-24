import { provideRouter } from '@angular/router';
import { applicationConfig, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AudioPlayerCommandService } from './audio-player-command.service';
import { PodcastCard } from './podcast-card';
import { PodcastSelectionService } from './podcast-selection.service';
import { SubscriptionsService } from './subscriptions.service';
import { mockPodcasts } from './testing/mock-data';
import { ToastService } from './toast.service';

function fakeSubscriptions(subscribed: boolean) {
  return {
    subscriptions: () => (subscribed ? [mockPodcasts[0]] : []),
    isSubscribed: () => subscribed,
    toggle: () => (subscribed ? 'unsubscribed' : 'subscribed') as ('subscribed' | 'unsubscribed'),
  };
}

function fakeAudioPlayerCommand(progress: number) {
  return { getPodcastProgress: () => progress };
}

const meta: Meta<PodcastCard> = {
  title: 'Shared/PodcastCard',
  component: PodcastCard,
  decorators: [
    moduleMetadata({ imports: [PodcastCard] }),
    applicationConfig({
      providers: [
        provideRouter([]),
        { provide: PodcastSelectionService, useValue: { select: () => {} } },
        { provide: ToastService, useValue: { alert: () => {} } },
      ],
    }),
  ],
  argTypes: {
    podcast: { control: 'object' },
  },
};
export default meta;

type Story = StoryObj<PodcastCard>;

export const NotSubscribed: Story = {
  args: { podcast: mockPodcasts[0] },
  decorators: [
    applicationConfig({
      providers: [
        { provide: SubscriptionsService, useValue: fakeSubscriptions(false) },
        { provide: AudioPlayerCommandService, useValue: fakeAudioPlayerCommand(0) },
      ],
    }),
  ],
};

export const Subscribed: Story = {
  args: { podcast: mockPodcasts[0] },
  decorators: [
    applicationConfig({
      providers: [
        { provide: SubscriptionsService, useValue: fakeSubscriptions(true) },
        { provide: AudioPlayerCommandService, useValue: fakeAudioPlayerCommand(0) },
      ],
    }),
  ],
};

export const InProgress: Story = {
  args: { podcast: mockPodcasts[0] },
  decorators: [
    applicationConfig({
      providers: [
        { provide: SubscriptionsService, useValue: fakeSubscriptions(true) },
        { provide: AudioPlayerCommandService, useValue: fakeAudioPlayerCommand(42) },
      ],
    }),
  ],
};
