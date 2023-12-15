export const ContactInfo = ({ label, phone }) => (
  <h1>
    {label}: <a href={`tel:${phone}`}>{phone}</a>
  </h1>
);
