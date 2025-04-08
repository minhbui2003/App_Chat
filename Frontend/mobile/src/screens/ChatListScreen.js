import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Searchbar, Badge } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const ChatListScreen = () => {
    const [conversations, setConversations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const { data } = await api.get('/chat/conversations', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchConversations();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate('Chat', { conversationId: item._id })}
        >
            <Image
                source={{ uri: item.avatar || 'https://example.com/default_avatar.jpg' }}
                style={styles.avatar}
            />
            <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name || 'Chat đơn'}</Text>
                <Text style={styles.lastMessage}>
                    {item.lastMessage?.type === 'text'
                        ? item.lastMessage.content
                        : item.lastMessage?.type === 'image'
                            ? '[Hình ảnh]'
                            : item.lastMessage?.type === 'video'
                                ? '[Video]'
                                : '[Icon]'}
                </Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.time}>{item.lastMessage?.timestamp || '15 phút'}</Text>
                {item.unreadCount > 0 && (
                    <Badge style={styles.badge}>{item.unreadCount}</Badge>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Tìm kiếm"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    icon={() => <MaterialCommunityIcons name="magnify" size={24} color="#888" />}
                />
                <TouchableOpacity style={styles.headerIcon}>
                    <MaterialCommunityIcons name="qrcode" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerIcon}>
                    <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Ưu tiên</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Khác</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0088ff',
        padding: 10,
        paddingTop: 40,
    },
    searchBar: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 10,
        elevation: 0,
    },
    searchInput: {
        fontSize: 16,
    },
    headerIcon: {
        marginLeft: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tab: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        color: '#888',
    },
    listContainer: {
        paddingBottom: 60,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    chatInfo: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    lastMessage: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    time: {
        fontSize: 12,
        color: '#888',
    },
    badge: {
        backgroundColor: '#0088ff',
        marginTop: 5,
    },
});

export default ChatListScreen;