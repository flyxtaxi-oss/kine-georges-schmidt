import { practitioner } from "@/config/practitioner";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/"
          className="text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors no-underline mb-8 block"
        >
          ← Retour au site
        </Link>

        <h1
          className="text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Politique de confidentialité
        </h1>

        <div className="prose prose-gray max-w-none space-y-8 text-[var(--color-text-light)] text-[0.9375rem] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              Responsable du traitement
            </h2>
            <p>
              {practitioner.legal.gdprControllerName}
              <br />
              {practitioner.legal.gdprControllerAddress}
              <br />
              Téléphone : {practitioner.phone.mobile}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              Données collectées
            </h2>
            <p>Dans le cadre du portail de prise de rendez-vous en ligne, nous collectons :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Créneau horaire sélectionné</li>
              <li>Motif de consultation (optionnel)</li>
            </ul>
            <p>
              <strong>Aucune donnée médicale</strong> n&apos;est stockée via le portail en ligne.
              Les notes cliniques sont conservées exclusivement dans le dossier patient au cabinet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              Base légale
            </h2>
            <p>
              Le traitement des données est basé sur votre consentement (art. 6.1.a RGPD)
              et sur l&apos;exécution d&apos;un contrat de soins (art. 6.1.b RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              Durée de conservation
            </h2>
            <p>
              Les données de rendez-vous sont conservées pendant la durée nécessaire à
              la gestion de la relation patient et supprimées au plus tard 2 ans après
              le dernier rendez-vous, sauf obligation légale de conservation plus longue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              Vos droits
            </h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement, de limitation du traitement et de portabilité de vos données.
              Vous pouvez exercer ces droits en contactant le responsable du traitement
              aux coordonnées ci-dessus.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              Hébergement et sous-traitants
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Hébergement : Vercel Inc. (États-Unis, clauses contractuelles types)</li>
              <li>Base de données : Google Firebase / Firestore (région europe-west)</li>
              <li>Authentification : Google Firebase Authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              Contact
            </h2>
            <p>
              Pour toute question relative à la protection de vos données, contactez :
              <br />
              {practitioner.legal.gdprControllerName} — {practitioner.phone.mobile}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
