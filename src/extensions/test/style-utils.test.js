import { alignAt, alignMap, buildCss, getIn, setIn } from '../style-utils';

describe('setIn / getIn', () => {
  it('sets nested values without changing the original', () => {
    const base = { a: { b: 1 } };
    const next = setIn(base, ['a', 'c'], 2);
    expect(next).toEqual({ a: { b: 1, c: 2 } });
    expect(base).toEqual({ a: { b: 1 } });
  });

  it('removes empty values and prunes empty parents', () => {
    expect(setIn({ a: { b: 1 } }, ['a', 'b'], '')).toEqual({});
    expect(setIn({ a: { b: 1, c: 2 } }, ['a', 'b'], undefined)).toEqual({
      a: { c: 2 },
    });
  });

  it('reads with a fallback', () => {
    expect(getIn({ a: { b: 0 } }, ['a', 'b'], 'x')).toBe(0);
    expect(getIn({}, ['a', 'b'], 'x')).toBe('x');
  });
});

describe('text alignment', () => {
  it('reads the older single string as desktop only', () => {
    expect(alignAt('center', 'd')).toBe('center');
    expect(alignAt('center', 't')).toBe('');
    expect(alignAt('center', 'm')).toBe('');
  });

  it('reads a per-device map', () => {
    const map = { d: 'left', m: 'center' };
    expect(alignAt(map, 'd')).toBe('left');
    expect(alignAt(map, 't')).toBe('');
    expect(alignAt(map, 'm')).toBe('center');
  });

  it('handles nothing saved', () => {
    expect(alignAt('', 'd')).toBe('');
    expect(alignAt(undefined, 'm')).toBe('');
    expect(alignAt(null, 'd')).toBe('');
  });

  it('turns the older string into a map and keeps a map as it is', () => {
    expect(alignMap('right')).toEqual({ d: 'right' });
    expect(alignMap({ t: 'left' })).toEqual({ t: 'left' });
    expect(alignMap('')).toEqual({});
    expect(alignMap(undefined)).toEqual({});
  });
});

describe('buildCss (editor preview)', () => {
  it('returns nothing for an empty style', () => {
    expect(buildCss({}, '.x')).toBe('');
    expect(buildCss(undefined, '.x')).toBe('');
  });

  it('puts desktop values on the block and the rest in media queries', () => {
    const css = buildCss(
      {
        gap: { d: '8px', t: '6px', m: '4px' },
        font: { align: { d: 'left', m: 'center' } },
      },
      '.x',
    );
    expect(css).toContain('.x{gap:8px;text-align:left}');
    expect(css).toContain('@media (max-width:1024px){.x{gap:6px}}');
    expect(css).toContain(
      '@media (max-width:767px){.x{gap:4px;text-align:center}}',
    );
  });

  it('applies the older single alignment on desktop only', () => {
    const css = buildCss({ font: { align: 'right' } }, '.x');
    expect(css).toContain('text-align:right');
    expect(css).not.toContain('@media');
  });

  it('overrides inline grid columns and flex direction on tablet and mobile', () => {
    const css = buildCss(
      { cols: { t: 2, m: 1 }, stack: { m: 'column' } },
      '.x',
    );
    expect(css).toContain(
      '@media (max-width:1024px){.x{grid-template-columns:repeat(2,minmax(0,1fr)) !important}}',
    );
    expect(css).toContain('flex-direction:column !important');
  });

  it('never sets grid columns or direction for desktop', () => {
    const css = buildCss({ cols: { d: 4 }, stack: { d: 'column' } }, '.x');
    expect(css).toBe('');
  });

  it('keeps hover rules separate', () => {
    const css = buildCss({ bg: { color: '#fff', hover: '#000' } }, '.x');
    // A hover style also adds a short transition so the change is not abrupt.
    expect(css).toContain(
      '.x{background-color:#fff;transition:all 200ms ease}',
    );
    expect(css).toContain('.x:hover{background-color:#000}');
  });
});

describe('position and layer (editor preview)', () => {
  it('puts position and z-index on the block and offsets per device', () => {
    const css = buildCss(
      {
        position: 'absolute',
        zIndex: 5,
        inset: { d: { top: '10px', left: '-5px' }, m: { top: 'auto' } },
      },
      '.x',
    );
    expect(css).toContain('.x{top:10px;left:-5px;position:absolute;z-index:5}');
    expect(css).toContain('@media (max-width:767px){.x{top:auto}}');
  });

  it('keeps a z-index of 0', () => {
    expect(buildCss({ zIndex: 0 }, '.x')).toContain('z-index:0');
  });
});
