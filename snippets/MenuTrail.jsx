// /snippets/MenuTrail.jsx
// Arrow-only, no hooks, no 'use client'

export const MenuTrail = ({
  segments,            // string | string[]
  joiner,              // optional; defaults to '›'
  size,                // 'sm' | 'md' | 'lg' (defaults dynamically by mode)
  mode = 'inline',     // 'inline' | 'block'
  title,               // only used in block mode
  icon,                // string | boolean; default 'bars-staggered' when omitted; set to false/'' to hide
  iconStyle,           // supports: regular | solid | light | thin | sharp-solid | duotone | brands
  iconLabel = 'Menu',  // SR-only label for the icon
  emphasise,           // 'bold' | 'pill' | 'none' (default depends on mode)
}) => {
  // normalize segments
  const parts = Array.isArray(segments)
    ? segments
    : String(segments || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

  const SEP = joiner ?? '›';

  // --- default size by mode (inline => sm, block => md) ---
  const resolvedSize = size ?? (mode === 'inline' ? 'sm' : 'md');

  // sizing tokens
  const S =
    resolvedSize === 'lg'
      ? { text: 'text-base', sep: 'mx-2.5', padInline: 'px-2.5 py-1.5', padBlock: 'py-3.5 px-5', iconPx: 18, iconGap: 'mr-2.5' }
      : resolvedSize === 'sm'
      ? { text: 'text-xs',   sep: 'mx-1', padInline: 'px-2 py-0.5',   padBlock: 'py-2.5 px-3.5', iconPx: 14, iconGap: 'mr-1.5' }
      : { text: 'text-sm',   sep: 'mx-1.5', padInline: 'px-2.5 py-1', padBlock: 'py-3.5 px-4',   iconPx: 16, iconGap: 'mr-2' };

  // --- icon style handling ---
  const STYLE_MAP = {
    regular: 'regular',
    solid: 'solid',
    light: 'light',
    thin: 'thin',
    'sharp-solid': 'sharp-solid',
    sharpsolid: 'sharp-solid',
    duotone: 'duotone',
    brands: 'brands',
    brand: 'brands',
    br: 'brands',
  };

  const defaultIconStyle = mode === 'inline' ? 'light' : 'solid';
  const normaliseStyle = (v) => {
    if (!v) return STYLE_MAP[defaultIconStyle];
    const k = String(v).trim().toLowerCase().replace(/[_\s]+/g, '-').replace(/[^a-z-]/g, '');
    return STYLE_MAP[k] || STYLE_MAP[defaultIconStyle];
  };
  const resolvedIconStyle = normaliseStyle(iconStyle);

  // robust boolean-ish parsing
  const asBool = (v, dflt) => {
    if (v === undefined || v === null) return dflt;
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase();
      if (['false','0','no','off','n',''].includes(s)) return false;
      if (['true','1','yes','on','y'].includes(s)) return true;
      return true;
    }
    return dflt;
  };

  // --- default icon = 'bars-staggered'; allow hiding with icon={false} or icon="" ---
  let iconName;
  if (typeof icon === 'string') {
    iconName = icon.trim() || undefined;
  } else if (icon === undefined) {
    iconName = 'bars-staggered';
  } else if (asBool(icon, true)) {
    iconName = 'bars-staggered';
  } else {
    iconName = undefined;
  }
  const hasIcon = !!iconName;

  if (!parts.length && !hasIcon) return null;

  // Mintlify/FA icon via mask-image
  const IconSvg = () => {
    if (!hasIcon) return null;
    const cdn = 'https://d3gk2c5xim1je2.cloudfront.net/v6.6.0';
    const safeIconName = String(iconName).trim().toLowerCase().replace(/\s+/g, '-');
    const url = `${cdn}/${resolvedIconStyle}/${safeIconName}.svg`;
    const px = S.iconPx;

    return (
      <span className="inline-flex items-center">
        <svg
          className="icon inline align-middle"
          style={{
            backgroundColor: 'currentColor',
            maskImage: `url("${url}")`,
            WebkitMaskImage: `url("${url}")`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            width: px,
            height: px,
            display: 'inline-block',
            verticalAlign: 'middle',
          }}
          aria-hidden="true"
        />
        {iconLabel && <span className="sr-only">{iconLabel}</span>}
      </span>
    );
  };

  // --- emphasise handling ---
  const defaultEmphasis = mode === 'inline' ? 'bold' : 'pill';
  const resolvedEmphasis = emphasise ?? defaultEmphasis;

  const lastBold = 'font-semibold text-gray-950 dark:text-gray-50';
  const lastPillInline = 'font-medium text-gray-950 dark:text-gray-50 bg-gray-950/5 dark:bg-white/10 rounded px-1.5 py-0.5';
  const lastPillBlock  = 'font-medium text-gray-950 dark:text-gray-50 bg-gray-950/5 dark:bg-white/10 rounded-md px-2 py-1';

  const Trail = () => (
    <span className={`inline-flex items-center ${S.text}`}>
      {hasIcon && (
        <>
          <span className={`inline-flex items-center ${S.iconGap}`}>
            <IconSvg />
          </span>
          {parts.length > 0 && (
            <span className={`${S.sep} opacity-60 select-none`} aria-hidden="true">{SEP}</span>
          )}
        </>
      )}
      {parts.map((p, i) => {
        const isLast = i === parts.length - 1;
        const spanProps = isLast && resolvedEmphasis !== 'none' ? { 'aria-current': 'page' } : {};
        const emphasisClass = isLast
          ? resolvedEmphasis === 'bold'
            ? lastBold
            : resolvedEmphasis === 'pill'
              ? (mode === 'inline' ? lastPillInline : lastPillBlock)
              : ''
          : '';
        return (
          <span key={i} className="inline-flex items-center">
            <span className={emphasisClass} {...spanProps}>
              {p}
            </span>
            {i < parts.length - 1 && (
              <span className={`${S.sep} opacity-60 select-none`} aria-hidden="true">{SEP}</span>
            )}
          </span>
        );
      })}
    </span>
  );

  if (mode === 'inline') {
    return (
      <span
        className={`inline-flex items-center gap-1 align-middle font-mono rounded-md border border-gray-950/10 dark:border-white/10 bg-white/60 dark:bg-white/10 ${S.padInline}`}
        style={{ WebkitFontSmoothing: 'antialiased' }}
      >
        <Trail />
      </span>
    );
  }

  // block (no copy button)
  const hasTitle = Boolean(title && String(title).trim().length);
  return (
    <div
      className={
        hasTitle
          ? 'code-block mt-5 mb-8 not-prose rounded-2xl relative group text-gray-950 bg-gray-50 dark:bg-white/5 dark:text-gray-50 codeblock-light border border-gray-950/10 dark:border-white/10 p-0.5'
          : 'code-block mt-5 mb-8 not-prose rounded-2xl relative group text-gray-950 dark:text-gray-50 codeblock-light border border-gray-950/10 dark:border-white/10 bg-transparent dark:bg-transparent'
      }
    >
      {hasTitle && (
        <div className="flex text-gray-400 text-xs rounded-t-[14px] leading-6 font-medium pl-4 pr-2.5 py-1" data-component-part="code-block-header">
          <div className="flex-none flex items-center gap-1.5 text-gray-700 dark:text-gray-300" data-component-part="code-block-header-filename">
            {/* tiny menu-like header icon (decorative) */}
            <svg className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="6" width="18" height="2" rx="1" />
              <rect x="3" y="11" width="14" height="2" rx="1" />
              <rect x="3" y="16" width="10" height="2" rx="1" />
            </svg>
            {title}
          </div>
        </div>
      )}

      <div
        className={
          (hasTitle
            ? `w-0 min-w-full max-w-full ${S.padBlock} h-full relative leading-6 rounded-[14px] bg-white dark:bg-codeblock overflow-x-auto font-mono`
            : `w-0 min-w-full max-w-full ${S.padBlock} h-full relative leading-6 rounded-2xl bg-white dark:bg-codeblock overflow-x-auto font-mono`) +
          ' children:!my-0 children:!shadow-none children:!bg-transparent transition-[height] duration-300 ease-in-out'
        }
        style={{ fontVariantLigatures: 'none' }}
        data-component-part="code-block-root"
      >
        <Trail />
      </div>
    </div>
  );
};

export default MenuTrail;
