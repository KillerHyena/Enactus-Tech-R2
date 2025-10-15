// src/screens/EventDetailsScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Share,
  Alert
} from 'react-native';
import {
  Appbar,
  Title,
  Paragraph,
  Button,
  Chip,
  Divider,
  TextInput,
  Dialog,
  Portal
} from 'react-native-paper';
import { useEvents } from '../context/EventContext';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../config/firebaseConfig';
import { useAuth } from '../context/AuthContext';

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const { saveEvent, removeEvent, isEventSaved } = useEvents();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: ''
  });
  const [registering, setRegistering] = useState(false);

  const saved = isEventSaved(event.id);

  const handleSaveEvent = () => {
    if (saved) {
      removeEvent(event.id);
    } else {
      saveEvent(event);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this event: ${event.title}\n\n${event.description}\n\nDate: ${event.date} at ${event.time}\nLocation: ${event.location}`,
        title: event.title
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRegister = async () => {
    if (event.registrationLink) {
      Linking.openURL(event.registrationLink);
    } else {
      setVisible(true);
    }
  };

  const submitRegistration = async () => {
    if (!registrationData.name || !registrationData.rollNo || !registrationData.email) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setRegistering(true);
    try {
      await addDoc(collection(firestore, 'registrations'), {
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        userEmail: user.email,
        ...registrationData,
        timestamp: new Date()
      });

      Alert.alert('Success', 'Registration submitted successfully!');
      setVisible(false);
      setRegistrationData({ name: '', rollNo: '', email: '', phone: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit registration');
      console.error('Registration error:', error);
    }
    setRegistering(false);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Event Details" />
        <Appbar.Action icon="share-variant" onPress={handleShare} />
        <Appbar.Action
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          onPress={handleSaveEvent}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Title style={styles.title}>{event.title}</Title>
          <Chip icon="account-group" style={styles.clubChip}>
            {event.clubName}
          </Chip>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Chip icon="calendar" mode="outlined" style={styles.detailChip}>
              {formatDate(event.date)}
            </Chip>
            <Paragraph style={styles.time}>{event.time}</Paragraph>
          </View>

          <View style={styles.detailItem}>
            <Chip icon="map-marker" mode="outlined" style={styles.detailChip}>
              {event.location}
            </Chip>
          </View>

          {event.type && (
            <Chip icon="tag" style={styles.typeChip}>
              {event.type}
            </Chip>
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Title style={styles.sectionTitle}>About this Event</Title>
          <Paragraph style={styles.description}>
            {event.description}
          </Paragraph>
        </View>

        {event.requirements && (
          <View style={styles.section}>
            <Title style={styles.sectionTitle}>Requirements</Title>
            <Paragraph style={styles.requirements}>
              {event.requirements}
            </Paragraph>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.registerButton}
            icon="calendar-check"
          >
            Register for Event
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Event Registration</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Full Name *"
              value={registrationData.name}
              onChangeText={(text) => setRegistrationData(prev => ({ ...prev, name: text }))}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Roll Number *"
              value={registrationData.rollNo}
              onChangeText={(text) => setRegistrationData(prev => ({ ...prev, rollNo: text }))}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Email *"
              value={registrationData.email}
              onChangeText={(text) => setRegistrationData(prev => ({ ...prev, email: text }))}
              mode="outlined"
              keyboardType="email-address"
              style={styles.dialogInput}
            />
            <TextInput
              label="Phone Number"
              value={registrationData.phone}
              onChangeText={(text) => setRegistrationData(prev => ({ ...prev, phone: text }))}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button 
              onPress={submitRegistration}
              loading={registering}
              disabled={registering}
            >
              Submit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  clubChip: {
    alignSelf: 'flex-start',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailChip: {
    marginRight: 8,
  },
  time: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  typeChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  requirements: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  actions: {
    marginTop: 24,
  },
  registerButton: {
    paddingVertical: 8,
  },
  dialogInput: {
    marginBottom: 12,
  },
});

export default EventDetailsScreen;