// src/screens/SavedEventsScreen.js
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList
} from 'react-native';
import {
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Text
} from 'react-native-paper';
import { useEvents } from '../context/EventContext';

const SavedEventsScreen = ({ navigation }) => {
  const { savedEvents, removeEvent } = useEvents();

  const handleRemoveEvent = (eventId) => {
    removeEvent(eventId);
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const renderEventItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => handleEventPress(item)}
    >
      <Card.Content>
        <View style={styles.eventHeader}>
          <Title style={styles.eventTitle}>{item.title}</Title>
          <Chip icon="account-group" mode="outlined" size="small">
            {item.clubName}
          </Chip>
        </View>
        
        <Paragraph style={styles.eventTime}>
          {item.date} • {item.time}
        </Paragraph>
        
        <Paragraph style={styles.eventLocation}>
          {item.location}
        </Paragraph>
        
        <Paragraph numberOfLines={2} style={styles.eventDescription}>
          {item.description}
        </Paragraph>
      </Card.Content>
      
      <Card.Actions>
        <Button
          onPress={() => handleRemoveEvent(item.id)}
          icon="bookmark-off"
          textColor="#ff4444"
        >
          Remove
        </Button>
        <Button
          onPress={() => handleEventPress(item)}
          mode="contained"
          compact
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Saved Events" />
      </Appbar.Header>

      {savedEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📚</Text>
          <Title style={styles.emptyStateTitle}>No Saved Events</Title>
          <Paragraph style={styles.emptyStateText}>
            Events you save will appear here for quick access.
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Home')}
            style={styles.exploreButton}
          >
            Explore Events
          </Button>
        </View>
      ) : (
        <FlatList
          data={savedEvents}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
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
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  exploreButton: {
    paddingHorizontal: 32,
  },
});

export default SavedEventsScreen;