import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const { data } = await api.get('/user/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(data);
                setUsername(data.username);
                setAvatar(data.avatar || '');
                setBio(data.bio || '');
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const updateProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await api.put(`/user/${user._id}`, { username, avatar, bio }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser({ ...user, username, avatar, bio });
            alert('Cập nhật hồ sơ thành công!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Cập nhật hồ sơ thất bại.');
        }
    };

    if (!user) return <Text>Đang tải...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hồ sơ người dùng</Text>
            <Image
                source={{ uri: avatar || 'https://example.com/default_avatar.jpg' }}
                style={styles.avatar}
            />
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Tên người dùng"
            />
            <TextInput
                style={styles.input}
                value={avatar}
                onChangeText={setAvatar}
                placeholder="URL ảnh đại diện"
            />
            <TextInput
                style={styles.input}
                value={bio}
                onChangeText={setBio}
                placeholder="Tiểu sử"
                multiline
            />
            <Button title="Cập nhật" onPress={updateProfile} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default ProfileScreen;