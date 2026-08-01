import { Button } from 'antd';
import { Eraser, Maximize2 } from 'lucide-react';
import { useState } from 'react';

import { SignatureCanvas } from './SignatureCanvas';
import { SignatureFullscreen } from './SignatureFullscreen';
import * as S from './SignaturePad.styles';

interface SignaturePadProps {
  /** Data URL of the current signature; provided by Ant Design's Form.Item. */
  value?: string;
  onChange?: (value?: string) => void;
  disabled?: boolean;
}

export function SignaturePad({ value, onChange, disabled = false }: SignaturePadProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConfirm = (signature?: string) => {
    onChange?.(signature);
    setIsExpanded(false);
  };

  return (
    <S.Wrapper>
      <SignatureCanvas value={value} onChange={onChange} disabled={disabled} />

      <S.Toolbar>
        <S.Hint>Use o dedo ou o mouse para assinar dentro do quadro.</S.Hint>

        <S.ToolbarActions>
          <Button
            type="text"
            size="small"
            icon={<Maximize2 size={15} />}
            onClick={() => setIsExpanded(true)}
            disabled={disabled}
          >
            Tela cheia
          </Button>
          <Button
            type="text"
            size="small"
            icon={<Eraser size={15} />}
            onClick={() => onChange?.(undefined)}
            disabled={disabled || !value}
          >
            Refazer
          </Button>
        </S.ToolbarActions>
      </S.Toolbar>

      {isExpanded ? (
        <SignatureFullscreen
          value={value}
          onConfirm={handleConfirm}
          onClose={() => setIsExpanded(false)}
        />
      ) : null}
    </S.Wrapper>
  );
}
