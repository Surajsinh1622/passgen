import React, {useState, useEffect} from 'react';
import {View, Text, Switch, Button, StyleSheet} from 'react-native';
import {generatePassword} from './passwordGeneratorHelper';

export default function GeneratedPassword() {
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeUpperCase, setIncludeUpperCase] = useState(true);
  const [includeLowerCase, setIncludeLowerCase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    generateNewPassword();
  }, [
    passwordLength,
    includeUpperCase,
    includeLowerCase,
    includeNumbers,
    includeSymbols,
  ]);

  const generateNewPassword = () => {
    const password = generatePassword(
      passwordLength,
      includeUpperCase,
      includeLowerCase,
      includeNumbers,
      includeSymbols,
    );
    setGeneratedPassword(password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Generator</Text>
      <View style={styles.inputContainer}>
        <Text>Password Length:</Text>
        <Button
          title="-"
          onPress={() => setPasswordLength(prev => Math.max(prev - 1, 4))}
        />
        <Text style={styles.lengthText}>{passwordLength}</Text>
        <Button
          title="+"
          onPress={() => setPasswordLength(prev => Math.min(prev + 1, 50))}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text>Include Uppercase:</Text>
        <Switch value={includeUpperCase} onValueChange={setIncludeUpperCase} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Include Lowercase:</Text>
        <Switch value={includeLowerCase} onValueChange={setIncludeLowerCase} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Include Numbers:</Text>
        <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Include Symbols:</Text>
        <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
      </View>
      <Text
        selectable={true}
        selectionColor="orange"
        style={styles.generatedPassword}>
        {generatedPassword}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 50,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  generatedPassword: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lengthText: {
    marginHorizontal: 10,
  },
});
