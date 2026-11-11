import ben from '@/assets/figma/pets/ben.jpg';
import ben2 from '@/assets/figma/pets/ben-2.jpg';
import max from '@/assets/figma/pets/max.jpg';
import luna from '@/assets/figma/pets/luna.jpg';
import coco from '@/assets/figma/pets/coco.jpg';
import pip from '@/assets/figma/pets/pip.jpg';
import eva from '@/assets/figma/pets/eva.jpg';
import bruno from '@/assets/figma/pets/bruno.jpg';
import shadow from '@/assets/figma/pets/shadow.jpg';
import shelterAvatar from '@/assets/figma/shell/avatar.png';

/* Mock adoption listings (copy from Figma: 04 · Adopt, 07 · Pet details). */

const PAWS_RESCUE = {
  name: 'Paws Rescue',
  avatar: shelterAvatar,
  meta: '42 adoptions · replies in ~1 hr',
  verified: true,
};

const BEN_DETAILS = {
  gender: 'Male',
  size: 'Large',
  weight: '28 kg',
  city: 'Hyderabad',
  tagline: 'Gentle, playful and great with kids.',
  about:
    'Ben is a sunny, easy-going retriever who needs a new home after his family moved abroad. He’s house-trained, knows sit, stay and paw, and will happily play fetch until you give up first.',
  personality: ['Playful', 'Gentle with kids', 'Good with dogs', 'House-trained', 'Loves water', 'Calm indoors'],
  health: ['Vaccinated', 'Dewormed', 'Neutered', 'Microchipped'],
  lookingFor: ['Home with a yard', 'Active family', 'Daily walks', 'Kids welcome'],
  fee: 'INR 2,500',
  feeNote: 'Includes vaccines, microchip and a starter kit.',
  shelter: PAWS_RESCUE,
};

export const PETS = [
  { id: 'ben', name: 'Ben', age: '2 yrs', breed: 'Golden Retriever', distance: '3 km', type: 'dog', verified: true, photo: ben, gallery: [ben, ben2, max, ben], ...BEN_DETAILS },
  { id: 'max', name: 'Max', age: '3 yrs', breed: 'Golden Retriever', distance: '4 km', type: 'dog', photo: max },
  { id: 'luna', name: 'Luna', age: '1 yr', breed: 'Tabby cat', distance: '2 km', type: 'cat', verified: true, photo: luna },
  { id: 'coco', name: 'Coco', age: '5 mo', breed: 'Mixed breed', distance: '6 km', type: 'dog', young: true, photo: coco },
  { id: 'pip', name: 'Pip', age: '1 yr', breed: 'Yorkie', distance: '5 km', type: 'dog', verified: true, photo: pip },
  { id: 'eva', name: 'Eva', age: '2 yrs', breed: 'Shih Tzu', distance: '5 km', type: 'dog', photo: eva },
  { id: 'bruno', name: 'Bruno', age: '3 yrs', breed: 'Border Collie', distance: '6 km', type: 'dog', verified: true, photo: bruno },
  { id: 'shadow', name: 'Shadow', age: '2 yrs', breed: 'Black cat', distance: '8 km', type: 'cat', photo: shadow },
];

/* Listings without full copy in the design reuse Ben's detail layout with their own basics. */
export function getPet(id) {
  const pet = PETS.find((p) => p.id === id);
  if (!pet) return null;
  return {
    ...BEN_DETAILS,
    gallery: [pet.photo, pet.photo, pet.photo, pet.photo],
    about: `${pet.name} is a lovable ${pet.breed.toLowerCase()} looking for a forever home.`,
    ...pet,
  };
}
