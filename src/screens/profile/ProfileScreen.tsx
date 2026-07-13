import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors, spacing, layout } from '../../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';

export const ProfileScreen = () => {
  const { logout, user, updateUser, t } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [livingStatus, setLivingStatus] = useState<'family' | 'alone' | null>(null);
  const [therapyExperience, setTherapyExperience] = useState<'yes' | 'no' | null>(null);

  const openEditModal = () => {
    setName(user?.fullName || '');
    setMobileNumber(user?.mobileNumber || '');
    setAge(user?.age ? user.age.toString() : '');
    setGender((user?.gender as any) || '');
    setLivingStatus(user?.livingStatus || 'family');
    setTherapyExperience(user?.therapyExperience ? 'yes' : 'no');
    setModalVisible(true);
  };

  const handleSave = () => {
    updateUser({
      fullName: name,
      mobileNumber: mobileNumber,
      age: age ? Number(age) : undefined,
      gender: gender || undefined,
      livingStatus: livingStatus || undefined,
      therapyExperience: therapyExperience === 'yes',
    });
    setModalVisible(false);
  };

  const menuItems = [
    { id: '1', title: t('pastConsultations'), icon: 'time-outline', route: 'PastConsultations' as const },
    { id: '2', title: t('notesPrescriptions'), icon: 'document-text-outline', route: 'NotesPrescriptions' as const },
    { id: '3', title: t('savedResources'), icon: 'bookmark-outline', route: 'SavedResources' as const },
    { id: '4', title: t('paymentMethods'), icon: 'card-outline', route: 'PaymentMethods' as const },
    { id: '5', title: t('settings'), icon: 'settings-outline', route: 'Settings' as const },
    { id: '6', title: t('helpSupport'), icon: 'help-circle-outline', route: 'HelpSupport' as const },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Typography variant="h2" color={colors.primary}>
              {(user?.fullName || 'User').charAt(0).toUpperCase()}
            </Typography>
          </View>
          <View style={styles.userInfo}>
            <Typography variant="h2" color={colors.primary}>{user?.fullName || 'User'}</Typography>
            {user?.mobileNumber ? (
              <Typography variant="body" color={colors.textSecondary}>+91 {user.mobileNumber}</Typography>
            ) : user?.email ? (
              <Typography variant="body" color={colors.textSecondary}>{user.email}</Typography>
            ) : (
              <Typography variant="body" color={colors.inkFaint}>No phone number added</Typography>
            )}
            <TouchableOpacity onPress={openEditModal} activeOpacity={0.7}>
              <Typography variant="caption" color={colors.primary} style={styles.editProfile}>
                {t('editProfile')}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        <Card style={styles.statsCard} variant="flat">
          <View style={styles.stat}>
            <Typography variant="h3" color={colors.primary}>0</Typography>
            <Typography variant="caption" color={colors.textSecondary}>{t('sessions')}</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Typography variant="h3" color={colors.primary}>0</Typography>
            <Typography variant="caption" color={colors.textSecondary}>{t('resources')}</Typography>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Typography variant="h3" color={colors.primary}>0</Typography>
            <Typography variant="caption" color={colors.textSecondary}>{t('assessments')}</Typography>
          </View>
        </Card>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={colors.textSecondary} />
                <Typography variant="bodySemibold" style={styles.menuItemText}>{item.title}</Typography>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Typography variant="bodySemibold" color={colors.error} style={{ marginLeft: spacing.s }}>
            {t('logout')}
          </Typography>
        </TouchableOpacity>

      </ScrollView>

      {/* Slide-up Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <TouchableOpacity 
            style={styles.modalDismissArea} 
            activeOpacity={1} 
            onPress={() => setModalVisible(false)} 
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h2" color={colors.ink}>{t('editProfile')}</Typography>
              <TouchableOpacity onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={24} color={colors.inkSoft} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Name Field */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Name
                </Typography>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor={colors.inkFaint}
                  />
                </View>
              </View>

              {/* Mobile Number Field */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Mobile number
                </Typography>
                <View style={[styles.inputWrapper, { flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={styles.prefixContainer}>
                    <Typography variant="bodySemibold" color={colors.inkSoft}>+91</Typography>
                  </View>
                  <TextInput
                    style={[styles.input, { paddingHorizontal: 0 }]}
                    placeholder="Enter mobile number"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholderTextColor={colors.inkFaint}
                    maxLength={10}
                  />
                </View>
              </View>

              {/* Age Field */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Age
                </Typography>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Your age"
                    keyboardType="number-pad"
                    value={age}
                    onChangeText={setAge}
                    placeholderTextColor={colors.inkFaint}
                  />
                </View>
              </View>

              {/* Gender Field */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Gender
                </Typography>
                <View style={styles.chipsContainer}>
                  {(['male', 'female', 'other'] as const).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[styles.chip, gender === option && styles.chipSelected]}
                      onPress={() => setGender(option)}
                      activeOpacity={0.8}
                    >
                      <Typography
                        variant="small"
                        color={gender === option ? colors.sageDeep : colors.inkSoft}
                        style={{ fontWeight: gender === option ? '600' : '500' }}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Living Status */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Living status
                </Typography>
                <View style={styles.chipsContainer}>
                  <TouchableOpacity
                    style={[styles.chip, livingStatus === 'family' && styles.chipSelected]}
                    onPress={() => setLivingStatus('family')}
                    activeOpacity={0.8}
                  >
                    <Typography
                      variant="small"
                      color={livingStatus === 'family' ? colors.sageDeep : colors.inkSoft}
                      style={{ fontWeight: livingStatus === 'family' ? '600' : '500' }}
                    >
                      With family
                    </Typography>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, livingStatus === 'alone' && styles.chipSelected]}
                    onPress={() => setLivingStatus('alone')}
                    activeOpacity={0.8}
                  >
                    <Typography
                      variant="small"
                      color={livingStatus === 'alone' ? colors.sageDeep : colors.inkSoft}
                      style={{ fontWeight: livingStatus === 'alone' ? '600' : '500' }}
                    >
                      Alone
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Therapy Experience */}
              <View style={styles.fieldContainer}>
                <Typography variant="small" color={colors.inkSoft} style={styles.label}>
                  Been to therapy before?
                </Typography>
                <View style={styles.chipsContainer}>
                  <TouchableOpacity
                    style={[styles.chip, therapyExperience === 'yes' && styles.chipSelected]}
                    onPress={() => setTherapyExperience('yes')}
                    activeOpacity={0.8}
                  >
                    <Typography
                      variant="small"
                      color={therapyExperience === 'yes' ? colors.sageDeep : colors.inkSoft}
                      style={{ fontWeight: therapyExperience === 'yes' ? '600' : '500' }}
                    >
                      Yes
                    </Typography>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, therapyExperience === 'no' && styles.chipSelected]}
                    onPress={() => setTherapyExperience('no')}
                    activeOpacity={0.8}
                  >
                    <Typography
                      variant="small"
                      color={therapyExperience === 'no' ? colors.sageDeep : colors.inkSoft}
                      style={{ fontWeight: therapyExperience === 'no' ? '600' : '500' }}
                    >
                      No
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity 
                style={[styles.saveButton, !name && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={!name}
                activeOpacity={0.8}
              >
                <Typography variant="bodySemibold" color={colors.surface}>Save Changes</Typography>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.l,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.m,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: spacing.l,
    backgroundColor: '#e2ece9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  editProfile: {
    marginTop: spacing.xs,
    textDecorationLine: 'underline',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.secondaryLight,
    paddingVertical: spacing.l,
    marginBottom: spacing.xl,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
  },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusLarge,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...layout.shadowSubtle,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.l,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: spacing.m,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.l,
    backgroundColor: '#FEE2E2',
    borderRadius: layout.borderRadiusLarge,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: layout.borderRadiusLarge,
    borderTopRightRadius: layout.borderRadiusLarge,
    paddingTop: spacing.l,
    paddingHorizontal: spacing.l,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl : spacing.l,
    maxHeight: '80%',
    ...layout.shadow,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.l,
    paddingHorizontal: spacing.s,
  },
  modalForm: {
    paddingBottom: spacing.l,
  },
  fieldContainer: {
    marginBottom: spacing.m,
  },
  label: {
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.s,
  },
  inputWrapper: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: layout.borderRadiusSmall,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
  },
  prefixContainer: {
    paddingRight: spacing.s,
    borderRightWidth: 1.5,
    borderColor: colors.line,
    height: '100%',
    justifyContent: 'center',
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    fontFamily: 'Outfit',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  chip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 30,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...layout.shadowSm,
  },
  chipSelected: {
    backgroundColor: colors.sageSoft,
    borderColor: colors.sage,
  },
  saveButton: {
    height: 52,
    backgroundColor: colors.sage,
    borderRadius: layout.borderRadiusSmall,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.l,
    ...layout.shadowSubtle,
  },
  saveButtonDisabled: {
    backgroundColor: colors.inkFaint,
  },
});
