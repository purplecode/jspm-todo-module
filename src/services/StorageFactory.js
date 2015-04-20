'use strict';
import LocalStorage from './storage/LocalStorage';
import CookieStorage from './storage/CookieStorage';
import LokiStorage from './storage/LokiStorage';

export default class StorageFactory {
  
  constructor(storageType = 'loki') {
    switch (storageType) {
      case 'localStorage':
        this.storage = new LocalStorage();
        break;
      case 'cookies':
        this.storage = new CookieStorage();
        break;
      case 'loki':
        this.storage = new LokiStorage();
        break;
      default:
        throw new Error('Unknown storage type: ' + storageType);
    }
  }

  get() {
    return this.storage;
  }
}

