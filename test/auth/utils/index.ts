import { CreateUserDto } from "src/auth/dto/create-user.dto";

export const correctBody: CreateUserDto = {
  name: "testUser",
  email: "testUser@example.com",
  password: "testPassword123",
};
export const wrongBodiesArr: Partial<CreateUserDto>[] = [
  {
    email: "testUser@example.com",
    password: "testPassword123",
  },
  {
    name: "testUser",
    password: "testPassword123",
  },
  {
    name: "testUser",
    email: "testUser@example.com",
  },
  {
    name: "testUser",
    email: "not an email",
    password: "testPassword123",
  },
  {
    name: "testUser",
    email: "testUser@example.com",
    password: "te",
  },
];
