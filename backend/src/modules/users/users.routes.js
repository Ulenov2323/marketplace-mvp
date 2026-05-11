import { Router } from "express";
import { HttpError } from "../../shared/http-error.js";
import { store } from "../../shared/in-memory-store.js";

export const usersRouter = Router();

usersRouter.get("/", (_req, res) => {
  res.json({ data: store.users });
});

usersRouter.get("/:id", (req, res) => {
  const user = store.users.find((item) => item.id === req.params.id);
  if (!user) throw new HttpError(404, "User not found");
  const services = store.services.filter((service) => service.ownerId === user.id);
  res.json({ data: { ...user, services } });
});
