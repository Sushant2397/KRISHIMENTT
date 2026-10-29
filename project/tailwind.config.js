/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      colors: {
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',

        // ── Brand ──
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover:      'hsl(var(--primary-hover))',
          light:      'hsl(var(--primary-light))',
        },

        // ── Warm Sand ──
        sand: {
          DEFAULT:    'hsl(var(--sand))',
          foreground: 'hsl(var(--sand-foreground))',
        },

        // ── Secondary ──
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          hover:      'hsl(var(--secondary-hover))',
        },

        // ── Muted ──
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          dark:       'hsl(var(--muted-dark))',
        },

        // ── Status ──
        success: {
          DEFAULT:    'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          light:      'hsl(var(--success-light))',
        },
        warning: {
          DEFAULT:    'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          light:      'hsl(var(--warning-light))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          light:      'hsl(var(--destructive-light))',
        },
        info: {
          DEFAULT:    'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          light:      'hsl(var(--info-light))',
        },

        // ── Surfaces ──
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // ── Generic tokens ──
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          hover:      'hsl(var(--accent-hover))',
        },
        border:         'hsl(var(--border))',
        'border-strong':'hsl(var(--border-strong))',
        input:          'hsl(var(--input))',
        ring:           'hsl(var(--ring))',

        // ── Sidebar ──
        sidebar: {
          DEFAULT:            'hsl(var(--sidebar-background))',
          foreground:         'hsl(var(--sidebar-foreground))',
          primary:            'hsl(var(--sidebar-primary))',
          'primary-foreground':'hsl(var(--sidebar-primary-foreground))',
          accent:             'hsl(var(--sidebar-accent))',
          'accent-foreground':'hsl(var(--sidebar-accent-foreground))',
          border:             'hsl(var(--sidebar-border))',
          ring:               'hsl(var(--sidebar-ring))',
        },
      },

      borderRadius: {
        sm:    '0.375rem',
        DEFAULT:'var(--radius)',
        lg:    'var(--radius-lg)',
        xl:    'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': '2rem',
      },

      boxShadow: {
        xs:    'var(--shadow-xs)',
        sm:    'var(--shadow-sm)',
        DEFAULT:'var(--shadow)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        card:  '0 2px 12px 0 hsl(var(--card-shadow) / 0.18)',
        'card-hover': '0 8px 24px 0 hsl(var(--card-shadow) / 0.22)',
      },

      transitionDuration: {
        fast:   '150ms',
        normal: '250ms',
        slow:   '350ms',
      },

      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '18':  '4.5rem',
      },

      maxWidth: {
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
