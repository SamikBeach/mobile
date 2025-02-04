/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { colors } from '@/styles/theme';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        marginTop: 20,
        height: 'auto',
        minHeight: 50,
        paddingVertical: 12,
        backgroundColor: colors.gray[900],
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftWidth: 0,
        marginTop: 20,
        height: 'auto',
        minHeight: 50,
        paddingVertical: 12,
        backgroundColor: colors.gray[900],
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        fontWeight: '500',
        color: 'white',
      }}
    />
  ),
};
