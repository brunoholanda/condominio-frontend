import { Button } from 'antd';
import { Check, Eraser, RotateCcwSquare, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { queries } from '@/styles/theme';
import { SignatureCanvas } from './SignatureCanvas';
import * as S from './SignaturePad.styles';

interface SignatureFullscreenProps {
  /** Signature already saved in the form, offered for touching up. */
  value?: string;
  onConfirm: (value?: string) => void;
  onClose: () => void;
}

/**
 * Signing surface that takes over the screen, for when the inline board is too
 * small — a finger on a phone being the reason it exists. The drawing is only
 * handed to the form when confirmed, so leaving keeps the previous signature.
 */
export function SignatureFullscreen({ value, onConfirm, onClose }: SignatureFullscreenProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(value);
  const isPortraitPhone = useMediaQuery(queries.portraitPhone);

  // `showModal` puts the sheet in the browser top layer, which gives the focus
  // trap and the Escape handling for free; only the page scroll is left to us.
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;

    dialog?.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <S.Overlay ref={dialogRef} aria-label="Assinatura em tela cheia" onCancel={onClose}>
      <S.SheetHeader>
        <S.SheetTitle>Assine no espaço abaixo</S.SheetTitle>
        <S.Hint>
          {isPortraitPhone ? (
            <>
              <RotateCcwSquare size={13} aria-hidden /> Vire o aparelho para ter ainda mais espaço.
            </>
          ) : (
            'Ao concluir, a assinatura volta para o formulário.'
          )}
        </S.Hint>
      </S.SheetHeader>

      <SignatureCanvas fill value={draft} onChange={setDraft} />

      {/* Large buttons: this sheet exists to be used with a finger. */}
      <S.SheetActions>
        <Button
          size="large"
          icon={<Eraser size={16} />}
          disabled={!draft}
          onClick={() => setDraft(undefined)}
        >
          Refazer
        </Button>
        <Button size="large" icon={<X size={16} />} onClick={onClose}>
          Cancelar
        </Button>
        <Button
          size="large"
          type="primary"
          icon={<Check size={16} />}
          disabled={!draft}
          onClick={() => onConfirm(draft)}
        >
          Concluir
        </Button>
      </S.SheetActions>
    </S.Overlay>
  );
}
