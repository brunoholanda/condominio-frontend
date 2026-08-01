import { Alert } from 'antd';
import styled from 'styled-components';

export const Notice = styled(Alert)`
  margin-bottom: ${({ theme }) => theme.spacing(5)};
`;
