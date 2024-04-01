import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
  Share,
} from 'react-native';
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

const PasswordList = () => {
  const [passwords, setPasswords] = useState<User[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedPassword, setEditedPassword] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * , false as showPass FROM passwords',
        [],
        (_, {rows}) => {
          const data: User[] = rows.raw();
          setPasswords(data);
        },
        (_, error) => {
          console.error('Failed to fetch passwords:', error);
        },
      );
    });
  };

  const handleDeletePassword = (id: number) => {
    Alert.alert(
      'Delete Password',
      'Are you sure you want to delete this password?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deletePassword(id),
        },
      ],
    );
  };

  const deletePassword = (id: number) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM passwords WHERE id = ?',
        [id],
        () => {
          console.log('Password deleted successfully.');
          fetchData();
        },
        (_, error) => {
          console.error('Failed to delete password:', error);
        },
      );
    });
  };

  const handleEditPassword = (password: User) => {
    setEditedPassword(password);
    setEditModalVisible(true);
  };

  const saveEditedPassword = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE passwords SET url = ?, username = ?, password = ? WHERE id = ?',
        [
          editedPassword?.url,
          editedPassword?.username,
          editedPassword?.password,
          editedPassword?.id,
        ],
        () => {
          console.log('Password updated successfully.');
          fetchData(); // Refresh password list after updating
          setEditModalVisible(false); // Close modal after saving
        },
        (_, error) => {
          console.error('Failed to update password:', error);
        },
      );
    });
    setEditModalVisible(false);
    fetchData(); // Refresh password list after updating
  };

  const togglePasswordVisibility = (id: number) => {
    const updatedPasswords = passwords.map((pass: User) => {
      if (pass.id === id) {
        return {...pass, showPass: !pass.showPass};
      }
      return pass;
    });
    setPasswords(updatedPasswords);
  };

  const handleShare = async (password: User) => {
    try {
      const message = `URL: ${password.url}\nUsername: ${password.username}\nPassword: ${password.password}`;
      await Share.share({
        message: message,
      });
    } catch (error: any) {
      console.error('Failed to share:', error.message);
    }
  };

  const renderPasswordItem = ({item}: {item: User}) => (
    <View style={styles.passwordItem}>
      <Text selectable={true} selectionColor="orange">
        URL: {item.url}
      </Text>
      <Text selectable={true} selectionColor="orange">
        Username: {item.username}
      </Text>
      <Text selectable={true} selectionColor="orange">
        Password: {item.showPass ? item.password : '******'}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEditPassword(item)}>
          <Text style={styles.button}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeletePassword(item.id)}>
          <Text style={styles.button}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => togglePasswordVisibility(item.id)}>
          <Text style={styles.button}>{item.showPass ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Text style={styles.button}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={passwords}
        renderItem={renderPasswordItem}
        keyExtractor={(item: User) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Data</Text>
            <Text style={styles.modalLabel}>URL:</Text>
            <TextInput
              style={styles.input}
              placeholder="URL"
              value={editedPassword?.url}
              onChangeText={text =>
                setEditedPassword((prev: any) => ({...prev, url: text}))
              }
            />
            <Text style={styles.modalLabel}>Username:</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editedPassword?.username}
              onChangeText={text =>
                setEditedPassword((prev: any) => ({...prev, username: text}))
              }
            />
            <Text style={styles.modalLabel}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={editedPassword?.password}
              secureTextEntry={true}
              onChangeText={text =>
                setEditedPassword((prev: any) => ({...prev, password: text}))
              }
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={saveEditedPassword} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  passwordItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default PasswordList;
