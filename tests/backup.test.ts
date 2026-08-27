import { describe, expect, it } from 'vitest';
import { assertCompatibleBackup } from '../src/application/backup-service';

describe('backup compatibility', () => {
  it('accepts the current versioned envelope', () => {
    expect(() => assertCompatibleBackup({ schemaVersion: 1, appVersion: '0.1.0', createdAt: new Date().toISOString(), data: {} })).not.toThrow();
  });

  it('rejects incompatible schema versions', () => {
    expect(() => assertCompatibleBackup({ schemaVersion: 99, appVersion: '9.0.0', createdAt: '', data: {} })).toThrow(/غير متوافق/);
  });
});
