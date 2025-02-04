import React from 'react';
import { Text, StyleSheet, View, TextStyle, StyleProp } from 'react-native';
import { colors } from '@/styles/theme';

interface Props {
  content: string;
  isExpanded?: boolean;
  mentionStyle?: StyleProp<TextStyle>;
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

export function LexicalContent({ content, isExpanded = false, mentionStyle }: Props) {
  const extractPlainText = (node: LexicalNode): string => {
    if (node.type === 'text') {
      return node.text || '';
    }

    if (node.children) {
      return node.children.map(child => extractPlainText(child)).join('');
    }

    return '';
  };

  const renderFormattedContent = (node: LexicalNode): React.ReactNode => {
    if (node.type === 'text') {
      let style: TextStyle = styles.content;

      if (node.format && node.format % 2 === 1) {
        style = { ...style, fontWeight: 'bold' as const };
      }
      if (node.format && node.format % 2 === 0) {
        style = { ...style, fontStyle: 'italic' as const };
      }

      return <Text style={style}>{node.text}</Text>;
    }

    if (node.type === 'mention') {
      return <Text style={[styles.content, mentionStyle]}>@{node.text}</Text>;
    }

    if (node.type === 'paragraph') {
      return (
        <View style={styles.paragraph}>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{renderFormattedContent(child)}</React.Fragment>
          ))}
        </View>
      );
    }

    if (node.children) {
      return node.children.map((child, index) => (
        <React.Fragment key={index}>{renderFormattedContent(child)}</React.Fragment>
      ));
    }

    return null;
  };

  try {
    // content가 이미 JSON 문자열인지 확인
    const isJsonString =
      typeof content === 'string' && (content.startsWith('{') || content.startsWith('['));

    // JSON이 아닌 일반 텍스트면 그대로 표시
    if (!isJsonString) {
      return (
        <Text style={styles.content} numberOfLines={isExpanded ? undefined : 8}>
          {content}
        </Text>
      );
    }

    const parsedContent: LexicalContent = JSON.parse(content);

    if (!isExpanded) {
      const plainText = extractPlainText(parsedContent.root);
      return (
        <Text style={styles.content} numberOfLines={8}>
          {plainText}
        </Text>
      );
    }

    return <View>{renderFormattedContent(parsedContent.root)}</View>;
  } catch (error) {
    console.warn('Failed to parse Lexical content:', error);
    return (
      <Text style={styles.content} numberOfLines={isExpanded ? undefined : 8}>
        {content}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray[700],
  },
  paragraph: {
    marginBottom: 8,
  },
});
