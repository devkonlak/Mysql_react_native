import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import axios from 'axios';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSignup = () => {
    axios
      .post('http://192.168.167.206:3000/signup', {email, password}) 
      .then(response => {
        setMessage('Signup successful. Please login.');
        setIsLogin(true);
      })
      .catch(error => {
        const errorMsg = error.response ? error.response.data : 'Network error';
        setMessage('Error: ' + errorMsg);
      });
  };

  const handleLogin = () => {
    axios
      .post('http://192.168.167.206:3000/login', {email, password})
      .then(response => {
        setMessage('Welcome to the App');
      })
      .catch(error => {
        const errorMsg = error.response ? error.response.data : 'Network error';
        setMessage('Error: ' + errorMsg);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Signup'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isLogin ? 'Login' : 'Signup'}
        onPress={isLogin ? handleLogin : handleSignup}
      />
      <Text style={styles.message}>{message}</Text>
      <Button
        title={isLogin ? 'Go to Signup' : 'Go to Login'}
        onPress={() => setIsLogin(!isLogin)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
  message: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 16,
  },
});

export default App;
