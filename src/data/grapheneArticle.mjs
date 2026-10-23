export const grapheneArticle = {
  title: 'What is graphene, and why does it matter?',
  description: 'Explore graphene in interactive 3D: separate graphite layers, inspect the carbon lattice, and discover why this atom-thin material matters.',
  intro: 'A sheet of carbon, just one atom thick. A familiar material, seen in an entirely different dimension.',
  sections: [
    { id: 'what-is-graphene', number: '01', title: 'From a pencil to a single layer.', paragraphs: [
      'The graphite in a pencil contains stacks of carbon sheets. Graphene is one of those sheets on its own: carbon atoms connected in a repeating honeycomb pattern. Think of graphite as a book and graphene as a single page.',
      '“Two-dimensional” does not mean imaginary or completely without thickness. It means the material is only one atomic layer thick, while extending across the other two directions. Separating that layer changes how electrons and vibrations behave.',
      'In 2004, Andre Geim and Konstantin Novoselov isolated graphene using adhesive tape to peel graphite into thinner flakes. Their experiments earned the 2010 Nobel Prize in Physics.'
    ], source: 0 },
    { id: 'why-it-matters', number: '02', title: 'Small structure. Remarkable possibilities.', paragraphs: [
      'Strong bonds within the carbon sheet give graphene exceptional resistance to stretching. A thin sheet can still bend: strength and flexibility describe different kinds of deformation.',
      'Graphene also carries electrical charge efficiently. Its electronic structure is unusual, and its surroundings can change its electrical behaviour. That sensitivity is useful for exploring sensors, but also makes the supporting surface and material quality important.',
      'The opportunity is to use these properties in a device or material that solves a specific problem. A striking laboratory measurement is the beginning of that work.'
    ], source: 1 },
    { id: 'making-it-useful', number: '03', title: 'Making a sheet is only the beginning.', paragraphs: [
      'There is more than one way to make graphene. Researchers can separate layers from graphite, grow films on suitable surfaces, or use chemical processing. Each route produces material with different characteristics.',
      'A large, continuous sheet for an electronic device and small flakes mixed into another material serve different purposes. Layer count, flake size, defects and surface chemistry all help determine which material fits the job.',
      'This is why “contains graphene” is not a performance guarantee. The material must be produced consistently, integrated into a product, and tested under the conditions where it will actually be used.'
    ], source: 2 }
  ],
  applications: [
    { title: 'Electronics & sensors', text: 'Charge moves readily through graphene, and its electrical response can reveal changes in its environment. Researchers study both behaviours in small electronic devices.', source: 1 },
    { title: 'Composites & energy', text: 'Researchers explore graphene in composite materials and energy-storage systems. Performance depends on how the material is made and integrated, not simply on adding it.', source: 0 },
    { title: 'A platform for discovery', text: 'An atom-thin sheet gives researchers a way to investigate electronic behaviour at very small scales, including how neighbouring layers and surfaces affect it.', source: 1 }
  ],
  sources: [
    { label: 'University of Manchester — graphene, properties and discovery', url: 'https://www.graphene.manchester.ac.uk/about/history/index.htm' },
    { label: 'NIST — graphene and its electronic properties', url: 'https://www.nist.gov/programs-projects/graphene' },
    { label: 'Soldano, Mahmood & Dujardin — Production, properties and potential of graphene', url: 'https://arxiv.org/abs/1002.0370' }
  ]
};
