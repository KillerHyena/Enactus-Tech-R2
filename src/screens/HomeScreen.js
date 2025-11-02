import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
  FlatList
} from 'react-native';
import { useEvent } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import { formatDate } from '../utils/helper';

const HomeScreen = ({ navigation }) => {
  const { 
    featuredEvents, 
    upcomingEvents, 
    loading, 
    error,
    refreshEvents 
  } = useEvent();
  
  const { user, userProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'academic', name: 'Academic' },
    { id: 'social', name: 'Social' },
    { id: 'sports', name: 'Sports' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'workshop', name: 'Workshops' }
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshEvents();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh events');
    } finally {
      setRefreshing(false);
    }
  }, [refreshEvents]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const renderFeaturedEvent = ({ item }) => (
    <TouchableOpacity
      style={styles.featuredEventCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/300x150?text=Event' }}
        style={styles.featuredImage}
        defaultSource={require('../../assets/placeholder-event.jpg')}
      />
      <View style={styles.featuredOverlay}>
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>Featured</Text>
        </View>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.featuredDate}>
          {formatDate(item.date, { weekday: 'short', month: 'short', day: 'numeric' })}
        </Text>
        <Text style={styles.featuredLocation} numberOfLines={1}>
          {item.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        activeCategory === item.id && styles.categoryChipActive
      ]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryChipText,
          activeCategory === item.id && styles.categoryChipTextActive
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderUpcomingEvent = ({ item }) => (
    <EventCard 
      event={item}
      onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
      style={styles.upcomingEventCard}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Events Found</Text>
      <Text style={styles.emptyStateText}>
        There are no events scheduled at the moment. Check back later!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello{userProfile?.displayName ? `, ${userProfile.displayName}` : ''}! 👋
            </Text>
            <Text style={styles.subtitle}>
              Discover amazing events around campus
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{ 
                uri: userProfile?.photoURL || 'https://via.placeholder.com/40x40?text=U'
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.searchBarText}>Search events, clubs, or categories...</Text>
        </TouchableOpacity>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Events</Text>
              <TouchableOpacity onPress={() => navigation.navigate('FeaturedEvents')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredEvents}
              renderItem={renderFeaturedEvent}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryChip}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingEvents.length > 0 ? (
            <FlatList
              data={upcomingEvents}
              renderItem={renderUpcomingEvent}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.upcomingList}
            />
          ) : (
            renderEmptyState()
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('EventCalendar')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#007AFF' }]}>
                <Text style={styles.quickActionIconText}>📅</Text>
              </View>
              <Text style={styles.quickActionText}>Calendar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Clubs')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#34C759' }]}>
                <Text style={styles.quickActionIconText}>👥</Text>
              </View>
              <Text style={styles.quickActionText}>Clubs</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('MyEvents')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF9500' }]}>
                <Text style={styles.quickActionIconText}>🎫</Text>
              </View>
              <Text style={styles.quickActionText}>My Events</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => navigation.navigate('Map')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF3B30' }]}>
                <Text style={styles.quickActionIconText}>🗺️</Text>
              </View>
              <Text style={styles.quickActionText}>Campus Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  searchBar: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchBarText: {
    color: '#999',
    fontSize: 16,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  featuredList: {
    paddingHorizontal: 15,
  },
  featuredEventCard: {
    width: 280,
    height: 180,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredDate: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  featuredLocation: {
    color: '#ccc',
    fontSize: 12,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    color: '#666',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  upcomingList: {
    paddingHorizontal: 15,
  },
  upcomingEventCard: {
    marginBottom: 10,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderStyle: 'dashed',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default HomeScreen;