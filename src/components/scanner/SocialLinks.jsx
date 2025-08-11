import React from 'react';
import { View, TouchableOpacity, Linking, Text, StyleSheet } from 'react-native';
import { Foundation, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

const socialLinks = [
  {
    name: 'facebook',
    icon: 'social-facebook',
    iconFamily: Foundation,
    url: 'https://www.facebook.com/frank.cairampoma.castro',
    color: '#1877F2',
  },
  {
    name: 'instagram', 
    icon: 'instagram',
    iconFamily: FontAwesome5,
    url: 'https://www.instagram.com/fralch/',
    color: '#E4405F',
  },
  {
    name: 'linkedin',
    icon: 'social-linkedin', 
    iconFamily: Foundation,
    url: 'https://www.linkedin.com/in/frank-cairampoma-78454895/',
    color: '#0A66C2',
  },
];

export default function SocialLinks() {
  const handlePress = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.authorText}>Desarrollado por Frank Cairampoma</Text>
      
      <View style={styles.socialContainer}>
        {socialLinks.map((social) => {
          const IconComponent = social.iconFamily;
          return (
            <TouchableOpacity
              key={social.name}
              style={[styles.socialButton, { borderColor: social.color + '30' }]}
              onPress={() => handlePress(social.url)}
              activeOpacity={0.7}
            >
              <IconComponent 
                name={social.icon} 
                size={24} 
                color={social.color}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      
      <Text style={styles.versionText}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.containerPadding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  
  authorText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.md,
  },
  
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  versionText: {
    color: COLORS.textMuted,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
  },
});