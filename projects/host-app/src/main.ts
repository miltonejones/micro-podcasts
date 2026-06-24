import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'home': 'http://localhost:4301/remoteEntry.json',
  'search': 'http://localhost:4302/remoteEntry.json',
  'categories': 'http://localhost:4303/remoteEntry.json',
  'subscriptions': 'http://localhost:4304/remoteEntry.json',
  'detail': 'http://localhost:4305/remoteEntry.json'
})
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
