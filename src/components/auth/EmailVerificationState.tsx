'use client';

type State =
  | 'loading'
  | 'success'
  | 'expired'
  | 'invalid'
  | 'already';

type Props = {
  state: State;
};

export default function EmailVerificationState({ state }: Props) {
  const phone = '+351 935 573 069';

  function renderContent() {
    switch (state) {
      case 'loading':
        return {
          title: 'Verificando e-mail',
          message: 'Estamos confirmando seu endereço de e-mail. Aguarde um instante.',
        };

      case 'success':
        return {
          title: 'E-mail verificado',
          message: 'Seu e-mail foi confirmado com sucesso. Você já pode acessar a plataforma.',
          action: (
            <a
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Ir para login
            </a>
          ),
        };

      case 'already':
        return {
          title: 'E-mail já verificado',
          message: 'Este e-mail já foi confirmado anteriormente.',
          action: (
            <a
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-6 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Ir para login
            </a>
          ),
        };

      case 'expired':
        return {
          title: 'Link expirado',
          message:
            'Este link de verificação expirou. Solicite um novo link ou entre em contato com o suporte.',
        };

      default:
        return {
          title: 'Link inválido',
          message:
            'O link de verificação é inválido ou já foi utilizado.',
        };
    }
  }

  const content = renderContent();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-center">
        <div className="mb-4 text-3xl">📧</div>

        <h1 className="text-lg font-semibold text-zinc-900">
          {content.title}
        </h1>

        <p className="mt-2 text-sm text-zinc-600">
          {content.message}
        </p>

        {content.action}

        <div className="mt-6 border-t pt-4 text-xs text-zinc-500">
          Problemas com a verificação?
          <br />
          Entre em contato pelo telefone{' '}
          <a
            href="tel:+351935573069"
            className="font-medium text-zinc-900"
          >
            +351 935 573 069
          </a>
        </div>
      </div>
    </div>
  );
}
