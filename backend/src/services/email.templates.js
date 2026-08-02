function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wrapHtml(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="fr">
  <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
    <h1 style="color: #2f5d50;">${escapeHtml(title)}</h1>
    ${bodyHtml}
    <p style="margin-top: 2rem; font-size: 0.9rem; color: #666;">
      Vite &amp; Gourmand
    </p>
  </body>
</html>`;
}

function formatMontant(value) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "0.00";
  }

  return amount.toFixed(2);
}

function contactNotification({ nom, email, message }) {
  const subject = `Nouveau message de contact — ${nom}`;
  const text = [
    "Nouveau message reçu via le formulaire de contact.",
    "",
    `Nom : ${nom}`,
    `Email : ${email}`,
    "",
    "Message :",
    message,
  ].join("\n");

  const html = wrapHtml(
    "Nouveau message de contact",
    `
      <p><strong>Nom :</strong> ${escapeHtml(nom)}</p>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>
      <p><strong>Message :</strong></p>
      <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
    `,
  );

  return { subject, text, html };
}

function contactAcknowledgement({ nom }) {
  const subject = "Nous avons bien reçu votre message";
  const text = [
    `Bonjour ${nom},`,
    "",
    "Nous avons bien reçu votre message.",
    "Notre équipe vous répondra dans les meilleurs délais.",
    "",
    "À bientôt,",
    "L'équipe Vite & Gourmand",
  ].join("\n");

  const html = wrapHtml(
    "Message reçu",
    `
      <p>Bonjour ${escapeHtml(nom)},</p>
      <p>Nous avons bien reçu votre message.</p>
      <p>Notre équipe vous répondra dans les meilleurs délais.</p>
    `,
  );

  return { subject, text, html };
}

function welcome({ prenom, nom }) {
  const subject = "Bienvenue chez Vite & Gourmand";
  const text = [
    `Bonjour ${prenom} ${nom},`,
    "",
    "Votre compte client a bien été créé.",
    "Vous pouvez dès à présent vous connecter et commander nos menus.",
    "",
    "À bientôt,",
    "L'équipe Vite & Gourmand",
  ].join("\n");

  const html = wrapHtml(
    "Bienvenue",
    `
      <p>Bonjour ${escapeHtml(prenom)} ${escapeHtml(nom)},</p>
      <p>Votre compte client a bien été créé.</p>
      <p>Vous pouvez dès à présent vous connecter et commander nos menus.</p>
    `,
  );

  return { subject, text, html };
}

function orderConfirmation({ prenom, commande }) {
  const numero = commande.numero_commande;
  const subject = `Confirmation de commande ${numero}`;
  const total =
    Number(commande.prix_menu || 0) + Number(commande.prix_livraison || 0);

  const text = [
    `Bonjour ${prenom},`,
    "",
    `Votre commande ${numero} a bien été enregistrée.`,
    `Statut : ${commande.statut}`,
    `Date de prestation : ${commande.date_prestation}`,
    `Nombre de personnes : ${commande.nombre_personne}`,
    `Prix menu : ${formatMontant(commande.prix_menu)} €`,
    `Livraison : ${formatMontant(commande.prix_livraison)} €`,
    `Total : ${formatMontant(total)} €`,
    "",
    "Merci pour votre confiance,",
    "L'équipe Vite & Gourmand",
  ].join("\n");

  const html = wrapHtml(
    "Confirmation de commande",
    `
      <p>Bonjour ${escapeHtml(prenom)},</p>
      <p>Votre commande <strong>${escapeHtml(numero)}</strong> a bien été enregistrée.</p>
      <ul>
        <li>Statut : ${escapeHtml(commande.statut)}</li>
        <li>Date de prestation : ${escapeHtml(commande.date_prestation)}</li>
        <li>Nombre de personnes : ${escapeHtml(commande.nombre_personne)}</li>
        <li>Prix menu : ${escapeHtml(formatMontant(commande.prix_menu))} €</li>
        <li>Livraison : ${escapeHtml(formatMontant(commande.prix_livraison))} €</li>
        <li>Total : ${escapeHtml(formatMontant(total))} €</li>
      </ul>
    `,
  );

  return { subject, text, html };
}

function orderCancellation({ prenom, commande }) {
  const numero = commande.numero_commande;
  const subject = `Annulation de la commande ${numero}`;
  const text = [
    `Bonjour ${prenom},`,
    "",
    `Votre commande ${numero} a été annulée.`,
    `Statut : ${commande.statut || "Annulée"}`,
    "",
    "Si vous n'êtes pas à l'origine de cette annulation, contactez-nous.",
    "",
    "L'équipe Vite & Gourmand",
  ].join("\n");

  const html = wrapHtml(
    "Commande annulée",
    `
      <p>Bonjour ${escapeHtml(prenom)},</p>
      <p>Votre commande <strong>${escapeHtml(numero)}</strong> a été annulée.</p>
      <p>Statut : ${escapeHtml(commande.statut || "Annulée")}</p>
      <p>Si vous n'êtes pas à l'origine de cette annulation, contactez-nous.</p>
    `,
  );

  return { subject, text, html };
}

module.exports = {
  contactNotification,
  contactAcknowledgement,
  welcome,
  orderConfirmation,
  orderCancellation,
};
