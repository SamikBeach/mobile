import React from 'react';
import { Text, StyleSheet, View, TextStyle } from 'react-native';

interface Props {
  content: string;
  isExpanded?: boolean;
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

export function FeedContent({ content, isExpanded = false }: Props) {
  // 텍스트만 추출하는 함수
  const extractPlainText = (node: LexicalNode): string => {
    if (node.type === 'text') {
      return node.text || '';
    }

    if (node.children) {
      return node.children.map(child => extractPlainText(child)).join('');
    }

    return '';
  };

  // 포맷팅된 컨텐츠를 렌더링하는 함수
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
      return (
        <React.Fragment>
          {node.children.map((child, index) => (
            <React.Fragment key={index}>{renderFormattedContent(child)}</React.Fragment>
          ))}
        </React.Fragment>
      );
    }

    return null;
  };

  try {
    const parsedContent: LexicalContent = JSON.parse(content);

    if (!isExpanded) {
      // 축소된 상태에서는 텍스트만 표시
      const plainText = extractPlainText(parsedContent.root);
      return <Text style={styles.content}>{plainText}</Text>;
    }

    // 확장된 상태에서는 포맷팅된 전체 내용 표시
    return <View>{renderFormattedContent(parsedContent.root)}</View>;
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
