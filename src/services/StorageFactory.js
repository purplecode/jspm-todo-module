'use strict';
import LocalStorage from './storage/LocalStorage';
import CookieStorage from './storage/CookieStorage';
import LokiStorage from './storage/LokiStorage';
import IndexedDbStorage from './storage/IndexedDbStorage';

export default class StorageFactory {

  constructor(storageType = 'loki') {
    switch (storageType.toLowerCase()) {
      case 'localstorage':
        this.storage = new LocalStorage();
        break;
      case 'cookies':
        this.storage = new CookieStorage();
        break;
      case 'lokijs':
        this.storage = new LokiStorage();
        break;
      case 'indexeddb':
        this.storage = new IndexedDbStorage();
        break;
      default:
        throw new Error('Unknown storage type: ' + storageType);
    }
  }

  get() {
    return this.storage;
  }
}

