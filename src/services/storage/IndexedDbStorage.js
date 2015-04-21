'use strict';
import {Storage} from './Storage';
import dexie from 'dexie';
import _ from 'lodash';

const DATABASE = 'todos';

export default class IndexedDbStorage extends Storage {

    constructor() {
        super(this);

        let database = new dexie(DATABASE);
        database.version(1).stores({'todos': "++id,title,strCompleted"});
        database.open().catch(function (error) {
            window.alert('Database opening error : ' + error);
        });

        this.todos = database.todos;
    }

    stringifyCompleted(todo) {
        todo.strCompleted = todo.completed ? 'yes' : 'no';
        return todo;
    }

    /**
     * @returns {Promise}
     */
    count(filter=null) {
        return new Promise((resolve, reject) => {
            if(filter) {
                if(_.has(filter, 'completed')) {
                    this.stringifyCompleted(filter);
                }
                let builder = this.todos;
                Object.keys(filter).forEach((key) => {
                    if(key !== 'completed') {
                        builder = builder.where(key).equals(filter[key]);
                    }
                });
                builder.count(resolve);
            } else {
                this.todos.count(resolve);
            }
        });
    }

    /**
     * @param {*} item
     * @returns {Promise}
     */
    add(item) {
        return new Promise((resolve, reject) => {
            this.todos.add(this.stringifyCompleted(item));
            resolve(item);
        });
    }

    /**
     * @param {Array} items
     * @returns {Promise}
     */
    addAll(items) {
        return new Promise((resolve, reject) => {
            _.each(items, (item) => this.todos.add(this.stringifyCompleted(item)));
            resolve(items);
        });
    }


    /**
     * @param item
     * @returns {Promise}
     */
    save(item) {
        return new Promise((resolve, reject) => {
            this.todos.update(item.id, this.stringifyCompleted(item)).then(resolve);
        });
    }

    /**
     * @param item
     * @returns {Promise}
     */
    remove(item) {
        return new Promise((resolve, reject) => {
            this.todos.delete(item.id).then(resolve);
        });
    }

    /**
     * @returns {*}
     */
    get() {
        return this.getFromStorage();
    }

    filter(filter) {
        return new Promise((resolve, reject) => {
            this.todos
                .filter((item) => _.matches(filter)(item))
                .each((item) => this.remove(item))
                .then(resolve);
        });
    }

    /**
     * @returns {Promise}
     */
    getFromStorage(limit=10) {
        return new Promise((resolve, reject) => {
            this.todos.limit(limit).toArray(resolve);
        });
    }

    /**
     * @returns {Promise}
     */
    saveOnStorage(items) {
        return this.addAll(items);
    }
}