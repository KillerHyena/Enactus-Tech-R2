// src/components/ClubCard.js
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';

const ClubCard = ({ club, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.content}>
        {club.logoUrl && (
          <Image source={{ uri: club.logoUrl }} style={styles.logo} />
        )}
        <div style={styles.textContainer}>
          <Title style={styles.title}>{club.name}</Title>
          <Paragraph style={styles.description} numberOfLines={2}>
            {club.description}
          </Paragraph>
          <div style={styles.chipContainer}>
            <Chip mode="outlined" style={styles.memberChip} icon="account-group">
              {club.memberCount || '50+'} members
            </Chip>
            {club.category && (
              <Chip mode="flat" style={styles.categoryChip} textStyle={styles.chipText}>
                {club.category}
              </Chip>
            )}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberChip: {
    marginRight: 8,
    marginBottom: 4,
    height: 32,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 4,
    height: 32,
    backgroundColor: '#e3f2fd',
  },
  chipText: {
    fontSize: 12,
  },
});

export default ClubCard;