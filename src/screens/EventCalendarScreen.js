// src/screens/EventCalendarScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SectionList
} from 'react-native';
import {
  Appbar,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Chip,
  ActivityIndicator
} from 'react-native-paper';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';

const EventCalendarScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sectionedEvents, setSectionedEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  useEffect(() => {
    // Group events by date
    const grouped = filteredEvents.reduce((groups, event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {});

    const sectionList = Object.keys(grouped).map(date => ({
      title: formatSectionDate(date),
      data: grouped[date]
    }));

    setSectionedEvents(sectionList);
  }, [filteredEvents]);

  const loadEvents = async () => {
    try {
      const eventsCollection = collection(firestore, 'events');
      const q = query(eventsCollection, orderBy('date', 'asc'));
      const eventSnapshot = await getDocs(q);
      const eventList = eventSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventList);
      setFilteredEvents(eventList);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSectionDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const renderEventItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('EventDetails', { event: item })}
    >
      <Card.Content>
        <View style={styles.eventHeader}>
          <Title style={styles.eventTitle}>{item.title}</Title>
          <Chip icon="account-group" mode="outlined" size="small">
            {item.clubName}
          </Chip>
        </View>
        
        <Paragraph style={styles.eventTime}>
          {item.time} • {item.location}
        </Paragraph>
        
        <Paragraph numberOfLines={2} style={styles.eventDescription}>
          {item.description}
        </Paragraph>

        {item.type && (
          <Chip icon="tag" style={styles.eventType} size="small">
            {item.type}
          </Chip>
        )}
      </Card.Content>
    </Card>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Title style={styles.sectionTitle}>{title}</Title>
    </View>
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
        <Appbar.Content title="Event Calendar" />
      </Appbar.Header>

      <Searchbar
        placeholder="Search events..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {filteredEvents.length === 0 ? (
        <View style={styles.center}>
          <Paragraph style={styles.noEvents}>
            {searchQuery ? 'No events found' : 'No upcoming events'}
          </Paragraph>
        </View>
      ) : (
        <SectionList
          sections={sectionedEvents}
          keyExtractor={item => item.id}
          renderItem={renderEventItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
        />
      )}
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
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#6200ee',
  },
  card: {
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  eventType: {
    alignSelf: 'flex-start',
  },
  noEvents: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default EventCalendarScreen;