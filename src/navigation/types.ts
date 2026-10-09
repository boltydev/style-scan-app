import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  Results: {
    data: string;
    photoUri: string;
  };
  Recommendations: {
    data: string;
  };
  About: undefined;
  History: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;
