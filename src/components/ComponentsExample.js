import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { 
  Button, 
  Card, 
  Input, 
  Loading, 
  StatsCard, 
  SessionCard 
} from '../components';

/**
 * Example screen showcasing all UI components
 * Copy this to your screens folder and customize as needed
 */
const ComponentsExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>UI Components</Text>

        {/* Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buttons</Text>
          <Button 
            title="Primary Button" 
            onPress={() => console.log('Primary')}
            variant="primary"
            size="medium"
          />
          <Button 
            title="Secondary Button" 
            onPress={() => console.log('Secondary')}
            variant="secondary"
            size="medium"
            style={styles.buttonSpacing}
          />
          <Button 
            title="Outline Button" 
            onPress={() => console.log('Outline')}
            variant="outline"
            size="medium"
            style={styles.buttonSpacing}
          />
          <Button 
            title="Loading..." 
            onPress={() => {}}
            loading={true}
            style={styles.buttonSpacing}
          />
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards</Text>
          <Card glassmorphism style={styles.cardSpacing}>
            <Text style={styles.cardText}>Glassmorphism Card</Text>
            <Text style={styles.cardSubtext}>
              Beautiful frosted glass effect with transparency
            </Text>
          </Card>
          <Card 
            gradient 
            gradientColors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
          >
            <Text style={styles.cardText}>Gradient Card</Text>
            <Text style={styles.cardSubtext}>
              Smooth gradient background with soft colors
            </Text>
          </Card>
        </View>

        {/* Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inputs</Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>

        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stats Cards</Text>
          <View style={styles.statsRow}>
            <StatsCard
              title="Total Hours"
              value="142"
              subtitle="This month"
              gradientColors={['#667eea', '#764ba2']}
              style={styles.statsCard}
            />
            <StatsCard
              title="Attendance"
              value="95%"
              subtitle="Rate"
              gradientColors={['#f093fb', '#f5576c']}
              style={styles.statsCard}
            />
          </View>
        </View>

        {/* Session Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Cards</Text>
          <SessionCard
            date="Mon, Feb 7, 2026"
            checkIn="09:00 AM"
            checkOut="05:30 PM"
            duration="8h 30m"
            status="completed"
            location="Main Office, Downtown"
            onPress={() => console.log('Session pressed')}
          />
          <SessionCard
            date="Sun, Feb 6, 2026"
            checkIn="09:15 AM"
            checkOut="--:--"
            status="active"
            location="Remote"
            onPress={() => console.log('Session pressed')}
          />
          <SessionCard
            date="Sat, Feb 5, 2026"
            checkIn="--:--"
            checkOut="--:--"
            status="pending"
            location="Main Office, Downtown"
            onPress={() => console.log('Session pressed')}
          />
        </View>

        {/* Loading */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Loading</Text>
          <View style={styles.loadingContainer}>
            <Loading size={60} />
          </View>
        </View>

        {/* Submit Button */}
        <Button 
          title="Submit" 
          onPress={handleSubmit}
          variant="primary"
          size="large"
          loading={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  buttonSpacing: {
    marginTop: 12,
  },
  cardSpacing: {
    marginBottom: 16,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default ComponentsExample;
