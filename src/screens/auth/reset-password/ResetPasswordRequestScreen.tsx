import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from '@/components/common';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { EmailForm } from './EmailForm';
import { VerifyCodeForm } from './VerifyCodeForm';
import { ResetPasswordForm } from './ResetPasswordForm';

type Step = 'email' | 'code' | 'password';

export function ResetPasswordRequestScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleEmailSuccess = (_email: string) => {
    setEmail(_email);
    setStep('code');
  };

  const handleCodeSuccess = () => {
    setStep('password');
  };

  const handleGoToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>비밀번호 재설정</Text>
        </View>

        {step === 'email' && (
          <EmailForm onSuccess={handleEmailSuccess} onClickGoToLogin={handleGoToLogin} />
        )}
        {step === 'code' && (
          <VerifyCodeForm
            email={email}
            onSuccess={handleCodeSuccess}
            onClickGoToLogin={handleGoToLogin}
          />
        )}
        {step === 'password' && (
          <ResetPasswordForm
            email={email}
            onSuccess={handleGoToLogin}
            onClickGoToLogin={handleGoToLogin}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
