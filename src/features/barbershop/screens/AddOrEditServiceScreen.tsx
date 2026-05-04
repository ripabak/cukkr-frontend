import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { ServiceForm } from '@/src/components/ServiceForm';
import { PrimaryButton } from '@/src/components/PrimaryButton';

interface Props {
  isEdit?: boolean;
}

export function AddOrEditServiceScreen({ isEdit = false }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [discount, setDiscount] = useState('');
  const [imageUri] = useState<string | undefined>(undefined);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader
          title={isEdit ? 'Edit Service' : 'New Service'}
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ServiceForm
            name={name}
            onNameChange={setName}
            description={description}
            onDescriptionChange={setDescription}
            price={price}
            onPriceChange={setPrice}
            duration={duration}
            onDurationChange={setDuration}
            isActive={isActive}
            onActiveChange={setIsActive}
            discount={discount}
            onDiscountChange={setDiscount}
            imageUri={imageUri}
            onImagePress={() => {}}
            showDiscount={isEdit}
          />

          <PrimaryButton
            label={isEdit ? 'Save Service' : 'New Service'}
            onPress={() => router.back()}
            style={styles.submitBtn}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEEEE0',
  },
  outer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  submitBtn: {
    marginTop: 8,
  },
});
