import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SPACING } from '../../constants';
import { useThemedStyles } from '../../hooks/useTheme';

export default function Card({ 
  children, 
  style, 
  padding = SPACING.md,
  margin = 0,
  elevation = 2,
  ...props 
}) {
  const styles = useThemedStyles(createStyles);
  
  const cardStyles = [
    styles.card,
    { 
      padding, 
      margin, 
      elevation,
      shadowOpacity: elevation * 0.05,
    },
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.cardBackground,
    borderRadius: SPACING.borderRadius,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});