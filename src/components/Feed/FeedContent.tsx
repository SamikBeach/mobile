import React from 'react';
import { Text, StyleSheet, View, TextStyle } from 'react-native';

interface Props {
  content: string;
}

interface LexicalNode {
  children?: LexicalNode[];
  text?: string;
  type: string;
  format?: number;
  style?: string;
  textFormat?: number;
  textStyle?: string;
}

interface LexicalContent {
  root: LexicalNode;
}

export function FeedContent({ content }: Props) {
  const renderNode = (node: LexicalNode): React.ReactNode => {
    if (node.type === 'text') {
      let style: TextStyle = styles.content;

      // format 값에 따른 스타일 적용
      if (node.format && node.format & 1) {
        // BOLD
        style = { ...style, fontWeight: 'bold' as const };
      }
      if (node.format && node.format & 2) {
        // ITALIC
        style = { ...style, fontStyle: 'italic' as const };
      }
      // ... 다른 포맷 처리

      return <Text style={style}>{node.text}</Text>;
    }

    if (node.type === 'paragraph') {
      return (
        <View style={styles.paragraph}>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
          ))}
        </View>
      );
    }

    if (node.children) {
      return (
        <React.Fragment>
          {node.children.map((child, index) => (
            <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
          ))}
        </React.Fragment>
      );
    }

    return null;
  };

  try {
    const parsedContent: LexicalContent = JSON.parse(content);
    return <View>{renderNode(parsedContent.root)}</View>;
  } catch (error) {
    console.error('Failed to parse Lexical content:', error);
    return <Text style={styles.content}>{content}</Text>;
  }
}

const styles = StyleSheet.create({
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  paragraph: {
    marginBottom: 8,
  },
});
