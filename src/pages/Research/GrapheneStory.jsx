import React, { useEffect, useState } from "react";
import styles from "./GrapheneStory.module.css";
import { FaChevronDown } from "react-icons/fa";

const GrapheneStory = ({ endAnimation }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (endAnimation) {
            // Delay allowing scroll/visibility until 3D animation settles
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [endAnimation]);

    const sections = [
        {
            id: 1,
            title: "The Wonder Material",
            text: "Graphene is a single layer of carbon atoms arranged in a two-dimensional honeycomb lattice. It is the basic structural element of many other allotropes of carbon, such as graphite, charcoal, carbon nanotubes and fullerenes. Despite being just one atom thick, it is incredibly strong and conductive.",
            image: "/story/structure.png",
            alt: "Atomic structure of Graphene",
        },
        {
            id: 2,
            title: "Stronger than Steel",
            text: "Graphene is the strongest material ever tested, about 200 times stronger than steel. To put this into perspective: a sheet of graphene as thin as cling film would be strong enough to support the weight of an elephant standing on a pencil point. Its tensile strength is truly revolutionary.",
            image: "/story/strength.png",
            alt: "Visual representation of Graphene strength",
        },
        {
            id: 3,
            title: "The Future of Electronics",
            text: "Because of its high electron mobility, Graphene is a promising material for future electronics. It could replace silicon in transistors, enabling faster and more efficient computers. It is also flexible and transparent, paving the way for bendable smartphones and advanced wearable technology.",
            image: "/story/electronics.png",
            alt: "Futuristic electronics with Graphene",
        },
    ];

    return (
        <div
            className={`${styles.container} ${isVisible ? styles.visible : styles.hidden
                }`}
        >
            <div className={styles.scrollIndicator}>
                <FaChevronDown color="#fff" size={30} />
            </div>

            {sections.map((section) => (
                <div key={section.id} className={styles.section}>
                    <div className={styles.imageContainer}>
                        <img src={section.image} alt={section.alt} className={styles.image} />
                    </div>
                    <div className={styles.content}>
                        <h2 className={styles.title}>{section.title}</h2>
                        <p className={styles.text}>{section.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GrapheneStory;
