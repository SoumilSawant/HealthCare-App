import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, typography, layout } from '../../theme/theme';
import { useAuth } from '../../context/AuthContext';

export const RegisterProfileScreen = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" color={colors.primary}>Profile Setup</Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Step 1 of onboarding — tell us a little about yourself.
        </Typography>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.textLight}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          placeholderTextColor={colors.textLight}
        />

        <View style={styles.bottomArea}>
          <Button title="Complete Setup" onPress={login} disabled={!name || !age} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.l },
  subtitle: { marginTop: spacing.s, marginBottom: spacing.l },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.m,
  },
  bottomArea: { marginTop: 'auto' },
});
