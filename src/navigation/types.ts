import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  FaceReading: {
    photoUri: string;
    // JSON-encoded FaceReading, or null when ML Kit found no face.
    reading: string | null;
  };
  Results: {
    data: string;
    photoUri: string;
    // On-device face shape estimate, shown next to the AI's answer.
    onDeviceShape?: string;
    // Id of the scan saved to the user's profile, if saving succeeded.
    scanId?: string;
  };
  Recommendations: {
    data: string;
    scanId?: string;
  };
  About: undefined;
  History: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;
