import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="Página não encontrada"
      subTitle="O endereço acessado não existe."
      extra={
        <Button type="primary" onClick={() => void navigate('/')}>
          Ir para a página inicial
        </Button>
      }
    />
  );
}
