import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Feather';

interface YoutubeDialogProps {
  videoId: string | null;
  onClose: () => void;
}

export function YoutubeDialog({ videoId, onClose }: YoutubeDialogProps) {
  if (!videoId) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={!!videoId} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <WebView
            source={{
              uri: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
            }}
            style={styles.webview}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="x" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width - 40,
    height: (width - 40) * 0.5625, // 16:9 비율
    backgroundColor: '#000000',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
