// src/mocks/data.js

export let users = [
  {
    id: "1",
    email: "admin@demo.com",
    password: "admin123",
    name: "Admin",
    role: "admin",
  },
  {
    id: "2",
    email: "user@demo.com",
    password: "user123",
    name: "User",
    role: "user",
  },
];

export let studies = [
  {
    id: "1",
    userId: "2",
    nombre: "Engineering",
    inicio: 2015,
    fin: 2020,
    institucion: "MIT",
  },
];

export let addresses = [
  {
    id: "1",
    userId: "2",
    calle: "Main St",
    numero: "123",
    ciudad: "Springfield",
    pais: "USA",
    codigoPostal: "12345",
  },
];

// Helpers para generar IDs únicos
let userIdCounter = 3;
let studyIdCounter = 2;
let addressIdCounter = 2;

export function createUser(user) {
  const newUser = { id: String(userIdCounter++), ...user };
  users.push(newUser);
  return newUser;
}

export function createAddress(address) {
  const newAddress = { id: String(addressIdCounter++), ...address };
  addresses.push(newAddress);
  return newAddress;
}

export function createStudy(study) {
  const newStudy = { id: String(studyIdCounter++), ...study };
  studies.push(newStudy);
  return newStudy;
}
