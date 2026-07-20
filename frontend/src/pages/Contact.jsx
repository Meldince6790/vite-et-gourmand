import "../styles/pages.css";

function Contact() {
  return (
    <div>
      <section className="section">
        <h1>Contact</h1>

        <p>Une question ou un projet ? Contactez notre équipe.</p>

        <form className="form">
          <label htmlFor="name">Nom</label>

          <input id="name" type="text" name="name" />

          <label htmlFor="email">Email</label>

          <input id="email" type="email" name="email" />

          <label htmlFor="message">Message</label>

          <textarea id="message" name="message" />

          <button type="submit">Envoyer</button>
        </form>
      </section>
    </div>
  );
}

export default Contact;
