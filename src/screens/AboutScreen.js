// src/screens/AboutScreen.js
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Share
} from 'react-native';
import {
  Appbar,
  Title,
  Paragraph,
  Card,
  Button,
  Divider,
  List
} from 'react-native-paper';

const AboutScreen = ({ navigation }) => {
  const handleContact = () => {
    Linking.openURL('mailto:support@nsutclubconnect.com');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out NSUT Club Connect - The ultimate app for NSUT students to explore clubs and events!',
        title: 'NSUT Club Connect'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRate = () => {
    // This would typically open the app store
    alert('Rate app feature would open app store');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="About" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content style={styles.headerContent}>
            <Title style={styles.appTitle}>NSUT Club Connect</Title>
            <Paragraph style={styles.version}>Version 1.0.0</Paragraph>
            <Paragraph style={styles.tagline}>
              Connecting NSUT students with campus clubs and events
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>About the App</Title>
            <Paragraph style={styles.description}>
              NSUT Club Connect is designed to help students discover and engage with 
              various clubs and societies at Netaji Subhas University of Technology. 
              Stay updated with all the latest events, workshops, and activities 
              happening across campus.
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Features</Title>
            <List.Section>
              <List.Item
                title="Club Directory"
                description="Explore all NSUT clubs with detailed information"
                left={props => <List.Icon {...props} icon="account-group" />}
              />
              <List.Item
                title="Event Calendar"
                description="View all upcoming events in one place"
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              <List.Item
                title="Event Registration"
                description="Register for events directly through the app"
                left={props => <List.Icon {...props} icon="calendar-check" />}
              />
              <List.Item
                title="Saved Events"
                description="Bookmark events you're interested in"
                left={props => <List.Icon {...props} icon="bookmark" />}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Support</Title>
            <Paragraph style={styles.description}>
              Having issues with the app or have suggestions for improvement? 
              We'd love to hear from you!
            </Paragraph>
            
            <View style={styles.buttonGroup}>
              <Button
                mode="outlined"
                onPress={handleContact}
                icon="email"
                style={styles.supportButton}
              >
                Contact Support
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleShare}
                icon="share-variant"
                style={styles.supportButton}
              >
                Share App
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleRate}
                icon="star"
                style={styles.supportButton}
              >
                Rate App
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Development</Title>
            <Paragraph style={styles.developmentText}>
              Developed with ❤️ for NSUT students
            </Paragraph>
            <Paragraph style={styles.credits}>
              Built using React Native, Firebase, and Expo
            </Paragraph>
          </Card.Content>
        </Card>

        <Paragraph style={styles.footer}>
          © 2024 NSUT Club Connect. All rights reserved.
        </Paragraph>
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
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appTitle: {
    fontSize: 24,
    marginBottom: 4,
  },
  version: {
    color: '#666',
    marginBottom: 8,
  },
  tagline: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    lineHeight: 20,
  },
  buttonGroup: {
    marginTop: 16,
  },
  supportButton: {
    marginBottom: 8,
  },
  developmentText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 8,
  },
  credits: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 24,
  },
});

export default AboutScreen;