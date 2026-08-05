import { Navigate, useParams } from 'react-router-dom';

/** Legado: `/c/:slug/ponto` redireciona para o portal unificado. */
export function TimeClockPage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/c/${slug}/portal`} replace />;
}
