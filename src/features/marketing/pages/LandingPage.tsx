import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { PrivacyNoticeLink } from '@/shared/components/PrivacyNotice/PrivacyNotice';
import { LandingPlanPicker } from '../components/LandingPlanPicker';
import { LandingSkyline } from '../components/LandingSkyline';
import { useLandingSeo } from '../hooks/use-landing-seo';
import {
  findPlan,
  registerPath,
  selectedPlanStore,
  TRIAL_DAYS,
  type PlanId,
} from '../model/plans';
import * as S from './LandingPage.styles';

const BENEFITS = [
  {
    title: 'Moradores e unidades',
    text: 'Formulário público com assinatura, lista de pendentes e exportação em PDF.',
  },
  {
    title: 'Operação na portaria',
    text: 'Encomendas com protocolo de entrega e página do condomínio com QR Code.',
  },
  {
    title: 'Transparência',
    text: 'Contas a pagar com anexos e portal aberto aos moradores quando você quiser.',
  },
] as const;

const STEPS = [
  {
    title: 'Crie a conta',
    text: `Comece o teste de ${TRIAL_DAYS} dias sem cartão. Em minutos você já está dentro.`,
  },
  {
    title: 'Cadastre o prédio',
    text: 'Unidades, moradores e operadores — o essencial para a rotina do condomínio.',
  },
  {
    title: 'Use no dia a dia',
    text: 'Portaria, documentos e portal público no mesmo lugar, sem planilha.',
  },
] as const;

