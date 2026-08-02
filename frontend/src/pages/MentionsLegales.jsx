import "../styles/pages.css";

function MentionsLegales() {
  return (
    <section className="section legal-page">
      <h1>Mentions légales</h1>

      <p>
        Les présentes mentions légales concernent le site de démonstration
        réalisé dans le cadre d&apos;un ECF pour l&apos;entreprise fictive
        Vite &amp; Gourmand.
      </p>

      <h2>Éditeur du site</h2>
      <p>
        Vite &amp; Gourmand
        <br />
        Traiteur événementiel (entreprise fictive)
        <br />
        12 rue des Saveurs
        <br />
        33000 Bordeaux
        <br />
        France
      </p>
      <p>
        E-mail : contact@vite-gourmand.fr
        <br />
        Téléphone : 05 56 00 00 00
      </p>

      <h2>Directeur de la publication</h2>
      <p>Le représentant légal de Vite &amp; Gourmand.</p>

      <h2>Hébergement</h2>
      <p>
        Application hébergée en environnement de développement local / démonstration
        pédagogique. Les informations d&apos;hébergement production seront
        précisées lors d&apos;un éventuel déploiement.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présentés sur ce site (textes, éléments
        graphiques, structure) est fourni à des fins pédagogiques. Toute
        reproduction non autorisée est interdite hors cadre de formation.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les données collectées via les formulaires (inscription, contact,
        commandes) sont utilisées uniquement pour le fonctionnement de
        l&apos;application de démonstration. Aucune exploitation commerciale
        n&apos;est réalisée.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative au site, vous pouvez utiliser le formulaire
        de contact disponible sur l&apos;application.
      </p>
    </section>
  );
}

export default MentionsLegales;
