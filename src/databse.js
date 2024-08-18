import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';


const databasePath = new URL('../db.json', import.meta.url);

export class Database {

  constructor () {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#tables = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      })
  }

  #tables = {};

  #persist() {
    const data = JSON.stringify(this.#tables, null, 2);
    fs.writeFile('db.json', data);
  }
  select(table, search) {
    const data = this.#tables[table] ?? [];

    if (search) {
      const filtered = data.filter(raw => {
        return Object.entries(search).some(entrie => {
          const [key, value] = entrie;
          return raw[key].toLocaleLowerCase().includes(value.toLocaleLowerCase());
        });
      });
  
      return filtered;
    }

    return data;
  }

  find(table, id) {
    const rowIndex = this.#tables[table].findIndex(row => row.id == id);

    return (rowIndex > -1)
      ? this.#tables[table][rowIndex]
      : null;
  }

  insert(table, data) {
    data.id = randomUUID();

    if (Array.isArray(this.#tables[table])) {
      this.#tables[table].push(data);
    } else {
      this.#tables[table] = [data];
    }

    this.#persist();

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#tables[table].findIndex(row => row.id == id);

    if (rowIndex > -1) {
      this.#tables[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table, id, data) {
    const rowIndex = this.#tables[table].findIndex(row => row.id == id);

    if (rowIndex > -1) {
      let row = this.#tables[table][rowIndex];
      Object.assign(row, data);
      this.#persist();
    }
  }
}