/** Página pública de captação: trial + planos Lite / Prime / Gestor. */
export function LandingPage() {
  useLandingSeo();
  const [selected, setSelected] = useState<PlanId>(
    () => selectedPlanStore.read() ?? 'prime',
  );
  const [scrolled, setScrolled] = useState(false);
  const year = new Date().getFullYear();
  const selectedPlan = findPlan(selected);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const selectPlan = (planId: PlanId) => {
    setSelected(planId);
    selectedPlanStore.save(planId);
  };

  return (
    <S.Shell>
      <a href="#conteudo" className="sr-only">
        Ir para o conteúdo
      </a>

      <S.Topbar $scrolled={scrolled}>
        <S.BrandMark as={Link} to="/">
          <S.BrandDot aria-hidden />
          CondoGest
        </S.BrandMark>
        <S.TopNav aria-label="Navegação">
          <S.NavLink href="#recursos" data-nav="recursos">
            Recursos
          </S.NavLink>
          <S.NavLink href="#planos" data-nav="planos">
            Planos
          </S.NavLink>
          <S.NavLink as={Link} to="/login">
            Entrar
          </S.NavLink>
          <S.NavCta as={Link} to={registerPath(selected)}>
            Teste grátis
          </S.NavCta>
        </S.TopNav>
      </S.Topbar>

      <S.Hero id="conteudo">
        <S.HeroBackdrop />
        <LandingSkyline />
        <S.HeroContent>
          <S.HeroBrand>CondoGest</S.HeroBrand>
          <S.HeroTitle>Gestão do condomínio sem planilha e sem papel.</S.HeroTitle>
          <S.HeroLead>
            Comece com {TRIAL_DAYS} dias grátis. Depois escolha o plano que cabe no seu prédio.
          </S.HeroLead>
          <S.HeroActions>
            <S.PrimaryButton as={Link} to={registerPath(selected)}>
              Começar teste grátis
            </S.PrimaryButton>
            <S.GhostButton href="#planos">Ver planos</S.GhostButton>
          </S.HeroActions>
        </S.HeroContent>
        <S.ScrollHint href="#recursos" aria-label="Ir para recursos">
          <S.ScrollHintLine aria-hidden />
          Explorar
        </S.ScrollHint>
      </S.Hero>

      <S.Section id="recursos" aria-labelledby="benefits-title">
        <S.SectionInner>
          <S.SectionEyebrow>Recursos</S.SectionEyebrow>
          <S.SectionTitle id="benefits-title">
            Tudo que o síndico precisa no dia a dia
          </S.SectionTitle>
          <S.SectionLead>
            Cadastro de moradores, entregas, áreas comuns, documentos e portal público — em um só
            lugar.
          </S.SectionLead>
          <S.BenefitList>
            {BENEFITS.map((item, index) => (
              <S.BenefitItem key={item.title}>
                <S.BenefitIndex aria-hidden>{String(index + 1).padStart(2, '0')}</S.BenefitIndex>
                <div>
                  <S.BenefitTitle>{item.title}</S.BenefitTitle>
                  <S.BenefitText>{item.text}</S.BenefitText>
                </div>
              </S.BenefitItem>
            ))}
          </S.BenefitList>
        </S.SectionInner>
      </S.Section>

      <S.StepsSection aria-labelledby="steps-title">
        <S.SectionInner>
          <S.SectionEyebrow $onDark>Como funciona</S.SectionEyebrow>
          <S.StepsTitle id="steps-title">Do cadastro à rotina, em três passos</S.StepsTitle>
          <S.StepsList>
            {STEPS.map((step, index) => (
              <S.StepItem key={step.title}>
                <S.StepNumber aria-hidden>{index + 1}</S.StepNumber>
                <S.StepTitle>{step.title}</S.StepTitle>
                <S.StepText>{step.text}</S.StepText>
              </S.StepItem>
            ))}
          </S.StepsList>
        </S.SectionInner>
      </S.StepsSection>

      <S.PlansSection id="planos" aria-labelledby="plans-title">
        <S.SectionInner>
          <S.SectionEyebrow>Planos</S.SectionEyebrow>
          <S.SectionTitle id="plans-title">Planos simples, por condomínio</S.SectionTitle>
          <S.SectionLead>
            Teste {TRIAL_DAYS} dias sem cobrança. Escolha o plano e continue quando estiver pronto.
          </S.SectionLead>

          <LandingPlanPicker selected={selected} onSelect={selectPlan} />

          <S.PlanCta>
            <S.PlanCtaHint>
              Selecionado: <strong>{selectedPlan?.name}</strong>
            </S.PlanCtaHint>
            <S.PlanCtaActions>
              <S.PrimaryButton as={Link} to={registerPath(selected)}>
                Testar {selectedPlan?.name} por {TRIAL_DAYS} dias
              </S.PrimaryButton>
              <S.LightGhostButton as={Link} to="/login">
                Já tenho conta
              </S.LightGhostButton>
            </S.PlanCtaActions>
          </S.PlanCta>
        </S.SectionInner>
      </S.PlansSection>

      <S.DarkCta>
        <S.DarkCtaInner>
          <S.DarkCtaTitle>Pronto para organizar o seu condomínio?</S.DarkCtaTitle>
          <S.DarkCtaLead>
            Crie a conta em poucos minutos e use o CondoGest com teste grátis de {TRIAL_DAYS} dias.
          </S.DarkCtaLead>
          <S.PrimaryButton as={Link} to={registerPath(selected)}>
            Criar conta grátis
          </S.PrimaryButton>
        </S.DarkCtaInner>
      </S.DarkCta>

      <S.Footer>
        <S.FooterInner>
          <S.FooterTop>
            <S.FooterBrandCol>
              <S.FooterBrand as={Link} to="/">
                <S.BrandDot aria-hidden />
                CondoGest
              </S.FooterBrand>
              <S.FooterTagline>
                Software de gestão condominial para síndicos e administradoras — operação diária sem
                planilha e sem papel.
              </S.FooterTagline>
            </S.FooterBrandCol>

            <S.FooterCol aria-label="Produto">
              <S.FooterColTitle>Produto</S.FooterColTitle>
              <S.FooterLink href="#recursos">Recursos</S.FooterLink>
              <S.FooterLink href="#planos">Planos</S.FooterLink>
              <S.FooterLink as={Link} to={registerPath(selected)}>
                Teste grátis ({TRIAL_DAYS} dias)
              </S.FooterLink>
            </S.FooterCol>

            <S.FooterCol aria-label="Conta">
              <S.FooterColTitle>Conta</S.FooterColTitle>
              <S.FooterLink as={Link} to="/login">
                Entrar
              </S.FooterLink>
              <S.FooterLink as={Link} to={registerPath(selected)}>
                Criar conta
              </S.FooterLink>
            </S.FooterCol>
          </S.FooterTop>

          <S.FooterBottom>
            <S.FooterLegal>
              © {year} Holanda Dev Software. Todos os direitos reservados.
            </S.FooterLegal>
            <S.FooterMeta>
              <PrivacyNoticeLink />
              <span>Feito no Brasil</span>
            </S.FooterMeta>
          </S.FooterBottom>
        </S.FooterInner>
      </S.Footer>
    </S.Shell>
  );
}
