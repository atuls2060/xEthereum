import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const Web3 = require("web3")

const SendEth = () => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [status, setStatus] = useState("");
  const web3 = new Web3(
    "http://127.0.0.1:7545"
  );

  async function handleSend() {
    const accounts = await web3.eth.getAccounts();
    const fromAddress = accounts[0];
    const toWei = web3.utils.toWei(amountToSend, "ether");
    const gasPrice = await web3.eth.getGasPrice();

    try {
      setStatus("Pending");
      const tx = {
        from: fromAddress,
        to: recipientAddress,
        value: toWei,
        gasPrice: gasPrice,
        gasLimit: web3.utils.toHex(21000),
      };
      const signedTx = await web3.eth.accounts.signTransaction(
        tx,
        "0x0cee07b6c9c3b07a3a930b42c896d9c0a0b78dba6f65b9999d4416f3ce8610cc"
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      Alert.alert("Confirmed. ", `Tx hash: ${receipt.transactionHash}`)
      setStatus(`Success \n Tx hash: ${receipt.transactionHash}`);
    } catch (err) {
      Alert.alert("error", err.message)
      setStatus(`Failed: ${err.message}`);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Ethereum</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter recipient address"
        onChangeText={setRecipientAddress}
        value={recipientAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter amount to send"
        onChangeText={setAmountToSend}
        value={amountToSend}
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      <Text style={styles.statusText}>Status: {status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 5,
    minWidth: 150,
    padding: 10,
    width: '100%'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusText: {
    marginTop: 40,
    fontWeight: 'bold'
  }
});

export default SendEth;
