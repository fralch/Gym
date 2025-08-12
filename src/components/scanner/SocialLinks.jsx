import React from 'react';
import { View, TouchableOpacity, Linking, Text, StyleSheet } from 'react-native';
import { Foundation, FontAwesome5 } from '@expo/vector-icons';
import { SPACING, TYPOGRAPHY } from '../../constants';
import { useThemedStyles } from '../../hooks/useTheme';

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
  const styles = useThemedStyles(createStyles);
  
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

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.containerPadding,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    alignItems: 'center',
  },
  
  authorText: {
    color: theme.textSecondary,
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
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: theme.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  versionText: {
    color: theme.textMuted,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
  },
});