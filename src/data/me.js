import oscar from '@/assets/figma/profile/pet-oscar.png';
import eva from '@/assets/figma/profile/pet-eva.png';
import bruno from '@/assets/figma/profile/pet-bruno.png';
import post1 from '@/assets/figma/profile/post-1.jpg';
import post2 from '@/assets/figma/profile/post-2.jpg';
import post3 from '@/assets/figma/profile/post-3.jpg';
import post4 from '@/assets/figma/profile/post-4.jpg';
import post5 from '@/assets/figma/profile/post-5.jpg';
import post6 from '@/assets/figma/profile/post-6.jpg';

/* The signed-in user's own pets and posts (Figma: 05 · Profile). */
export const MY_PETS = [
  { id: 'oscar', name: 'Oscar', breed: 'Golden Retriever', photo: oscar },
  { id: 'eva', name: 'Eva', breed: 'Shih Tzu', photo: eva },
  { id: 'bruno', name: 'Bruno', breed: 'Border Collie', photo: bruno },
];

export const MY_POSTS = [post1, post2, post3, post4, post5, post6, post1, post2];

export const MY_STATS = [
  ['3', 'Pets'],
  ['32', 'Posts'],
  ['512', 'Followers'],
  ['180', 'Following'],
];

export const MY_BIO =
  'Dog mom to Oscar, Eva & Bruno. Sharing everyday pet-care tips, training wins and slow golden-hour walks.';

/* ---------- My pet profiles (Figma: 08 · My pet’s profile) ---------- */
import mikel from '@/assets/figma/pets/ben-2.jpg';
import ben from '@/assets/figma/pets/ben.jpg';
import max from '@/assets/figma/pets/max.jpg';
import brunoPhoto from '@/assets/figma/pets/bruno.jpg';
import evaPhoto from '@/assets/figma/pets/eva.jpg';
import beach from '@/assets/figma/shell/post-photo.png';

const MOMENTS = [ben, max, brunoPhoto, mikel, beach, evaPhoto, ben, max];

const PET_PROFILES = {
  mikel: {
    name: 'Mikel',
    breed: 'Golden Retriever',
    age: '3 yrs',
    gender: 'Male',
    city: 'Hyderabad',
    birthday: '12 Mar',
    photo: mikel,
    bio: 'Loves the beach, hates baths. Will trade a paw for a carrot. Best friends with Oscar.',
    tags: ['Vaccinated', 'Microchipped', 'Friendly with kids', 'Loves water'],
    stats: [['86', 'Moments'], ['1.2k', 'Likes'], ['24', 'Friends']],
    moments: MOMENTS,
  },
};

export function getMyPet(id) {
  if (PET_PROFILES[id]) return { id, ...PET_PROFILES[id] };
  const basic = MY_PETS.find((p) => p.id === id);
  if (!basic) return null;
  return {
    ...PET_PROFILES.mikel,
    id,
    name: basic.name,
    breed: basic.breed,
    photo: basic.photo,
    bio: `${basic.name} is part of the family. Moments, health records and documents live here.`,
  };
}
