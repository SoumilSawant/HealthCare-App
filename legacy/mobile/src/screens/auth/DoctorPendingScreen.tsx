import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { colors, spacing, layout } from '../../theme/theme';
import { AuthStackParamList } from '../../navigation/types';
import FrappeAuthService from '../../services/FrappeAuthService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'DoctorPending'>;

export const DoctorPendingScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, reason } = route.params;
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [rejectionReason] = useState(reason || '');

  const isRejected = status === 'rejected';

  const checkStatus = async () => {
    setRefreshing(true);
    try {
      const latest = await FrappeAuthService.getDoctorApprovalStatus(email);
      setStatus(latest);

      if (latest === 'approved') {
        // Redirect back to DoctorLogin so the doctor can sign in properly
        navigation.replace('DoctorLogin');
      }
    } catch {
      // Silent fail
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (reason === 'rejected') setStatus('rejected');
  }, [reason]);

  const StatusIcon = () => {
    if (isRejected) {
      return (
        <View style={[styles.iconCircle, styles.iconRejected]}>
          <Ionicons name="close-circle" size={48} color={colors.crisis} />
        </View>
      );
    }
    return (
      <View style={[styles.iconCircle, styles.iconPending]}>
        <MaterialCommunityIcons name="clock-check-outline" size={48} color={colors.gold} />
      </View>
    );
  };

  const steps = [
    { label: 'Application submitted', done: true },
    { label: 'Document review by admin', done: false },
    { label: 'Account activated', done: false },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo row */}
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <MaterialCommunityIcons name="stethoscope" size={22} color={colors.surface} />
          </View>
          <Typography variant="bodySemibold" color={colors.ink}>SoulPlace Doctor Portal</Typography>
        </View>

        <View style={styles.content}>
          <StatusIcon />

          <Typography variant="displayXS" color={colors.ink} align="center" style={{ marginTop: spacing.l }}>
            {isRejected ? 'Application Not Approved' : 'Application Under Review'}
          </Typography>

          <Typography variant="body" color={colors.inkSoft} align="center" style={styles.bodyText}>
            {isRejected
              ? 'Unfortunately your application was not approved at this time.'
              : "We're reviewing your credentials. You'll be notified once the admin team approves your account."}
          </Typography>

          {isRejected && rejectionReason ? (
            <View style={styles.reasonBox}>
              <Typography variant="small" color={colors.crisis} style={{ fontWeight: '600', marginBottom: 4 }}>
                Reason:
              </Typography>
              <Typography variant="small" color={colors.inkSoft}>{rejectionReason}</Typography>
            </View>
          ) : null}

          {/* Progress steps (only for pending) */}
          {!isRejected && (
            <View style={styles.stepsCard}>
              {steps.map((s, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={[styles.stepDot, s.done && styles.stepDotDone]}>
                    {s.done
                      ? <Ionicons name="checkmark" size={12} color={colors.surface} />
                      : <View style={styles.stepDotInner} />}
                  </View>
                  <Typography
                    variant="small"
                    color={s.done ? colors.sageDeep : colors.inkSoft}
                    style={[styles.stepLabel, s.done ? { fontWeight: '600' } : {}]}
                  >
                    {s.label}
                  </Typography>
                </View>
              ))}
            </View>
          )}

          <Typography variant="small" color={colors.inkFaint} align="center" style={{ marginBottom: spacing.m }}>
            Account: {email}
          </Typography>

          {!isRejected && (
            <Button
              title={refreshing ? 'Checking...' : 'Refresh Status'}
              variant="primary"
              onPress={checkStatus}
              disabled={refreshing}
              loading={refreshing}
              style={styles.button}
            />
          )}

          {isRejected && (
            <Button
              title="Re-apply"
              variant="primary"
              onPress={() => navigation.replace('DoctorRegister')}
              style={styles.button}
            />
          )}

          <Button
            title="Back to Login"
            variant="ghost"
            onPress={() => navigation.replace('DoctorLogin')}
            style={styles.button}
          />

          <View style={styles.infoBox}>
            <Ionicons name="mail-outline" size={14} color={colors.inkSoft} style={{ marginRight: spacing.s }} />
            <Typography variant="xs" color={colors.inkSoft}>
              Questions? Contact support@soulplace.in
            </Typography>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.ml },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    marginTop: Platform.OS === 'ios' ? spacing.s : spacing.m,
    marginBottom: spacing.l,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: colors.sageDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    marginTop: spacing.xl,
  },
  iconPending: { backgroundColor: colors.goldSoft },
  iconRejected: { backgroundColor: colors.crisisSoft },
  bodyText: {
    marginTop: spacing.m,
    marginBottom: spacing.l,
    paddingHorizontal: spacing.l,
    lineHeight: 22,
  },
  reasonBox: {
    backgroundColor: colors.crisisSoft,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.crisis,
    padding: spacing.m,
    marginBottom: spacing.l,
    width: '100%',
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusSmall,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.m,
    marginBottom: spacing.l,
    width: '100%',
    ...layout.shadowSubtle,
    gap: spacing.m,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.line,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    flexShrink: 0,
  },
  stepDotDone: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  stepDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  stepLabel: { flex: 1 },
  button: { marginVertical: spacing.s, width: '100%' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.l,
  },
});
