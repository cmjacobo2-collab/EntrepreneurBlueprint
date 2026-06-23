{
  "plugins": [
    "react",
    "import"
  ],
  "rules": {
    "react/forbid-elements": [
      "warn",
      {
        "forbid": []
      }
    ],
    "no-restricted-imports": [
      "warn",
      {
        "patterns": [
          {
            "group": [
              "assets/**",
              "components/core/**",
              "components/feedback/**",
              "components/forms/**",
              "components/navigation/**",
              "ui_kits/portal/**",
              "ui_kits/website/**"
            ],
            "message": "Import design-system components from 'index.js', not component internals."
          }
        ]
      }
    ],
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
        "message": "Raw hex color — use a design-system color token via var()."
      },
      {
        "selector": "Literal[value=/\\b\\d+px\\b/]",
        "message": "Raw px value — use a design-system spacing token via var()."
      },
      {
        "selector": "Literal[value=/font-family\\s*:\\s*(?!['\\\"]?(?:Schibsted Grotesk|Hanken Grotesk|IBM Plex Mono))/i]",
        "message": "Font not provided by the design system. Available: Schibsted Grotesk, Hanken Grotesk, IBM Plex Mono."
      },
      {
        "selector": "JSXOpeningElement[name.name='Alert'] > JSXAttribute > JSXIdentifier[name!=/^(?:tone|title|icon|children|key|ref|className|style|children)$/]",
        "message": "<Alert> doesn't accept that prop. Declared props: tone, title, icon, children."
      },
      {
        "selector": "JSXOpeningElement[name.name='Alert'] > JSXAttribute[name.name='tone'] > Literal[value!=/^(?:info|success|warning|danger)$/]",
        "message": "<Alert> tone must be one of 'info' | 'success' | 'warning' | 'danger'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Avatar'] > JSXAttribute > JSXIdentifier[name!=/^(?:src|name|size|square|key|ref|className|style|children)$/]",
        "message": "<Avatar> doesn't accept that prop. Declared props: src, name, size, square."
      },
      {
        "selector": "JSXOpeningElement[name.name='Avatar'] > JSXAttribute[name.name='size'] > Literal[value!=/^(?:sm|md|lg)$/]",
        "message": "<Avatar> size must be one of 'sm' | 'md' | 'lg'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Badge'] > JSXAttribute > JSXIdentifier[name!=/^(?:tone|dot|children|key|ref|className|style|children)$/]",
        "message": "<Badge> doesn't accept that prop. Declared props: tone, dot, children."
      },
      {
        "selector": "JSXOpeningElement[name.name='Badge'] > JSXAttribute[name.name='tone'] > Literal[value!=/^(?:neutral|primary|success|warning|danger|accent)$/]",
        "message": "<Badge> tone must be one of 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'accent'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Button'] > JSXAttribute > JSXIdentifier[name!=/^(?:variant|size|leftIcon|rightIcon|fullWidth|disabled|children|key|ref|className|style|children)$/]",
        "message": "<Button> doesn't accept that prop. Declared props: variant, size, leftIcon, rightIcon, fullWidth, disabled, children."
      },
      {
        "selector": "JSXOpeningElement[name.name='Button'] > JSXAttribute[name.name='variant'] > Literal[value!=/^(?:primary|secondary|accent|outline|ghost|danger)$/]",
        "message": "<Button> variant must be one of 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Button'] > JSXAttribute[name.name='size'] > Literal[value!=/^(?:sm|md|lg)$/]",
        "message": "<Button> size must be one of 'sm' | 'md' | 'lg'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Card'] > JSXAttribute > JSXIdentifier[name!=/^(?:pad|hover|flat|dark|eyebrow|title|children|key|ref|className|style|children)$/]",
        "message": "<Card> doesn't accept that prop. Declared props: pad, hover, flat, dark, eyebrow, title, children."
      },
      {
        "selector": "JSXOpeningElement[name.name='Checkbox'] > JSXAttribute > JSXIdentifier[name!=/^(?:label|key|ref|className|style|children)$/]",
        "message": "<Checkbox> doesn't accept that prop. Declared props: label."
      },
      {
        "selector": "JSXOpeningElement[name.name='IconButton'] > JSXAttribute > JSXIdentifier[name!=/^(?:variant|size|label|children|key|ref|className|style|children)$/]",
        "message": "<IconButton> doesn't accept that prop. Declared props: variant, size, label, children."
      },
      {
        "selector": "JSXOpeningElement[name.name='IconButton'] > JSXAttribute[name.name='variant'] > Literal[value!=/^(?:ghost|outline|solid)$/]",
        "message": "<IconButton> variant must be one of 'ghost' | 'outline' | 'solid'."
      },
      {
        "selector": "JSXOpeningElement[name.name='IconButton'] > JSXAttribute[name.name='size'] > Literal[value!=/^(?:sm|md|lg)$/]",
        "message": "<IconButton> size must be one of 'sm' | 'md' | 'lg'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Input'] > JSXAttribute > JSXIdentifier[name!=/^(?:label|hint|error|multiline|key|ref|className|style|children)$/]",
        "message": "<Input> doesn't accept that prop. Declared props: label, hint, error, multiline."
      },
      {
        "selector": "JSXOpeningElement[name.name='Select'] > JSXAttribute > JSXIdentifier[name!=/^(?:label|hint|error|children|key|ref|className|style|children)$/]",
        "message": "<Select> doesn't accept that prop. Declared props: label, hint, error, children."
      },
      {
        "selector": "JSXOpeningElement[name.name='Stat'] > JSXAttribute > JSXIdentifier[name!=/^(?:value|label|delta|deltaDir|tone|key|ref|className|style|children)$/]",
        "message": "<Stat> doesn't accept that prop. Declared props: value, label, delta, deltaDir, tone."
      },
      {
        "selector": "JSXOpeningElement[name.name='Stat'] > JSXAttribute[name.name='deltaDir'] > Literal[value!=/^(?:up|down)$/]",
        "message": "<Stat> deltaDir must be one of 'up' | 'down'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Stat'] > JSXAttribute[name.name='tone'] > Literal[value!=/^(?:default|accent|gold)$/]",
        "message": "<Stat> tone must be one of 'default' | 'accent' | 'gold'."
      },
      {
        "selector": "JSXOpeningElement[name.name='Switch'] > JSXAttribute > JSXIdentifier[name!=/^(?:label|key|ref|className|style|children)$/]",
        "message": "<Switch> doesn't accept that prop. Declared props: label."
      },
      {
        "selector": "JSXOpeningElement[name.name='TabItem'] > JSXAttribute > JSXIdentifier[name!=/^(?:label|value|count|key|ref|className|style|children)$/]",
        "message": "<TabItem> doesn't accept that prop. Declared props: label, value, count."
      },
      {
        "selector": "JSXOpeningElement[name.name='Tag'] > JSXAttribute > JSXIdentifier[name!=/^(?:active|onRemove|children|key|ref|className|style|children)$/]",
        "message": "<Tag> doesn't accept that prop. Declared props: active, onRemove, children."
      }
    ]
  },
  "overrides": [
    {
      "files": [
        "**/index.js"
      ],
      "rules": {
        "no-restricted-imports": "off"
      }
    }
  ],
  "x-omelette": {
    "components": {
      "Alert": {
        "replaces": []
      },
      "Avatar": {
        "replaces": []
      },
      "Badge": {
        "replaces": []
      },
      "Button": {
        "replaces": []
      },
      "Card": {
        "replaces": []
      },
      "Checkbox": {
        "replaces": []
      },
      "IconButton": {
        "replaces": []
      },
      "Input": {
        "replaces": []
      },
      "Select": {
        "replaces": []
      },
      "Stat": {
        "replaces": []
      },
      "Switch": {
        "replaces": []
      },
      "TabItem": {
        "replaces": []
      },
      "Tag": {
        "replaces": []
      }
    },
    "tokens": [
      "--bg-dark",
      "--bg-page",
      "--bg-page-alt",
      "--border-dark",
      "--border-default",
      "--border-strong",
      "--border-subtle",
      "--brand-accent",
      "--brand-accent-hover",
      "--brand-primary",
      "--brand-primary-active",
      "--brand-primary-hover",
      "--brand-secondary",
      "--brand-secondary-hover",
      "--container",
      "--container-narrow",
      "--container-wide",
      "--control-lg",
      "--control-md",
      "--control-sm",
      "--cream-100",
      "--cream-50",
      "--danger",
      "--danger-bg",
      "--danger-border",
      "--dur-base",
      "--dur-fast",
      "--dur-slow",
      "--ease-in-out",
      "--ease-out",
      "--focus-ring",
      "--font-display",
      "--font-mono",
      "--font-sans",
      "--forest-050",
      "--forest-100",
      "--forest-500",
      "--forest-600",
      "--forest-700",
      "--forest-800",
      "--fw-bold",
      "--fw-extrabold",
      "--fw-medium",
      "--fw-regular",
      "--fw-semibold",
      "--gold-050",
      "--gold-100",
      "--gold-400",
      "--gold-500",
      "--gold-600",
      "--gold-700",
      "--info",
      "--info-bg",
      "--info-border",
      "--ink-100",
      "--ink-200",
      "--ink-300",
      "--ink-400",
      "--ink-500",
      "--ink-600",
      "--ink-700",
      "--ink-800",
      "--ink-900",
      "--leading-normal",
      "--leading-relaxed",
      "--leading-snug",
      "--leading-tight",
      "--navy-050",
      "--navy-100",
      "--navy-500",
      "--navy-600",
      "--navy-700",
      "--navy-800",
      "--navy-900",
      "--navy-950",
      "--radius-lg",
      "--radius-md",
      "--radius-pill",
      "--radius-sm",
      "--radius-xl",
      "--radius-xs",
      "--red-050",
      "--red-100",
      "--red-600",
      "--sand-200",
      "--sand-300",
      "--shadow-card-hover",
      "--shadow-focus",
      "--shadow-lg",
      "--shadow-md",
      "--shadow-sm",
      "--shadow-xl",
      "--shadow-xs",
      "--space-0",
      "--space-1",
      "--space-10",
      "--space-12",
      "--space-2",
      "--space-3",
      "--space-4",
      "--space-5",
      "--space-6",
      "--space-7",
      "--space-8",
      "--space-9",
      "--success",
      "--success-bg",
      "--success-border",
      "--surface-card",
      "--surface-raised",
      "--surface-sunken",
      "--text-2xl",
      "--text-3xl",
      "--text-4xl",
      "--text-5xl",
      "--text-accent",
      "--text-base",
      "--text-body",
      "--text-faint",
      "--text-lg",
      "--text-link",
      "--text-md",
      "--text-muted",
      "--text-on-dark",
      "--text-on-dark-muted",
      "--text-sm",
      "--text-strong",
      "--text-xl",
      "--text-xs",
      "--tracking-caps",
      "--tracking-normal",
      "--tracking-snug",
      "--tracking-tight",
      "--tracking-wide",
      "--warning",
      "--warning-bg",
      "--warning-border",
      "--white"
    ],
    "tokenKinds": {
      "--navy-950": "color",
      "--navy-900": "color",
      "--navy-800": "color",
      "--navy-700": "color",
      "--navy-600": "color",
      "--navy-500": "color",
      "--navy-100": "color",
      "--navy-050": "color",
      "--forest-800": "color",
      "--forest-700": "color",
      "--forest-600": "color",
      "--forest-500": "color",
      "--forest-100": "color",
      "--forest-050": "color",
      "--gold-700": "color",
      "--gold-600": "color",
      "--gold-500": "color",
      "--gold-400": "color",
      "--gold-100": "color",
      "--gold-050": "color",
      "--cream-50": "color",
      "--cream-100": "color",
      "--sand-200": "color",
      "--sand-300": "color",
      "--ink-900": "color",
      "--ink-800": "color",
      "--ink-700": "color",
      "--ink-600": "color",
      "--ink-500": "color",
      "--ink-400": "color",
      "--ink-300": "color",
      "--ink-200": "color",
      "--ink-100": "color",
      "--white": "color",
      "--red-600": "color",
      "--red-100": "color",
      "--red-050": "color",
      "--brand-primary": "color",
      "--brand-primary-hover": "color",
      "--brand-primary-active": "color",
      "--brand-secondary": "color",
      "--brand-secondary-hover": "color",
      "--brand-accent": "color",
      "--brand-accent-hover": "color",
      "--bg-page": "color",
      "--bg-page-alt": "color",
      "--bg-dark": "color",
      "--surface-card": "color",
      "--surface-sunken": "color",
      "--surface-raised": "color",
      "--text-strong": "font",
      "--text-body": "font",
      "--text-muted": "font",
      "--text-faint": "font",
      "--text-on-dark": "font",
      "--text-on-dark-muted": "font",
      "--text-accent": "font",
      "--text-link": "font",
      "--border-subtle": "color",
      "--border-default": "color",
      "--border-strong": "color",
      "--border-dark": "color",
      "--focus-ring": "color",
      "--success": "color",
      "--success-bg": "color",
      "--success-border": "color",
      "--warning": "color",
      "--warning-bg": "color",
      "--warning-border": "color",
      "--danger": "color",
      "--danger-bg": "color",
      "--danger-border": "color",
      "--info": "color",
      "--info-bg": "color",
      "--info-border": "color",
      "--font-display": "font",
      "--font-sans": "font",
      "--font-mono": "font",
      "--fw-regular": "font",
      "--fw-medium": "font",
      "--fw-semibold": "font",
      "--fw-bold": "font",
      "--fw-extrabold": "font",
      "--text-xs": "font",
      "--text-sm": "font",
      "--text-base": "font",
      "--text-md": "font",
      "--text-lg": "font",
      "--text-xl": "font",
      "--text-2xl": "font",
      "--text-3xl": "font",
      "--text-4xl": "font",
      "--text-5xl": "font",
      "--leading-tight": "font",
      "--leading-snug": "font",
      "--leading-normal": "font",
      "--leading-relaxed": "font",
      "--tracking-tight": "font",
      "--tracking-snug": "font",
      "--tracking-normal": "font",
      "--tracking-wide": "font",
      "--tracking-caps": "font",
      "--space-0": "spacing",
      "--space-1": "spacing",
      "--space-2": "spacing",
      "--space-3": "spacing",
      "--space-4": "spacing",
      "--space-5": "spacing",
      "--space-6": "spacing",
      "--space-7": "spacing",
      "--space-8": "spacing",
      "--space-9": "spacing",
      "--space-10": "spacing",
      "--space-12": "spacing",
      "--radius-xs": "radius",
      "--radius-sm": "radius",
      "--radius-md": "radius",
      "--radius-lg": "radius",
      "--radius-xl": "radius",
      "--radius-pill": "radius",
      "--container-narrow": "spacing",
      "--container": "spacing",
      "--container-wide": "spacing",
      "--control-sm": "spacing",
      "--control-md": "spacing",
      "--control-lg": "spacing",
      "--shadow-xs": "shadow",
      "--shadow-sm": "shadow",
      "--shadow-md": "shadow",
      "--shadow-lg": "shadow",
      "--shadow-xl": "shadow",
      "--shadow-focus": "shadow",
      "--shadow-card-hover": "shadow",
      "--ease-out": "other",
      "--ease-in-out": "other",
      "--dur-fast": "other",
      "--dur-base": "other",
      "--dur-slow": "other"
    },
    "fontFamilies": [
      "Hanken Grotesk",
      "IBM Plex Mono",
      "Schibsted Grotesk"
    ]
  }
}