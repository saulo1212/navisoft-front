import assert from 'node:assert/strict';
import test from 'node:test';
import { assetLinkHistoryRows } from '../src/lib/domain/fleet.js';

const time = seconds => `2026-10-02T11:27:${seconds}-03:00`;
const event = (uid, seconds, fields) => ({ uid, occurred_at: time(seconds), ...fields });

test('history presents a paired replacement and independent movements newest first', () => {
  const initial = event('first', '12', { slot_number: 1, uid_work_order: 'first-order', uid_device_after: 'old' });
  const removed = event('removed', '15.672319', { slot_number: 1, uid_work_order: 'replacement', uid_device_before: 'old' });
  const installed = event('installed', '15.687209', { slot_number: 1, uid_work_order: 'replacement', uid_device_after: 'new' });
  const independent = event('standalone', '17', { slot_number: 1, uid_work_order: 'other-order', uid_device_before: 'new' });
  const rows = assetLinkHistoryRows([initial, removed, installed, independent], 'asset');
  assert.deepEqual(rows.map(row => [row.uid, row.operation, row.slot, row.before, row.after]), [
    ['standalone', 'Retirada', 1, 'new', undefined],
    ['installed', 'Troca', 1, 'old', 'new'],
    ['first', 'Instalação', 1, undefined, 'old']
  ]);
  assert.equal(rows[1].occurredAt, installed.occurred_at);
});

test('snapshots preserve device identifiers and describe slot changes and moves between assets', () => {
  const snapshots = {
    before: { uid_asset: 'asset', uid_device: 'device', slot_number: 1 },
    after: { uid_asset: 'asset', uid_device: 'device', slot_number: 3 }
  };
  const moved = event('slot', '16', { details: snapshots });
  const transferred = event('transfer', '18', { details: { ...snapshots, after: { ...snapshots.after, uid_asset: 'other' } } });
  const [transfer, slot] = assetLinkHistoryRows([moved, transferred], 'asset');
  assert.deepEqual([slot.operation, slot.slot, slot.before, slot.after], ['Mudança de slot', '1 → 3', 'device', 'device']);
  assert.deepEqual([transfer.operation, transfer.before, transfer.after], ['Retirada', 'device', null]);
});

test('history preserves events when a pair would span different slots or has no work order', () => {
  const events = [
    event('a', '15', { slot_number: 1, uid_work_order: 'order', uid_device_before: 'a' }),
    event('b', '16', { slot_number: 2, uid_work_order: 'order', uid_device_after: 'b' }),
    event('c', '17', { slot_number: 1, uid_device_before: 'c' }),
    event('d', '18', { slot_number: 1, uid_device_after: 'd' }),
    event('e', '19', { slot_number: 3, uid_device_before: 'old', uid_device_after: 'new' })
  ];
  assert.deepEqual(assetLinkHistoryRows(events, 'asset').map(row => row.operation), [
    'Troca', 'Instalação', 'Retirada', 'Instalação', 'Retirada'
  ]);
  assert.deepEqual(assetLinkHistoryRows([], 'asset'), []);
});
