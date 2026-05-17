import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BookingTypeSheet } from '../components/BookingTypeSheet';
import { PublicPageContainer } from '../components/PublicPageContainer';
import { usePublicBarbershop } from '../hooks';

interface Props {
  slug: string;
}

export function PublicLandingScreen({ slug }: Props) {
  const router = useRouter();
  const [sheetVisible, setSheetVisible] = useState(false);

  const { data: barbershop, isLoading, isError } = usePublicBarbershop(slug);

  function handleBookingTypeSelect(type: 'walk-in' | 'appointment') {
    setSheetVisible(false);
    if (type === 'walk-in') {
      router.push(`/(public)/${slug}/walk-in` as any);
    } else {
      router.push(`/(public)/${slug}/appointment` as any);
    }
  }

  if (isLoading) {
    return (
      <PublicPageContainer>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.brand.primary} />
        </View>
      </PublicPageContainer>
    );
  }

  if (isError || !barbershop) {
    return (
      <PublicPageContainer>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.text.muted} />
          <Text style={styles.errorTitle}>Barbershop not found</Text>
          <Text style={styles.errorDesc}>This link may be incorrect or no longer active.</Text>
        </View>
      </PublicPageContainer>
    );
  }

  return (
    <PublicPageContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Ionicons name="cut" size={36} color={Colors.text.primary} />
          </View>
          <Text style={styles.heroName}>{barbershop.name}</Text>
          {barbershop.description ? (
            <Text style={styles.heroDesc}>{barbershop.description}</Text>
          ) : null}
        </View>

        {/* Info chips */}
        <View style={styles.infoSection}>
          {barbershop.address ? (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>{barbershop.address}</Text>
            </View>
          ) : null}
          {barbershop.phone ? (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>{barbershop.phone}</Text>
            </View>
          ) : null}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.85}
          onPress={() => setSheetVisible(true)}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>

        <Text style={styles.poweredBy}>Powered by Cukkr</Text>
      </ScrollView>

      <BookingTypeSheet
        visible={sheetVisible}
        onSelect={handleBookingTypeSelect}
        onClose={() => setSheetVisible(false)}
      />
    </PublicPageContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Hero
  hero: {
    backgroundColor: Colors.brand.primary,
    paddingTop: 60,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: 14,
    color: Colors.text.primary,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 4,
  },

  // Info
  infoSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },

  // Book CTA
  bookBtn: {
    marginHorizontal: 24,
    marginTop: 8,
    backgroundColor: Colors.text.primary,
    borderRadius: 999,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  poweredBy: {
    fontSize: 12,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: 24,
  },
});
