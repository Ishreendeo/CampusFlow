import { memo } from 'react';

// Keeps the original supplied page markup intact while each page is mounted by React.
export const LegacySection = memo(function LegacySection({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
});
