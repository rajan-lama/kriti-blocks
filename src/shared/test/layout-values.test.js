import {
  safeDisplay,
  safeLength,
  safePosition,
  safeZIndex,
} from '../layout-values';
import { getRowStyles } from '../../blocks/row/helpers';
import { getGridStyles } from '../../blocks/grid/helpers';

describe('layout values', () => {
  it('keeps ordinary lengths exactly as typed', () => {
    ['300px', '30vh', '50%', '0', 'auto', '12.5rem', '.5em', '-10px'].forEach(
      (v) => expect(safeLength(v)).toBe(v),
    );
    expect(safeLength(' 300px ')).toBe('300px');
    expect(safeLength('calc(100vh - 80px)')).toBe('calc(100vh - 80px)');
  });

  it('drops anything that could add other CSS', () => {
    [
      '300px;background:url(x)',
      'red',
      '1px 2px',
      'url(x)',
      'calc(1px));color:red',
      'calc(1px',
      'expression(1)',
      '',
      'var(--x)',
      42,
      null,
      undefined,
      {},
    ].forEach((v) => expect(safeLength(v)).toBeUndefined());
  });

  it('accepts only real position keywords', () => {
    ['static', 'relative', 'absolute', 'fixed', 'sticky'].forEach((v) =>
      expect(safePosition(v)).toBe(v),
    );
    ['absolute;top:0', 'default', 'normal', '', undefined].forEach((v) =>
      expect(safePosition(v)).toBeUndefined(),
    );
  });

  it('accepts whole-number layers', () => {
    expect(safeZIndex('10')).toBe('10');
    expect(safeZIndex(7)).toBe(7);
    expect(safeZIndex('-3')).toBe('-3');
    expect(safeZIndex('auto')).toBe('auto');
    ['9;color:red', '1.5', 'normal', '', '123456', 2.5, NaN, null].forEach(
      (v) => expect(safeZIndex(v)).toBeUndefined(),
    );
  });

  it('accepts only the supported display keywords', () => {
    expect(safeDisplay('grid')).toBe('grid');
    expect(safeDisplay('flex;x:y')).toBeUndefined();
  });
});

describe('row and grid styles use the checks', () => {
  it('keep valid values', () => {
    const row = getRowStyles({
      minHeight: '300px',
      positionType: 'relative',
      zindex: '5',
    });
    expect(row).toMatchObject({
      minHeight: '300px',
      position: 'relative',
      zIndex: '5',
    });
    const grid = getGridStyles({
      minHeight: '30vh',
      positionType: 'sticky',
      zindex: '2',
    });
    expect(grid).toMatchObject({
      minHeight: '30vh',
      position: 'sticky',
      zIndex: '2',
    });
  });

  it('leave out hostile values', () => {
    const bad = {
      minHeight: '1px;background:url(x)',
      positionType: 'fixed;top:0',
      zindex: '1;color:red',
    };
    ['getRowStyles', 'getGridStyles'].forEach((name) => {
      const styles = (name === 'getRowStyles' ? getRowStyles : getGridStyles)(
        bad,
      );
      expect(styles.minHeight).toBeUndefined();
      expect(styles.position).toBeUndefined();
      expect(styles.zIndex).toBeUndefined();
    });
  });

  it('the row display variable only takes supported values', () => {
    expect(
      getRowStyles({ displayType: 'flex;color:red' })['--bw-row-display'],
    ).toBe('flex');
    expect(
      getRowStyles({ displayType: 'inline-flex' })['--bw-row-display'],
    ).toBe('inline-flex');
  });
});
