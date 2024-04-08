import SQLite from 'react-native-sqlite-storage';
import {User} from './interfaces';

const db = SQLite.openDatabase(
  {
    name: 'passwords.db',
    location: 'default',
  },
  () => console.log('Database opened successfully.'),
  error => console.error('Error opening database:', error),
);

export const fetchPasswords = async (): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * , false as showPass FROM passwords',
        [],
        (_, {rows}) => {
          const data: User[] = rows.raw();
          resolve(data);
        },
        (_, error) => {
          console.error('Failed to fetch passwords:', error);
          reject(error);
        },
      );
    });
  });
};

export const savePassword = async (password: User): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS passwords (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, username TEXT, password TEXT, note TEXT);',
      );
      tx.executeSql(
        'INSERT INTO passwords (url, username, password, note) VALUES (?, ?, ?, ?)',
        [password.url, password.username, password.password, password.note],
        () => {
          console.log('Password saved successfully.');
          resolve();
        },
        (_, error) => {
          console.error('Failed to save password:', error);
          reject(error);
        },
      );
    });
  });
};

export const updatePassword = (password: User): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE passwords SET url = ?, username = ?, password = ?, note = ? WHERE id = ?',
        [
          password.url,
          password.username,
          password.password,
          password.note,
          password.id,
        ],
        () => {
          console.log('Password updated successfully.');
          resolve();
        },
        (_, error) => {
          console.error('Failed to update password:', error);
          reject(error);
        },
      );
    });
  });
};

export const dropPasswordTable = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DROP TABLE IF EXISTS passwords;',
        [],
        () => {
          console.log('Table passwords dropped successfully.');
          resolve();
        },
        (_, error) => {
          console.error('Failed to drop table passwords:', error);
          reject(error);
        },
      );
    });
  });
};
