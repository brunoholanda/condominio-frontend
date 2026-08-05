import { Button, Descriptions, Modal, Skeleton, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { History } from 'lucide-react';
import { useState } from 'react';

import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { mobileOverlayWidth, mobileTableProps } from '@/shared/utils/mobile-ui';
import { queries } from '@/styles/theme';
import {
  useFormerResidentDetailQuery,
  useFormerResidentsQuery,
} from '../../hooks/use-former-residents';
import type { FormerResidentListItem } from '../../model/former-resident.types';
import { FORMER_RESIDENT_REASON_LABELS } from '../../model/former-resident.types';

interface UnitHistoryModalProps {
  condominiumId: string;
  unit: string | null;
  open: boolean;
  onClose: () => void;
}

export function UnitHistoryModal({ condominiumId, unit, open, onClose }: UnitHistoryModalProps) {
  const isMobile = useMediaQuery(queries.downMd);
  const [detailId, setDetailId] = useState<string>();
  const listQuery = useFormerResidentsQuery(condominiumId, unit ?? undefined, open && Boolean(unit));
  const detailQuery = useFormerResidentDetailQuery(
    condominiumId,
    detailId,
    open && Boolean(detailId),
  );

  const columns: ColumnsType<FormerResidentListItem> = [
    {
      title: 'Nome',
      dataIndex: 'fullName',
      ellipsis: true,
    },
    {
      title: 'CPF',
      dataIndex: 'cpfMasked',
      width: 140,
      responsive: ['md'],
    },
    {
      title: 'Motivo',
      dataIndex: 'reason',
      width: 160,
      render: (reason: FormerResidentListItem['reason']) => (
        <Tag color={reason === 'DELETE' ? 'red' : 'gold'}>
          {FORMER_RESIDENT_REASON_LABELS[reason]}
        </Tag>
      ),
    },
    {
      title: 'Arquivado em',
      dataIndex: 'supersededAt',
      width: 150,
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Guardar até',
      dataIndex: 'retainUntil',
      width: 130,
      responsive: ['lg'],
      render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      title: '',
      key: 'actions',
      width: 90,
      align: 'right',
      render: (_value, row) => (
        <Button type="link" size="small" onClick={() => setDetailId(row.id)}>
          Detalhe
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={open}
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <History size={18} /> Histórico da unidade {unit}
          </span>
        }
        onCancel={onClose}
        footer={null}
        width={mobileOverlayWidth(isMobile, 860)}
        destroyOnHidden
      >
        <p style={{ marginTop: 0, color: 'var(--ant-color-text-secondary)' }}>
          Cadastros anteriores desta unidade, guardados por 5 anos após a substituição ou exclusão,
          conforme a LGPD. Depois desse prazo, são eliminados automaticamente.
        </p>

        {listQuery.isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : null}

        {!listQuery.isLoading ? (
          <Table<FormerResidentListItem>
            rowKey="id"
            columns={columns}
            dataSource={listQuery.data ?? []}
            locale={{ emptyText: 'Nenhum cadastro anterior nesta unidade.' }}
            {...mobileTableProps(isMobile)}
            pagination={false}
          />
        ) : null}
      </Modal>

      <Modal
        open={Boolean(detailId)}
        title="Cadastro arquivado"
        onCancel={() => setDetailId(undefined)}
        footer={null}
        width={mobileOverlayWidth(isMobile, 640)}
        destroyOnHidden
      >
        {detailQuery.isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : null}
        {detailQuery.data ? (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Nome">{detailQuery.data.fullName}</Descriptions.Item>
            <Descriptions.Item label="CPF">{detailQuery.data.cpfMasked}</Descriptions.Item>
            <Descriptions.Item label="Unidade">{detailQuery.data.unit}</Descriptions.Item>
            <Descriptions.Item label="E-mail">
              {String(detailQuery.data.payload.email ?? '—')}
            </Descriptions.Item>
            <Descriptions.Item label="Celular">
              {String(detailQuery.data.payload.mobilePhone ?? '—')}
            </Descriptions.Item>
            <Descriptions.Item label="Arquivado em">
              {dayjs(detailQuery.data.supersededAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Guardar até">
              {dayjs(detailQuery.data.retainUntil).format('DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Motivo">
              {FORMER_RESIDENT_REASON_LABELS[detailQuery.data.reason]}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
    </>
  );
}
