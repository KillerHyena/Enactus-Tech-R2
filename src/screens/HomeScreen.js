// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Appbar, Searchbar, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredClubs(clubs);
    } else {
      const filtered = clubs.filter(club =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  }, [searchQuery, clubs]);

  const loadClubs = async () => {
    try {
      const clubsCollection = collection(firestore, 'clubs');
      const clubSnapshot = await getDocs(clubsCollection);
      const clubList = clubSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClubs(clubList);
      setFilteredClubs(clubList);
    } catch (error) {
      console.error('Error loading clubs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadClubs();
  };

  const renderClubItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('ClubDetails', { club: item })}
    >
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="NSUT Clubs" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      
      <Searchbar
        placeholder="Search clubs..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
      <FlatList
        data={filteredClubs}
        renderItem={renderClubItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
});

export default HomeScreen;