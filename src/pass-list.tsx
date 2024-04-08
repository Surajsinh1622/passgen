import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
  Share,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {User} from './interfaces';
import PasswordModal from './password';

const db = SQLite.openDatabase(
  {
    name: 'passwords.db',
    location: 'default',
  },
  () => console.log('Database opened successfully.'),
  error => console.error('Error opening database:', error),
);

const PasswordList = ({navigation}: any) => {
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
      const message = `URL: ${password.url}\nUsername: ${password.username}\nPassword: ${password.password} \nNote: ${password.note}`;
      await Share.share({
        message: message,
      });
    } catch (error: any) {
      console.error('Failed to share:', error.message);
    }
  };

  const renderPasswordItem = ({item}: {item: User}) => (
    <View style={styles.passwordItem}>
      <Text style={styles.label} selectable={true} selectionColor="orange">
        URL: {item.url}
      </Text>
      <Text style={styles.label} selectable={true} selectionColor="orange">
        Username: {item.username}
      </Text>
      <Text style={styles.label} selectable={true} selectionColor="orange">
        Password: {item.showPass ? item.password : '******'}
      </Text>
      <Text style={styles.label} selectable={true} selectionColor="orange">
        Note: {item.note}
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
      <View style={styles.buttonMargin}>
        <Button
          title="Generate Password"
          onPress={() => {
            navigation.navigate('passgen');
          }}
        />
      </View>
      <View style={styles.buttonMargin}>
        <Button
          title="Add Password"
          onPress={() => {
            setEditedPassword(null);
            setEditModalVisible(true);
          }}
        />
      </View>
      <FlatList
        data={passwords}
        renderItem={renderPasswordItem}
        keyExtractor={(item: User) => item.id.toString()}
      />
      <PasswordModal
        visible={editModalVisible}
        setVisible={setEditModalVisible}
        fetchData={fetchData}
        password={editedPassword}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: 'gray',
  },
  passwordItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonMargin: {
    marginTop: 10,
  },
  button: {
    color: 'blue',
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
    width: 320,
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
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
  },
  modalLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
});

export default PasswordList;
