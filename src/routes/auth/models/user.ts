export interface User {
  name: string; // Nombre, no puede ser nulo
  lastName: string; // Apellido, no puede ser nulo
  phone: string; // Teléfono, no puede ser nulo
  email: string; // Correo electrónico, único y no puede ser nulo
  password: string;
}
