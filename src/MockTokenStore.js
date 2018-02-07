export const openDomain = 'open.brandwatch.com';
export const closedDomain = 'closed.brandwatch.com';
export const openBackupDomain = 'open.backup.brandwatch.com';
export const closedBackupDomain = 'closed.backup.brandwatch.com';
export const loginUrl = 'https://login.brandwatch.com';
const token = '1234';

export default (domain) => ({
  loginUrl,
  getToken: ({ aud }) => Promise.resolve(aud.startsWith('open') ? token : null),
  removeToken: () => Promise.resolve(),
});
