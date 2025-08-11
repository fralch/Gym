import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants';

export default function Card({ 
  children, 
  style, 
  padding = SPACING.md,
  margin = 0,
  elevation = 2,
  ...props 
}) {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.borderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});