import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

interface IconProps {
  size?: number;
  color?: string;
}

export function Home({ size = 24, color = '#000' }: IconProps) {
  return <Icon name="home" size={size} color={color} />;
}

export function Library({ size = 24, color = '#000' }: IconProps) {
  return <Icon name="book" size={size} color={color} />;
}

export function User({ size = 24, color = '#000' }: IconProps) {
  return <Icon name="user" size={size} color={color} />;
} 