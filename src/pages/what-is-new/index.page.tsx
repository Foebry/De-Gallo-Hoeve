import { nanoid } from 'nanoid';
import React from 'react';
import { Body, Title2, Title3, Title4 } from 'src/components/Typography/Typography';
import Skeleton from 'src/components/website/skeleton';
import { FrontEndErrorCodes } from 'src/shared/functions';

type Props = {};

const ChangeLog: React.FC<Props> = () => {
  return (
    <Skeleton>
      <Title2 className="text-green-200">Wat is nieuw?</Title2>
      <div className="text-center max-w-7xl mx-auto mb-20">
        <Body>
          Deze pagina geeft weer wat er nieuw is en wat getest zal moeten worden:
        </Body>
        <Title3 className="text-green-200">Hier de nieuwigheden op een rijtje:</Title3>
        <div>
          <Title4 className="text-green-200">1. Error-pagina&apos;s</Title4>
          <Body className="text-center max-w-xl mx-auto">
            Er zijn nu error-pagina&apos;s. Deze worden getoond wanner er een error
            voorvalt in de website, of wanneer er naar een foutieve pagina gesurft wordt.
          </Body>
          <Title4 className="text-green-200 mt-10">2. Updated contact-email</Title4>
          <Body className="text-center max-x-xl mx-auto">
            De contact-email is geüpdated zodat deze nu in hetzelfde formaat is als de
            andere emails. <br />
            Het opgegeven email-adress wordt nu ook mee getoond in de email. <br />
            Klanten krijgen nu zelf ook een email ter bevestiging van wat zij gestuurd
            hebben in de contact-formulier.
          </Body>
          <Title4 className="text-green-200 mt-10">3. Feedback van klanten</Title4>
          <Body>
            Klanten kunnen nu feeback achterlaten, dit gebeurt via een email die verstuurd
            zal worden. <br />
            Deze emails worden verstuurd naar klanten wanneer zijn 2, 5, 10, 20, 50, 100
            prive-trainingen gedaan hebben.
          </Body>
        </div>
      </div>
      <div className="text-center max-w-7xl mx-auto mb-20">
        <Title3 className="text-green-200">Wat moet getest worden?</Title3>
        <div>
          <Title4 className="text-green-200">1. De error-pagina&apos;s</Title4>
          <div>
            <Body>
              Volgende pagina&apos;s moeten bezocht worden en beoordeeld worden of deze OK
              zijn:
            </Body>
            <Body>
              <a
                href="/error"
                target="_blank"
                className="text-green-200 underline cursor-pointer"
              >
                algemene error-pagina
              </a>
            </Body>
            <Body>
              <a
                href={`/error?${FrontEndErrorCodes.KlantNotFound}`}
                target="_blank"
                className="text-green-200 underline cursor-pointer"
              >
                foutieve bevesitingslink geklikt
              </a>
            </Body>
            <Body>
              <a
                href={`/error?${FrontEndErrorCodes.ExpiredConfirmCode}`}
                target="_blank"
                className="text-green-200 underline cursor-pointer"
              >
                Bevestigings-link is vervallen
              </a>
            </Body>
          </div>
          <Title4 className="text-green-200 mt-10">2. De contact-email</Title4>
          <div>
            <Body>
              Gebruik het contact-formulie. Ga na of zowel de klant als jij een email
              ontvangt. <br />
              Beide emails moeten verschillend zijn. De email naar jou moet dezelfde zijn
              als vroeger, maar dan wat opgefrist + het email-adress dat opgegeven werd
              moet ook in de email staan. <br />
              De email naar de klant, moet een bevestiging zijn van wat hij / zij in het
              contact-formulier geschreven had. <br />
              <p className="font-bold">Ga na of deze emails voldoende zijn</p>
            </Body>
          </div>
          <Title4 className="text-green-200 mt-10">3. Feedback</Title4>
          <div>
            <Body>
              Bezoek het{' '}
              <a
                href="/customer-feedback/a"
                target="_blank"
                className="text-green-200 underline cursor-pointer"
              >
                feedback-formulier
              </a>{' '}
              en ga na of de vragen goed zijn.(versturen van het formulier zal op dit
              moment niet werken) <br /> Zijn er betere vragen om te stellen?
            </Body>
            <Body>
              Wanneer je een klant hebt die minstens 1 trainingen gedaan heeft (gratis
              training niet meegerekend), deze trainingen moeten ook minstens 1 dag
              geleden zijn, ga dan naar het admin-gedeelte naar de klanten en klik op de
              knop{' '}
              <span className="font-bold text-green-200">verzend feedback mails</span>. Nu
              moeten alle klanten die minstens 1 trainingen gedaan hebben een
              feedback-email ontvangen.{' '}
              <span className="font-bold">Ga na of deze email goed is</span>
            </Body>
            <Body>
              Klik op de link in de email, deze leidt naar de feedback-pagina van
              hiervoor, nu kan het formulier wel verstuurd worden. <br />
              Vul het formulier in en verstuur het.
            </Body>
            <Body>
              Ga naar de home-pagina, hier is nu een nieuw gedeelte voor de feedback van
              klanten. <br />
              Ga na of feedback-kaartjes op de website de juiste data bevatten: naam,
              score (gemiddelde van alle scores), ervaring text.
            </Body>
          </div>
        </div>
      </div>
    </Skeleton>
  );
};

export default ChangeLog;
