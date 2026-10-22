import '@computer/ui/styles.css';
import './preview.css';

export default {
  globalTypes: {
    theme: {
      description: 'Component theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
  },
  decorators: [
    (Story, context) => (
      <div className="computer-story" data-theme={context.globals.theme}>
        <Story />
      </div>
    ),
  ],
};
