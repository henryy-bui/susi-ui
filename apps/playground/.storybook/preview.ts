import type { Preview } from '@storybook/react-vite';
import '../src/demo.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    a11y: { test: 'todo' },
  },
};

export default preview;
