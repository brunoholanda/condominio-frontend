import { Button, Form } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';

import * as S from './RepeatableFields.styles';

interface RepeatableFieldsProps {
  /** Name of the array field inside the form. */
  name: string;
  addLabel: string;
  emptyDescription: string;
  itemLabel: string;
  maxItems?: number;
  /** Receives the index of the row so the caller can build `[index, 'field']` names. */
  children: (index: number) => ReactNode;
}

const DEFAULT_MAX_ITEMS = 20;

/**
 * Renders the repeating blocks of the form (household members, employees,
 * vehicles and pets) on top of `Form.List`, keeping every section consistent.
 */
export function RepeatableFields({
  name,
  addLabel,
  emptyDescription,
  itemLabel,
  maxItems = DEFAULT_MAX_ITEMS,
  children,
}: RepeatableFieldsProps) {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <S.Wrapper>
          {fields.length === 0 ? <S.Empty>{emptyDescription}</S.Empty> : null}

          {fields.map((field, position) => (
            <S.Item key={field.key}>
              <S.ItemHeader>
                <S.ItemTitle>{`${itemLabel} ${position + 1}`}</S.ItemTitle>
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<Trash2 size={15} />}
                  onClick={() => remove(field.name)}
                  aria-label={`Remover ${itemLabel.toLowerCase()} ${position + 1}`}
                >
                  Remover
                </Button>
              </S.ItemHeader>

              {children(field.name)}
            </S.Item>
          ))}

          <Button
            type="dashed"
            block
            icon={<Plus size={16} />}
            onClick={() => add()}
            disabled={fields.length >= maxItems}
          >
            {addLabel}
          </Button>
        </S.Wrapper>
      )}
    </Form.List>
  );
}
