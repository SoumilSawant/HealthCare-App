import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Typography } from '../../components/Typography';
import { colors, spacing, layout } from '../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AssessStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AssessStackParamList, 'Safety'>;

export const SafetyScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Typography variant="bodySemibold" color={colors.inkFaint} align="center">
            We're here for you
          </Typography>
        </View>

        <View style={styles.crisisPanel}>
          <Typography variant="h3" color={colors.ink} style={{ marginBottom: spacing.s }}>
            You don't have to go through this alone
          </Typography>
          <Typography variant="small" color={colors.crisis} style={{ marginBottom: spacing.l }}>
            Some answers suggest you may be going through something very hard. Please reach out — help is available 24×7.
          </Typography>

          <View style={styles.crisisLine}>
            <Typography variant="bodySemibold" color={colors.ink}>Tele MANAS</Typography>
            <TouchableOpacity style={styles.callBtn}>
              <Typography variant="bodySemibold" color={colors.surface}>📞 Call</Typography>
            </TouchableOpacity>
          </View>
          
          <View style={styles.crisisLine}>
            <Typography variant="bodySemibold" color={colors.ink}>iCall</Typography>
            <TouchableOpacity style={styles.callBtn}>
              <Typography variant="bodySemibold" color={colors.surface}>📞 Call</Typography>
            </TouchableOpacity>
          </View>

          <View style={styles.crisisLine}>
            <Typography variant="bodySemibold" color={colors.ink}>NIMHANS Helpline</Typography>
            <TouchableOpacity style={styles.callBtn}>
              <Typography variant="bodySemibold" color={colors.surface}>📞 Call</Typography>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.btnCrisis}>
          <Typography variant="bodySemibold" color={colors.surface}>Talk to someone now</Typography>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGhost}>
          <Typography variant="bodySemibold" color={colors.ink}>Book an urgent session</Typography>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ marginTop: spacing.m, paddingVertical: spacing.s }}
          onPress={() => navigation.goBack()}
        >
          <Typography variant="small" color={colors.inkSoft} align="center">
            Continue to my results
          </Typography>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    width: '100%', maxWidth: 768, alignSelf: 'center',

    padding: spacing.l,
    paddingTop: spacing.s,
  },
  header: {
    marginBottom: spacing.l,
  },
  crisisPanel: {
    backgroundColor: colors.crisisSoft,
    borderRadius: layout.borderRadiusSmall,
    padding: spacing.m,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: 'rgba(197, 84, 74, 0.2)',
  },
  crisisLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: layout.borderRadiusSmall,
    marginBottom: spacing.s,
  },
  callBtn: {
    backgroundColor: colors.crisis,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  btnCrisis: {
    backgroundColor: colors.crisis,
    paddingVertical: 14,
    borderRadius: layout.borderRadiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.s,
  },
  btnGhost: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.inkFaint,
    borderRadius: layout.borderRadiusLarge,
  },
});
