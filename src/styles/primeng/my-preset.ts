import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
  // ==========================================
  // SEMANTIC TOKENS - Primary Color Palette
  // ==========================================
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },

    // ==========================================
    // COLOR SCHEME - Light Mode Tokens
    // ==========================================
    colorScheme: {
      light: {
        // Surface colors for light mode
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
        // Primary color behavior in light mode
        primary: {
          color: '{indigo.500}',
          inverseColor: '#ffffff',
          hoverColor: '{indigo.600}',
          activeColor: '{indigo.700}',
        },
        // Highlight colors
        highlight: {
          background: '{indigo.50}',
          focusBackground: '{indigo.100}',
          color: '{indigo.700}',
          focusColor: '{indigo.800}',
        },
        // Form field customization
        formField: {
          hoverBorderColor: '{primary.color}',
        },
      },
    },

    // ==========================================
    // FOCUS RING CUSTOMIZATION
    // ==========================================
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
    },
  },

  // ==========================================
  // COMPONENT TOKENS - Specific Components
  // ==========================================
  components: {
    // Card component customization
    card: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            color: '{surface.700}',
          },
          subtitle: {
            color: '{surface.500}',
          },
        },
        dark: {
          root: {
            background: '{surface.900}',
            color: '{surface.0}',
          },
          subtitle: {
            color: '{surface.400}',
          },
        },
      },
    },

    // Button component with custom accent variant
    button: {
      extend: {
        accent: {
          color: '#f59e0b',
          inverseColor: '#ffffff',
        },
      },
      css: ({ dt }) => `
        .p-button-accent {
          background: ${dt('button.accent.color')};
          color: ${dt('button.accent.inverse.color')};
          border-color: ${dt('button.accent.color')};
        }

        .p-button-accent:hover {
          background: color-mix(in srgb, ${dt('button.accent.color')} 85%, black);
          border-color: color-mix(in srgb, ${dt('button.accent.color')} 85%, black);
        }
      `,
    },
  },

  // ==========================================
  // EXTEND - Custom Global Tokens
  // ==========================================
  extend: {
    my: {
      transition: {
        slow: '0.75s',
        normal: '0.5s',
        fast: '0.25s',
      },
    },
  },
});

export default MyPreset;
