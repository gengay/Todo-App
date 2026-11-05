import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

type Language = 'th' | 'en';

const translations = {
  th: {
    title: 'ยินดีต้อนรับ',
    subtitle: 'กรอกข้อมูลเพื่อเข้าสู่ระบบ',
    email: 'อีเมล',
    emailPlaceholder: 'กรอกอีเมลของคุณ',
    password: 'รหัสผ่าน',
    passwordPlaceholder: 'กรอกรหัสผ่านของคุณ',
    forgot: 'ลืมรหัสผ่าน?',
    remember: 'จดจำฉัน',
    login: 'เข้าสู่ระบบ',
    loggingIn: 'กำลังเข้าสู่ระบบ...',
    orContinue: 'หรือดำเนินการต่อด้วย',
    google: 'Google',
    github: 'GitHub',
    noAccount: 'ยังไม่มีบัญชี?',
    register: 'สมัครสมาชิก',
    error: 'กรุณากรอกอีเมลและรหัสผ่าน',
  },
  en: {
    title: 'Welcome ',
    subtitle: 'Please enter your details to sign in',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgot: 'Forgot password?',
    remember: 'Remember me',
    login: 'Login',
    loggingIn: 'Signing in...',
    orContinue: 'or continue with',
    google: 'Google',
    github: 'GitHub',
    noAccount: "Don't have an account?",
    register: 'Register',
    error: 'Please enter email and password',
  },
};

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('th');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const t = translations[language];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const theme = isDarkMode
    ? {
        background: '#0f172a',
        card: '#111827',
        cardBorder: '#1f2937',
        text: '#f8fafc',
        mutedText: '#94a3b8',
        inputBackground: '#0f172a',
        inputBorder: '#334155',
        shadow: '#020817',
        divider: '#334155',
        toggleBg: '#1d4ed8',
        toggleText: '#dbeafe',
      }
    : {
        background: '#f8fafc',
        card: '#ffffff',
        cardBorder: '#e2e8f0',
        text: '#0f172a',
        mutedText: '#64748b',
        inputBackground: '#f8fafc',
        inputBorder: '#e2e8f0',
        shadow: '#0f172a',
        divider: '#e2e8f0',
        toggleBg: '#dbeafe',
        toggleText: '#1d4ed8',
      };

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', t.error);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.98,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const getInputStyle = (field: 'email' | 'password') => [
    styles.input,
    {
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder,
      color: isDarkMode ? '#f8fafc' : '#0f172a',
    },
    focusedField === field && {
      borderColor: '#60a5fa',
      backgroundColor: isDarkMode ? '#172554' : '#f8fbff',
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.22,
      shadowRadius: 8,
      elevation: 4,
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                shadowColor: theme.shadow,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerRow}>
              <View style={styles.titleWrap}>
                <Text style={[styles.title, { color: theme.text }]}>{t.title}</Text>
                <Text style={[styles.subtitle, { color: theme.mutedText }]}>{t.subtitle}</Text>
              </View>

              <View style={styles.topActionRow}>
                <TouchableOpacity
                  onPress={() => setLanguage((prev) => (prev === 'th' ? 'en' : 'th'))}
                  activeOpacity={0.8}
                  style={[
                    styles.languageToggle,
                    { backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' },
                  ]}
                >
                  <Text style={[styles.languageText, { color: theme.text }]}>{language === 'th' ? 'EN' : 'TH'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsDarkMode((prev) => !prev)}
                  activeOpacity={0.8}
                  style={[
                    styles.themeToggle,
                    { backgroundColor: isDarkMode ? '#1d4ed8' : '#dbeafe' },
                  ]}
                >
                  <Ionicons name={isDarkMode ? 'sunny-outline' : 'moon-outline'} size={18} color={isDarkMode ? '#dbeafe' : '#1d4ed8'} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.form}>
              <View>
                <Text style={[styles.label, { color: theme.text }]}>{t.email}</Text>
                <View style={getInputStyle('email')}>
                  <Ionicons name="mail-outline" size={18} color={isDarkMode ? '#94a3b8' : '#64748b'} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.emailPlaceholder}
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    selectionColor="#60a5fa"
                  />
                </View>
              </View>

              <View>
                <Text style={[styles.label, { color: theme.text }]}>{t.password}</Text>
                <View style={getInputStyle('password')}>
                  <Ionicons name="lock-closed-outline" size={18} color={isDarkMode ? '#94a3b8' : '#64748b'} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.passwordPlaceholder}
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType="password"
                    selectionColor="#60a5fa"
                  />
                </View>
              </View>

              <View style={styles.utilityRow}>
                <TouchableOpacity
                  style={styles.rememberMeWrap}
                  onPress={() => setRememberMe((prev) => !prev)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: rememberMe ? '#2563eb' : 'transparent',
                        borderColor: rememberMe ? '#2563eb' : theme.inputBorder,
                      },
                    ]}
                  >
                    {rememberMe && <Text style={styles.checkboxCheck}>✓</Text>}
                  </View>
                  <Text style={[styles.rememberText, { color: theme.mutedText }]}>{t.remember}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={[styles.forgotPasswordText, { color: '#60a5fa' }]}>{t.forgot}</Text>
                </TouchableOpacity>
              </View>

              <Pressable
                onPress={handleLogin}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                disabled={loading}
              >
                <Animated.View style={[styles.buttonWrap, { transform: [{ scale: buttonScale }] }]}>
                  <LinearGradient
                    colors={['#3b82f6', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, loading && styles.buttonDisabled]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>{t.login}</Text>
                    )}
                  </LinearGradient>
                </Animated.View>
              </Pressable>
            </View>

            <View style={[styles.divider, { borderColor: theme.divider }]}>
              <Text
                style={[
                  styles.dividerText,
                  {
                    color: theme.mutedText,
                    backgroundColor: isDarkMode ? '#111827' : '#ffffff',
                  },
                ]}
              >
                {t.orContinue}
              </Text>
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: theme.inputBorder,
                  },
                ]}
              >
                <Ionicons name="logo-google" size={18} color="#ea4335" />
                <Text style={[styles.socialText, { color: theme.text }]}>{t.google}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.socialButton,
                  {
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: theme.inputBorder,
                  },
                ]}
              >
                <Ionicons name="logo-github" size={18} color={isDarkMode ? '#f8fafc' : '#111827'} />
                <Text style={[styles.socialText, { color: theme.text }]}>{t.github}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footerContainer}>
              <Text style={[styles.footerText, { color: theme.mutedText }]}>{t.noAccount} </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>{t.register}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggle: {
    minWidth: 52,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  themeToggle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    paddingVertical: 0,
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -4,
    marginBottom: 8,
  },
  rememberMeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: -1,
  },
  rememberText: {
    fontSize: 13,
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonWrap: {
    borderRadius: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 20,
    marginBottom: 18,
  },
  dividerText: {
    alignSelf: 'center',
    marginTop: -10,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
    gap: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
  },
  link: {
    color: '#2563eb',
    fontWeight: '700',
    fontSize: 14,
  },
});