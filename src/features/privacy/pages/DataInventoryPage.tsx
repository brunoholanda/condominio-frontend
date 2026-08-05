import { Alert, Button, Result, Skeleton } from 'antd';
import { Printer, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ApiError } from '@/shared/api/api-error';
import { PageHeading } from '@/shared/components/PageHeading/PageHeading';
import { usePlatformDataInventoryQuery } from '../hooks/use-privacy';
import * as S from './DataInventoryPage.styles';

export function DataInventoryPage() {
  const inventoryQuery = usePlatformDataInventoryQuery();

  if (inventoryQuery.isError) {
    const message =
      inventoryQuery.error instanceof ApiError
        ? inventoryQuery.error.message
        : 'Não foi possível carregar o inventário.';

    return (
      <Result
        status="403"
        title="Inventário indisponível"
        subTitle={message}
        extra={
          <Link to="/app/conta">
            <Button type="primary">Voltar à conta</Button>
          </Link>
        }
      />
    );
  }

  const inventory = inventoryQuery.data;

  return (
    <>
      <PageHeading
        title="Inventário de dados pessoais"
        description="Registro das atividades de tratamento da plataforma (LGPD). Documento interno — não é o aviso ao titular."
        actions={
          <Button
            icon={<Printer size={16} />}
            disabled={!inventory}
            onClick={() => window.print()}
          >
            Imprimir / exportar
          </Button>
        }
      />

      {inventoryQuery.isLoading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}

      {inventory ? (
        <S.Doc>
          <S.DocHeader>
            <Shield size={22} aria-hidden />
            <div>
              <S.DocTitle>{inventory.title}</S.DocTitle>
              <S.DocMeta>Versão {inventory.version}</S.DocMeta>
            </div>
          </S.DocHeader>

          <Alert type="info" showIcon message={inventory.intro} style={{ marginBottom: 24 }} />

          {inventory.sections.map((section) => (
            <S.Section key={section.title}>
              <S.SectionTitle>{section.title}</S.SectionTitle>
              <S.SectionText>{section.text}</S.SectionText>
            </S.Section>
          ))}
        </S.Doc>
      ) : null}
    </>
  );
}
