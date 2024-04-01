import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ToastAndroid,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({name: 'passwords.db'});

function PasswordAdd({navigation}: any) {
  const [url, setUrl] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const savePassword = async () => {
    (await db).transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS passwords (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, username TEXT, password TEXT);',
      );
      tx.executeSql(
        'INSERT INTO passwords (url, username, password) VALUES (?, ?, ?)',
        [url, username, password],
        (_: any, {rowsAffected}: any) => {
          if (rowsAffected > 0) {
            console.log('Password saved successfully!');
            ToastAndroid.show(
              'Password saved successfully',
              ToastAndroid.SHORT,
            );
            setUrl('');
            setUsername('');
            setPassword('');
          } else {
            console.log('Failed to save password.');
          }
        },
      );
    });
  };

  const isAnyFieldEmpty = () => {
    return !url || !username || !password;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>URL:</Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={text => setUrl(text)}
        placeholder="Enter URL"
      />
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={text => setUsername(text)}
        placeholder="Enter username"
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={text => setPassword(text)}
        placeholder="Enter password"
        secureTextEntry={true}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Save Password"
          onPress={savePassword}
          disabled={isAnyFieldEmpty()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Generate Password"
          onPress={() => {
            navigation.navigate('passgen');
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Password List"
          onPress={() => {
            navigation.navigate('passlist');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 8,
  },
});

export default PasswordAdd;
