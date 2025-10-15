// src/screens/ClubDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Image
} from 'react-native';
import {
  Appbar,
  Title,
  Paragraph,
  Card,
  Button,
  Chip,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

const ClubDetailsScreen = ({ route, navigation }) => {
  const { club } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    loadClubEvents();
  }, []);

  const loadClubEvents = async () => {
    try {
      const eventsCollection = collection(firestore, 'events');
      const q = query(
        eventsCollection,
        where('clubId', '==', club.id),
        orderBy('date', 'asc')
      );
      const eventSnapshot = await getDocs(q);
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventList);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const handleContactPress = (contactType, value) => {
    if (contactType === 'email') {
      Linking.openURL(`mailto:${value}`);
    } else if (contactType === 'phone') {
      Linking.openURL(`tel:${value}`);
    } else if (contactType === 'instagram') {
      Linking.openURL(`https://instagram.com/${value}`);
    }
  };

  const renderAboutTab = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>About {club.name}</Title>
        <Paragraph style={styles.description}>
          {club.description || 'No description available.'}
        </Paragraph>
        
        {club.members && (
          <>
            <Title style={styles.sectionTitle}>Core Team</Title>
            {club.members.map((member, index) => (
              <View key={index} style={styles.memberItem}>
                <Paragraph style={styles.memberName}>{member.name}</Paragraph>
                <Paragraph style={styles.memberRole}>{member.role}</Paragraph>
              </View>
            ))}
          </>
        )}
      </Card.Content>
    </Card>
  );

  const renderEventsTab = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Upcoming Events</Title>
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : events.length === 0 ? (
          <Paragraph style={styles.noEvents}>No upcoming events</Paragraph>
        ) : (
          events.map(event => (
            <Card
              key={event.id}
              style={styles.eventCard}
              onPress={() => handleEventPress(event)}
            >
              <Card.Content>
                <Title>{event.title}</Title>
                <Paragraph>{event.date} • {event.time}</Paragraph>
                <Paragraph numberOfLines={2}>{event.description}</Paragraph>
                <Chip icon="calendar" style={styles.eventChip}>
                  {event.type || 'Event'}
                </Chip>
              </Card.Content>
            </Card>
          ))
        )}
      </Card.Content>
    </Card>
  );

  const renderContactTab = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Contact Information</Title>
        
        {club.email && (
          <Button
            icon="email"
            mode="outlined"
            onPress={() => handleContactPress('email', club.email)}
            style={styles.contactButton}
          >
            {club.email}
          </Button>
        )}
        
        {club.phone && (
          <Button
            icon="phone"
            mode="outlined"
            onPress={() => handleContactPress('phone', club.phone)}
            style={styles.contactButton}
          >
            {club.phone}
          </Button>
        )}
        
        {club.instagram && (
          <Button
            icon="instagram"
            mode="outlined"
            onPress={() => handleContactPress('instagram', club.instagram)}
            style={styles.contactButton}
          >
            @{club.instagram}
          </Button>
        )}
        
        {club.website && (
          <Button
            icon="web"
            mode="outlined"
            onPress={() => Linking.openURL(club.website)}
            style={styles.contactButton}
          >
            Visit Website
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={club.name} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Club Header */}
        <Card style={styles.headerCard}>
          <Card.Content style={styles.headerContent}>
            {club.logoUrl && (
              <Image source={{ uri: club.logoUrl }} style={styles.logo} />
            )}
            <Title style={styles.clubTitle}>{club.name}</Title>
            <Chip icon="account-group" style={styles.memberChip}>
              {club.memberCount || '50+'} members
            </Chip>
          </Card.Content>
        </Card>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['about', 'events', 'contact'].map(tab => (
            <Button
              key={tab}
              mode={activeTab === tab ? 'contained' : 'outlined'}
              onPress={() => setActiveTab(tab)}
              style={styles.tabButton}
              compact
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Tab Content */}
        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'contact' && renderContactTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  clubTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  memberChip: {
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  description: {
    lineHeight: 20,
    marginTop: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  memberName: {
    fontWeight: '500',
  },
  memberRole: {
    color: '#666',
    fontSize: 12,
  },
  eventCard: {
    marginBottom: 12,
  },
  eventChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  contactButton: {
    marginVertical: 4,
    justifyContent: 'flex-start',
  },
  loader: {
    marginVertical: 20,
  },
  noEvents: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
});

export default ClubDetailsScreen;