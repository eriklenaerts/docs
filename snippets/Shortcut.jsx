// /snippets/Shortcut.jsx
// Arrow-only JSX snippet for Mintlify (no `function` keyword)
// Copy feature removed: no clipboard logic, no button, no state.
// `copy` and `copySymbols` props are tolerated but ignored for backwards-compat.

export const Shortcut = ({
  combo,
  mode = 'inline',           // 'inline' | 'block'
  title,                      // only used when mode='block'
  platform = 'auto',          // 'auto' | 'mac' | 'win' | 'linux'
  display = 'auto',           // 'auto' | 'symbols' | 'names'  (visual rendering)
  // Deprecated (ignored, kept for compatibility):
  copy,
  copySymbols,
  joiner = ' + ',             // between keys
  stepJoiner = ', then ',     // between steps (Ctrl+K, then Ctrl+S)
  size = 'md',                // 'sm' | 'md' | 'lg'
}) => {
  // ----- helpers (arrow functions only) -----
  const detectPlatform = () => {
    if (platform !== 'auto') return platform;
    try {
      const ua = navigator.userAgent || '';
      if (/Macintosh|Mac OS X|Mac_PowerPC/i.test(ua)) return 'mac';
      if (/Windows/i.test(ua)) return 'win';
      return 'linux';
    } catch { return 'win'; }
  };

  const normalizeKey = (k) => {
    const s = String(k || '').trim().toLowerCase();
    const map = {
      cmd:'Command', command:'Command', '⌘':'Command', meta:'Meta', win:'Win', windows:'Win', super:'Win',
      ctrl:'Control', control:'Control', '⌃':'Control',
      alt:'Alt', option:'Option', '⌥':'Option',
      shift:'Shift','⇧':'Shift',
      enter:'Enter', return:'Return','↩':'Return',
      esc:'Esc', escape:'Esc','⎋':'Esc',
      tab:'Tab','⇥':'Tab',
      backspace:'Backspace','⌫':'Backspace',
      delete:'Delete', del:'Delete','⌦':'Delete',
      space:'Space', spacebar:'Space',
      up:'Up','↑':'Up', down:'Down','↓':'Down', left:'Left','←':'Left', right:'Right','→':'Right',
      pgup:'Page Up','page up':'Page Up',pageup:'Page Up',
      pgdn:'Page Down','page down':'Page Down',pagedown:'Page Down',
      home:'Home', end:'End'
    };
    if (map[s]) return map[s];
    const f = s.toUpperCase(); if (/^F\d{1,2}$/.test(f)) return f;
    return s.length === 1 ? s.toUpperCase() : s.replace(/\s+/g,' ').replace(/^\w/, c=>c.toUpperCase());
  };

  const macSymbols = {
    Command:'⌘', Option:'⌥', Control:'⌃', Shift:'⇧', Return:'↩', Esc:'⎋', Tab:'⇥',
    Backspace:'⌫', Delete:'⌦', Up:'↑', Down:'↓', Left:'←', Right:'→',
    'Page Up':'⇞', 'Page Down':'⇟', Home:'↖', End:'↘'
  };

  const displayToken = (token, plt) => {
    if (display === 'names') {
      if (plt === 'mac' && token === 'Command') return 'Cmd';
      if (plt !== 'mac' && token === 'Command') return 'Win';
      if (token === 'Meta') return plt === 'mac' ? 'Cmd' : 'Win';
      if (token === 'Option') return plt === 'mac' ? 'Option' : 'Alt';
      if (token === 'Control') return 'Ctrl';
      return token.length === 1 ? token.toUpperCase() : token;
    }
    if (display === 'symbols') {
      if (macSymbols[token]) return macSymbols[token];
      if (token === 'Meta' || token === 'Win') return macSymbols['Command'] || 'Cmd';
      if (token === 'Option') return macSymbols['Option'] || 'Alt';
      if (token === 'Control') return macSymbols['Control'] || 'Ctrl';
      return token.length === 1 ? token.toUpperCase() : token;
    }
    // auto
    if (plt === 'mac') {
      if (macSymbols[token]) return macSymbols[token];
      if (token === 'Meta' || token === 'Win') return '⌘';
      return token.length === 1 ? token.toUpperCase() : token;
    } else {
      if (token === 'Command' || token === 'Meta') return 'Win';
      if (token === 'Option') return 'Alt';
      if (token === 'Control') return 'Ctrl';
      return token.length === 1 ? token.toUpperCase() : token;
    }
  };

  // --- parse combo into steps & keys ---
  const steps = (Array.isArray(combo) ? combo : String(combo || '').split(/\s*,\s*/))
    .filter(Boolean)
    .map(step => step.split(/\s*\+\s*/).map(normalizeKey));

  if (!steps.length) return null;

  const plt = detectPlatform();
  const renderedSteps = steps.map(keys => keys.map(k => displayToken(k, plt)));

  // --- sizing (slightly relaxed for `lg` to avoid cramped look) ---
  const S = size === 'lg'
    ? { kbd: 'h-9 min-w-[2.1rem] px-3 text-sm', plus: 'mx-2.5', then: 'ml-2.5 mr-1 text-sm' }
    : size === 'sm'
      ? { kbd: 'h-6 min-w-[1.5rem] px-2 text-[11px]', plus: 'mx-1', then: 'ml-1.5 mr-1 text-[11px]' }
      : { kbd: 'h-7 min-w-[1.7rem] px-2.5 text-xs', plus: 'mx-1.5', then: 'ml-2 mr-1 text-xs' };

  const Key = ({ children }) => (
    <kbd
      className={
        `inline-flex items-center justify-center font-mono select-none ${S.kbd} ` +
        'rounded-md border border-gray-950/10 dark:border-white/10 ' +
        'bg-white dark:bg-white/10 shadow-[inset_0_-1px_0_rgba(0,0,0,0.05)] ' +
        'text-gray-700 dark:text-gray-200'
      }
      style={{ lineHeight: 1 }}
      aria-label={`Key ${children}`}
    >
      {children}
    </kbd>
  );

  // --- render keys (shared)
  const Keys = () => (
    <span className="inline-flex items-center gap-1" role="list">
      {renderedSteps.map((keys, si) => (
        <span key={si} className="inline-flex items-center" role="listitem">
          {keys.map((txt, ki) => (
            <span key={ki} className="inline-flex items-center">
              <Key>{txt}</Key>
              {ki < keys.length - 1 && <span className={`${S.plus} opacity-60`} aria-hidden>+</span>}
            </span>
          ))}
          {si < renderedSteps.length - 1 && (
            <span className={`${S.then} text-gray-500 dark:text-gray-400`}>then</span>
          )}
        </span>
      ))}
    </span>
  );

  // --- inline mode
  if (mode === 'inline') {
    return (
      <span className="inline-flex items-center gap-1 align-middle">
        <Keys />
      </span>
    );
  }

  // --- block mode (Mintlify code-block look)
  const hasTitle = Boolean(title && String(title).trim().length);
  return (
    <div
      className={
        hasTitle
          ? 'code-block mt-5 mb-8 not-prose rounded-2xl relative group text-gray-950 bg-gray-50 dark:bg-white/5 dark:text-gray-50 codeblock-light border border-gray-950/10 dark:border-white/10 p-0.5'
          : 'code-block mt-5 mb-8 not-prose rounded-2xl relative group text-gray-950 dark:text-gray-50 codeblock-light border border-gray-950/10 dark:border-white/10 bg-transparent dark:bg-transparent'
      }
    >
      {hasTitle ? (
        <div className="flex text-gray-400 text-xs rounded-t-[14px] leading-6 font-medium pl-4 pr-2.5 py-1">
          <div className="flex-none flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            {/* tiny keyboard-like header icon */}
            <svg className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" aria-hidden>
              <rect x="3" y="7" width="18" height="10" rx="2" />
              <rect x="5" y="9" width="2" height="2" rx="0.5" />
              <rect x="8" y="9" width="2" height="2" rx="0.5" />
              <rect x="11" y="9" width="2" height="2" rx="0.5" />
              <rect x="14" y="9" width="2" height="2" rx="0.5" />
              <rect x="17" y="9" width="2" height="2" rx="0.5" />
            </svg>
            {title}
          </div>
          {/* right side intentionally empty (copy removed) */}
          <div className="flex-1" />
        </div>
      ) : null}

      <div
        className={
          (hasTitle
            ? 'w-0 min-w-full max-w-full py-3.5 px-4 h-full relative text-sm leading-6 rounded-[14px] bg-white dark:bg-codeblock overflow-x-auto'
            : 'w-0 min-w-full max-w-full py-3.5 px-4 h-full relative text-sm leading-6 rounded-2xl bg-white dark:bg-codeblock overflow-x-auto') +
          ' children:!my-0 children:!shadow-none children:!bg-transparent transition-[height] duration-300 ease-in-out'
        }
      >
        <Keys />
      </div>
    </div>
  );
};

export default Shortcut;
