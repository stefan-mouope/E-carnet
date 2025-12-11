import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

export default function Badge({ text, variant = 'primary' }: BadgeProps) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});
