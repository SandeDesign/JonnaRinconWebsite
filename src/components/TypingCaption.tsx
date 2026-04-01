import { ReactNode, useState, useEffect, Children, isValidElement } from 'react';

interface TypingCaptionProps {
  content: ReactNode;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

// Extract text content from ReactNode
function extractTextContent(content: ReactNode): string {
  if (typeof content === 'string') return content;
  if (typeof content === 'number') return content.toString();
  if (!content) return '';

  if (Array.isArray(content)) {
    return content.map(extractTextContent).join('');
  }

  if (isValidElement(content)) {
    return extractTextContent(content.props.children);
  }

  return '';
}

// Clone ReactNode but only render up to charLimit characters
function truncateReactNode(content: ReactNode, charLimit: number): { node: ReactNode; isComplete: boolean } {
  let charCount = 0;
  let isComplete = false;

  function processNode(node: ReactNode): ReactNode {
    if (charCount >= charLimit) return null;

    if (typeof node === 'string') {
      const remaining = charLimit - charCount;
      if (node.length <= remaining) {
        charCount += node.length;
        return node;
      } else {
        charCount = charLimit;
        isComplete = false;
        return node.slice(0, remaining);
      }
    }

    if (typeof node === 'number') {
      const str = node.toString();
      const remaining = charLimit - charCount;
      if (str.length <= remaining) {
        charCount += str.length;
        return node;
      } else {
        charCount = charLimit;
        return str.slice(0, remaining);
      }
    }

    if (!node) return null;

    if (Array.isArray(node)) {
      const processed = node.map(processNode).filter(Boolean);
      return processed.length > 0 ? processed : null;
    }

    if (isValidElement(node)) {
      const processedChildren = processNode(node.props.children);
      if (!processedChildren) return null;
      return isValidElement(processedChildren) || typeof processedChildren === 'string' || Array.isArray(processedChildren)
        ? { ...node, props: { ...node.props, children: processedChildren } }
        : null;
    }

    return null;
  }

  const processedNode = processNode(content);
  const totalChars = extractTextContent(content).length;
  isComplete = charCount >= totalChars;

  return { node: processedNode, isComplete };
}

export default function TypingCaption({
  content,
  speed = 30,
  onComplete,
  className = '',
}: TypingCaptionProps) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalChars = extractTextContent(content).length;

  useEffect(() => {
    if (isComplete) return;

    const timer = setTimeout(() => {
      setDisplayedChars((prev) => {
        const next = prev + 1;
        if (next >= totalChars) {
          setIsComplete(true);
          onComplete?.();
          return totalChars;
        }
        return next;
      });
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedChars, totalChars, isComplete, speed, onComplete]);

  const { node: truncatedContent } = truncateReactNode(content, displayedChars);

  return (
    <div className={className}>
      {truncatedContent}
      {!isComplete && <span className="animate-pulse">|</span>}
    </div>
  );
}
