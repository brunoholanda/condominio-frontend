const STORAGE_KEY = 'condominio.operator.terms';

/**
 * Guarda o aceite do termo de responsabilidade em `sessionStorage`: vale
 * enquanto a aba estiver aberta e é pedido de novo a cada nova sessão, para que
 * o operador releia os deveres em vez de aceitar uma única vez e esquecer.
 * A chave inclui o usuário, senão a troca de conta herdaria o aceite anterior.
 */
export const operatorTermsStore = {
  isAccepted(userId: string): boolean {
    try {
      return sessionStorage.getItem(`${STORAGE_KEY}.${userId}`) !== null;
    } catch {
      return false;
    }
  },

  accept(userId: string): void {
    try {
      sessionStorage.setItem(`${STORAGE_KEY}.${userId}`, new Date().toISOString());
    } catch {
      // Sem storage o termo volta a aparecer, que é o lado seguro da falha.
    }
  },
};
