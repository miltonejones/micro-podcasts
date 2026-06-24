import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../projects/**/*.stories.@(ts|mdx)'],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {
      disableDocGen: true,
    },
  },
};

export default config;
