'use strict';
import LokiStorage from './storage/LokiStorage';
import IndexedDbStorage from './storage/IndexedDbStorage';

export default class StorageFactory {

  constructor(storageType = 'loki') {
    switch (storageType.toLowerCase()) {
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

