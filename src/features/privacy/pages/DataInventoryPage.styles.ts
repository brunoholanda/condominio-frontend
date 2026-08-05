import styled from 'styled-components';

export const Doc = styled.article`
  max-width: 720px;
  margin: 0 auto;
  padding: 8px 0 48px;
`;

export const DocHeader = styled.header`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const DocTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

export const DocMeta = styled.p`
  margin: 4px 0 0;
  opacity: 0.75;
  font-size: 0.875rem;
`;

export const Section = styled.section`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 600;
`;

export const SectionText = styled.p`
  margin: 0;
  line-height: 1.55;
`;
