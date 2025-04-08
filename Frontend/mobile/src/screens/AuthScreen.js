import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthScreen = ({ navigation }) => {
    const [method, setMethod] = useState('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('input');
    const [confirmation, setConfirmation] = useState(null);

    GoogleSignin.configure({ webClientId: 'YOUR_GOOGLE_CLIENT_ID' });

    const registerEmail = async () => {
        await api.post('/auth/register/email', { email });
        setStep('verify');
    };

    const verifyEmail = async () => {
        const { data } = await api.post('/auth/verify/email', { email, otp });
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Main');
    };

    const registerPhone = async () => {
        const confirm = await auth().signInWithPhoneNumber(phone);
        setConfirmation(confirm);
        setStep('verify');
    };

    const verifyPhone = async () => {
        const credential = await confirmation.confirm(otp);
        const firebaseToken = await credential.user.getIdToken();
        const { data } = await api.post('/auth/register/phone', { phone, firebaseToken });
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Main');
    };

    const googleLogin = async () => {
        await GoogleSignin.hasPlayServices();
        const { idToken } = await GoogleSignin.signIn();
        const { data } = await api.post('/auth/login/google', { googleToken: idToken });
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Main');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký / Đăng nhập</Text>
            {method === 'email' && step === 'input' && (
                <>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                    />
                    <Button title="Gửi OTP" onPress={registerEmail} />
                </>
            )}
            {method === 'email' && step === 'verify' && (
                <>
                    <TextInput
                        style={styles.input}
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Nhập OTP"
                    />
                    <Button title="Xác minh" onPress={verifyEmail} />
                </>
            )}
            {method === 'phone' && step === 'input' && (
                <>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Số điện thoại (e.g., +84...)"
                    />
                    <Button title="Gửi OTP" onPress={registerPhone} />
                </>
            )}
            {method === 'phone' && step === 'verify' && (
                <>
                    <TextInput
                        style={styles.input}
                        value={otp}
                        onChangeText={setOtp}
                        placeholder="Nhập OTP"
                    />
                    <Button title="Xác minh" onPress={verifyPhone} />
                </>
            )}
            <Button title="Đăng nhập bằng Google" onPress={googleLogin} />
            <Button
                title={`Chuyển sang ${method === 'email' ? 'Số điện thoại' : 'Email'}`}
                onPress={() => {
                    setMethod(method === 'email' ? 'phone' : 'email');
                    setStep('input');
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default AuthScreen;