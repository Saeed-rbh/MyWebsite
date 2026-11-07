export const nanofluidsArticle = {
  "title": "Meet Nanofluids.",
  "intro": "Sunlight passes through a shallow layer of clear water, carrying energy out the other side. How could we capture more of that energy as heat? One approach is to suspend tiny, light-absorbing particles in the water. The resulting mixture is a nanofluid.",
  "interfaceImage": {
    "src": "/images/nanofluids/silver-interface.svg",
    "alt": "Schematic section of a silver surface beside representative bent water molecules.",
    "caption": "Schematic section. Each water molecule has one oxygen atom (copper colour) and two hydrogen atoms (ivory). Positions, sizes and spacing are illustrative. Figure 4 below gives the simulated density profile."
  },
  "sections": [
    {
      "id": "suspension",
      "nav": "A particle in water",
      "title": "What makes the liquid a nanofluid?",
      "paragraphs": [
        "A nanofluid has a liquid that flows and tiny solid particles dispersed through it. In our drop, the liquid is water and the solid is silver. A silver particle four nanometres across is only four millionths of a millimetre wide. It still has an inside and a surface.",
        "Researchers have tested this idea in solar collectors using silver, graphite and carbon nanotubes. Our work starts one step closer in. Once a silver particle is warm, how does its energy reach the water touching it?",
        "Water molecules continually move past that surface. The boundary where water and silver meet is called the interface. To understand why a small amount of silver can put so much water near an interface, first change the size of the particles."
      ],
      "link": [
        "Read the solar collector experiment by Otanicar and colleagues",
        "https://eta-publications.lbl.gov/publications/nanofluid-based-direct-absorption"
      ],
      "illustration": {
        "src": "/images/nanofluids/collector-outdoors.webp",
        "alt": "Sunlight enters a shallow, glass-covered collector containing amber liquid.",
        "caption": "At collector scale, the suspension looks like a continuous liquid. Individual nanoparticles are too small to see. AI-generated illustration of the application."
      }
    },
    {
      "id": "surface",
      "nav": "Change the size",
      "title": "Same silver. How much surface?",
      "paragraphs": [
        "Imagine exchanging one sphere for eight smaller ones while keeping every bit of silver. Each new sphere is half as wide. Each has one quarter of the original surface area, so eight together expose twice as much surface to water.",
        "Try the diameter controls. The extra surface is the reason to care about size: it gives more liquid a place to meet the solid, even though the amount of silver stays the same."
      ]
    },
    {
      "id": "dispersion",
      "nav": "Separate or clustered?",
      "title": "What can a vial tell us?",
      "paragraphs": [
        "Leave the drop’s parent sample on the bench. If particles collect at the bottom, a drop taken from the top will contain less solid. Even in a cloudy sample, some grains may be touching. Only the surfaces accessible to water count in our surface-area argument.",
        "A vial can reveal settling. To find out how water packs around a single grain, we need a different view. In our simulations we followed the atoms over time and sorted the water by its distance from the silver."
      ],
      "illustration": {
        "src": "/images/nanofluids/suspension-stability.webp",
        "alt": "Two vials, one cloudy throughout and one with a pale sediment bed beneath clearer water.",
        "caption": "Compare the top and bottom of each vial. An evenly cloudy sample looks dispersed. A clear upper layer above sediment means the particle concentration now depends on where you sample. AI-generated concept illustration."
      },
      "mechanism": {
        "src": "/images/nanofluids/aggregation.webp",
        "alt": "Close-up showing isolated ceramic grains and a cluster of touching grains.",
        "caption": "The pale shapes represent solid grains. The shading suggests their outlines. Look at the contacts inside the cluster. Water can reach the gaps between loosely packed grains, but the surfaces touching one another are shielded. AI-generated concept illustration."
      }
    },
    {
      "id": "silver",
      "nav": "Water beside silver",
      "title": "Count the water, one shell at a time.",
      "paragraphs": [
        "Picture an onion cut through its centre. Around the silver, imagine thin spherical shells like the onion’s layers. These are measuring regions. A water molecule can leave one shell and enter another.",
        "An outer shell takes up more space than an inner shell of the same thickness. To compare them fairly, divide the water mass in each shell by that shell’s volume, then average over time. The result is local density. In our silver simulations, the first peak marks a region where water packs more closely than it does farther away."
      ],
      "figure": {
        "src": "/journal-figures/nanolayer-density-profile.jpg",
        "width": 714,
        "height": 603,
        "title": "Water density changes over the first nanometre",
        "source": "Heyhat, Rajabpour, Abbasi & Arabha · Figure 4 · 2018",
        "alt": "Density oscillates near silver and approaches 1,000 kg/m³ about one nanometre from the surface for all six particle sizes.",
        "reading": "Start at the right, where the six curves sit near 1,000 kg/m³. Now move left toward the silver. Peaks and dips mark distances where water molecules are more or less likely to be found. Each curve represents a different particle diameter, from 4 to 9 nm."
      },
      "link": [
        "Read our silver–water paper",
        "https://doi.org/10.1016/j.molliq.2018.05.122"
      ]
    },
    {
      "id": "mixture",
      "nav": "Mixture properties",
      "title": "Can that thin layer matter to the drop?",
      "paragraphs": [
        "A balance gives the mass of the whole drop. Dividing by the drop’s volume gives its average density. The shell measurement asks the same question about a much smaller region. In our silver study, giving the nearby water its own density improved the estimate for the mixture.",
        "Now imagine two layers of liquid sliding past each other. Viscosity describes how strongly the liquid resists that motion. In the figure, compare models that count just the solid with models that include water near its surface. The filled triangles are the values from our simulations."
      ],
      "link": [
        "Read our silver–water paper",
        "https://doi.org/10.1016/j.molliq.2018.05.122"
      ],
      "figure": {
        "src": "/journal-figures/nanolayer-viscosity.jpg",
        "width": 708,
        "height": 606,
        "title": "A small amount of silver changes viscosity",
        "source": "Heyhat, Rajabpour, Abbasi & Arabha · Figure 10 · 2018",
        "alt": "Relative viscosity rises to about 1.28 at a silver volume fraction of 2.5% in the simulation.",
        "reading": "Find the filled triangle at 2.5% silver by volume. Its height of about 1.28 means the simulated mixture was roughly 28% more viscous than the base liquid under these conditions. Compare it with the open symbols at the same concentration."
      }
    },
    {
      "id": "cooling",
      "nav": "Heat the silver",
      "title": "Give the silver a pulse of heat.",
      "paragraphs": [
        "So far, we counted molecules while the mixture was at uniform temperature. Now imagine warming just the silver and letting it cool. Where would you look for the first sign of that energy in the water?",
        "We used the same idea of concentric shells in a separate study, this time tracking molecular motion to estimate each shell’s temperature. The water closest to the silver warmed by about 5 K before cooling again. Farther shells showed a smaller, later peak. A picosecond on the graph is one trillionth of a second."
      ],
      "link": [
        "Read our silver–water heat-transfer study",
        "https://doi.org/10.1063/1.5084234"
      ],
      "figure": {
        "src": "/journal-figures/nanoparticle-water-shells.jpg",
        "width": 1200,
        "height": 600,
        "title": "Follow the temperature pulse away from silver",
        "source": "Rajabpour and colleagues, including Saeed Arabha · Figure 5 · 2019",
        "alt": "Temperature curves peak lower and later for water shells farther from the centre of a heated silver particle.",
        "reading": "The left panel tracks temperature in shells 0.2 nm thick. The right shows when each shell peaks. Here the radius is measured from the particle centre. The earlier density figure measured distance from its surface."
      },
      "illustration": {
        "src": "/images/nanofluids/heat-enters-water.webp",
        "alt": "Two views of one silver particle. As it cools, a warm region spreads into nearby water.",
        "caption": "Amber marks the warmer region as energy spreads from silver into water. The colours are qualitative. The graph below gives the simulated temperatures. AI-generated illustration."
      }
    },
    {
      "id": "titania",
      "nav": "Change the interaction",
      "title": "How does heat cross a particle’s surface?",
      "paragraphs": [
        "The silver experiment shows where the energy goes. To ask what controls how fast it crosses the interface, we studied titanium dioxide in water. In our model the atoms carry partial electrical charges. We ran the cooling calculation with the electrical forces between the solid and water included, then repeated it with that contribution switched off.",
        "Look at the black and red curves at the same instant. Both particles started hot. The black curve approaches the water temperature much sooner. Interfacial thermal conductance describes how much heat crosses each unit of surface area per second for a given temperature difference. The forces at this surface help explain why the curves separate."
      ],
      "figure": {
        "src": "/journal-figures/tio2-electrostatics.jpg",
        "width": 720,
        "height": 573,
        "title": "One particle, two cooling curves",
        "source": "Roodbari, Abbasi, Arabha, Gharedaghi & Rajabpour · Figure 10 · 2022",
        "alt": "After heating ends at 20 picoseconds, the black titanium dioxide curve falls to the water temperature much sooner than the red curve.",
        "reading": "At 40 picoseconds, the water is near 300 K. The particle with electrical interactions included (black) has nearly reached that temperature. With those interactions switched off (red), it is still around 350 K. The green curve is a separate silver comparison."
      },
      "link": [
        "Read our titanium dioxide–water study",
        "https://arxiv.org/abs/2111.04143"
      ]
    }
  ],
  "conclusion": "Return to the sunlit collector. Absorbing light is one step. Passing that energy from a particle into the liquid is another. Our simulations let us watch the second step unfold. We could locate water near a surface by measuring its density, then follow a pulse of heat by measuring how the temperature changed at different distances.",
  "densityMap": {
    "src": "/images/nanofluids/silver-density-contour.png",
    "width": 951,
    "height": 803,
    "alt": "Published density map of water around a 4 nm silver particle. A narrow red band follows its surface and gives way to blue farther out.",
    "caption": "The white circle is silver. The colours show the density of the surrounding water. Red means more water mass in the same volume. The red band is a density feature, not a temperature reading.",
    "source": "Our silver–water study · Figure 5, 2018",
    "url": "https://doi.org/10.1016/j.molliq.2018.05.122"
  },
  "solarImage": {
    "src": "/images/nanofluids/collecting-sunlight.webp",
    "alt": "A lamp illuminates a liquid cell. An enlarged inset shows light reaching suspended particles.",
    "caption": "In a direct-absorption collector, particles absorb some of the incoming light and transfer energy to the liquid around them. The inset enlarges the particles for visibility. AI-generated illustration."
  }
};
