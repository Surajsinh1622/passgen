import React, {useEffect, useState} from 'react';
import {View, Modal, TextInput, Button, StyleSheet, Text} from 'react-native';
import {User} from './interfaces';
import {savePassword, updatePassword} from './database';

const PasswordModal = ({
  visible,
  setVisible,
  fetchData,
  password,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  fetchData: () => void;
  password?: User | null;
}) => {
  const [formData, setFormData] = useState<User>({
    id: -1,
    url: '',
    username: '',
    password: '',
    note: '',
    showPass: false,
  });

  useEffect(() => {
    setFormData({
      id: password ? password.id : -1,
      url: password ? password.url : '',
      username: password ? password.username : '',
      password: password ? password.password : '',
      note: password ? password.note : '',
      showPass: false,
    });
  }, [password]);

  const savePasswordData = async () => {
    if (formData.id === -1) {
      const formDataWithoutId: any = {...formData};
      delete formDataWithoutId.id;

      await savePassword(formDataWithoutId);
    } else {
      // Editing existing password
      await updatePassword(formData);
    }
    fetchData();
    setVisible(false);
    setFormData({
      id: -1,
      url: '',
      username: '',
      password: '',
      note: '',
      showPass: false,
    });
  };

  const isAnyFieldEmpty = () => {
    return !formData.url || !formData.username || !formData.password;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.label}>URL:</Text>
          <TextInput
            style={styles.input}
            placeholder="URL"
            value={formData.url}
            onChangeText={text => setFormData(prev => ({...prev, url: text}))}
          />
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.username}
            onChangeText={text =>
              setFormData(prev => ({...prev, username: text}))
            }
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={text =>
              setFormData(prev => ({...prev, password: text}))
            }
            secureTextEntry={true}
          />
          <Text style={styles.label}>Note:</Text>
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={formData.note}
            multiline={true}
            numberOfLines={4}
            onChangeText={text => setFormData(prev => ({...prev, note: text}))}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={formData.id === -1 ? 'Add' : 'Save'}
              onPress={savePasswordData}
              disabled={isAnyFieldEmpty()}
            />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setVisible(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
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
    height: 'auto',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
    color: 'black',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
});

export default PasswordModal;
