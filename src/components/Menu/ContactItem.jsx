import React from "react";
import { useSelector } from "react-redux";
import styles from "./Menu.module.css";
import WordReveal from "./WordReveal";

const categoryLabels = {
  Emails: "EMAIL",
  "Phone Numbers": "PHONE",
  "Social Media": "ELSEWHERE",
  "Research Gate": "RESEARCH",
};

const contactHref = (item) => {
  const value = (item.link || item.info || "").trim();
  if (item.category === "Phone Numbers") return `tel:${value.replace(/^tel:/i, "").replace(/\s/g, "")}`;
  if (item.category === "Emails") return `mailto:${value.replace(/^mailto:/i, "")}`;
  return /^(https?:\/\/)/i.test(value) ? value : `https://${value}`;
};

const ContactItem = () => {
  const { contactData } = useSelector((state) => state.data);
  const items = contactData?.list || [];
  const preferredOrder = ["Emails", "Phone Numbers", "Research Gate", "Social Media"];
  const categories = [...new Set(items.map(item => item.category))].sort((a, b) => {
    const indexA = preferredOrder.indexOf(a);
    const indexB = preferredOrder.indexOf(b);
    return (indexA < 0 ? 99 : indexA) - (indexB < 0 ? 99 : indexB);
  });

  return (
    <section className={styles.contacts} aria-labelledby="menu-contact-title">
      <p className={styles.eyebrow}>LET’S TALK</p>
      <h3 id="menu-contact-title"><WordReveal text="What are you" delay={540} /><br /> <WordReveal text="working on?" delay={670} /></h3>
      <div className={styles.contactGroups}>
        {categories.map((category, index) => (
          <div className={styles.contactGroup} key={category} style={{ "--item-delay": `${240 + index * 65}ms` }}>
            <h4>{categoryLabels[category] || category}</h4>
            {items.filter(item => item.category === category).map((item, itemIndex) => {
              const href = contactHref(item);
              const external = /^https?:/i.test(href);
              return (
                <a key={item.id || `${category}-${itemIndex}`} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                  {item.info}
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactItem;
