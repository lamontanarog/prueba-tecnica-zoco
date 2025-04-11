// src/mocks/handlers.js

import { http, HttpResponse } from "msw";
import {
  users,
  studies,
  addresses,
  createUser,
  createStudy,
  createAddress,
} from "./data";

export const handlers = [
  // LOGIN
  http.post("/api/login", async ({ request }) => {
    const body = await request.json();
    const user = users.find(
      (u) => u.email === body.email && u.password === body.password
    );
    if (!user) {
      return HttpResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const token = btoa(JSON.stringify({ userId: user.id, role: user.role }));
    return HttpResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }),

  // GET USERS (admin)
  http.get("/api/users", ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    if (payload.role !== "admin")
      return new HttpResponse(null, { status: 403 });
    return HttpResponse.json(users);
  }),

  // CREATE USER (admin)
  http.post("/api/users", async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    if (payload.role !== "admin")
      return new HttpResponse(null, { status: 403 });
    const body = await request.json();
    const newUser = createUser(body);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // PUT USER (admin)
  http.put("/api/users/:id", async ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    if (payload.role !== "admin")
      return new HttpResponse(null, { status: 403 });
    const body = await request.json();
    const index = users.findIndex((u) => u.id === String(params.id));
    if (index === -1) return new HttpResponse(null, { status: 404 });
    users[index] = { ...users[index], ...body };
    return HttpResponse.json(users[index]);
  }),

  // DELETE USER (admin)
  http.delete("/api/users/:id", ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    if (payload.role !== "admin")
      return new HttpResponse(null, { status: 403 });
    const index = users.findIndex((u) => u.id === String(params.id));
    if (index === -1) return new HttpResponse(null, { status: 404 });
    users.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // PUT Adress (admin)
  http.put("/api/addresses/:id", async ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    if (payload.role !== "admin")
      return new HttpResponse(null, { status: 403 });
    const body = await request.json();
    const index = addresses.findIndex(
      (a) => a.id === String(params.id) && a.userId === payload.userId
    );
    if (index === -1) return new HttpResponse(null, { status: 404 });
    addresses[index] = { ...addresses[index], ...body };
    return HttpResponse.json(addresses[index]);
  }),

  // DELETE Adress (admin)
  http.delete("/api/addresses/:id", ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    if (payload.role !== "admin")
      return new HttpResponse(null, { status: 403 });
    const index = addresses.findIndex(
      (a) => a.id === String(params.id) && a.userId === payload.userId
    );
    if (index === -1) return new HttpResponse(null, { status: 404 });
    addresses.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/users/:id", ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const userStudies = studies.filter((s) => s.userId === String(params.id));
    console.log(userStudies);
    const userAddresses = addresses.filter(
      (a) => a.userId === String(params.id)
    );
    const userInformation = { studies: userStudies, addresses: userAddresses };
    console.log(userInformation);
    if (!userInformation) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(userInformation);
  }),

  // GET PROFILE (usuario autenticado)
  http.get("/api/profile", ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const user = users.find((u) => u.id === payload.userId);
    return HttpResponse.json(user);
  }),

  http.put("/api/profile", async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const body = await request.json();
    const index = users.findIndex((u) => u.id === payload.userId);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    users[index] = { ...users[index], ...body };
    return HttpResponse.json(users[index]);
  }),

  // GET STUDIES (usuario autenticado)
  http.get("/api/studies", ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const userStudies =
      payload.role === "admin"
        ? studies
        : studies.filter((s) => s.userId === payload.userId);
    return HttpResponse.json(userStudies);
  }),
  // POST STUDY
  http.post("/api/studies", async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const body = await request.json();
    if (payload.role !== "admin"){
      const newStudy = createStudy({ ...body, userId: payload.userId });
      return HttpResponse.json(newStudy, { status: 201 });
    } else {
      const newStudy = createStudy(body);
      return HttpResponse.json(newStudy, { status: 201 });
    }
    
  }),

  http.put("/api/studies/:id", async ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const body = await request.json();
    let index = 0;

    if (payload.role !== "admin"){
      index = studies.findIndex(
        (s) => s.id === String(params.id) && s.userId === payload.userId
      );
    } else {
      index = studies.findIndex((s) => s.id === String(params.id));
    }
    
    if (index === -1) return new HttpResponse(null, { status: 404 });
    studies[index] = { ...studies[index], ...body };
    return HttpResponse.json(studies[index]);
  }),

  http.delete("/api/studies/:id", ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const index = studies.findIndex(
      (s) => s.id === String(params.id) && s.userId === payload.userId
    );
    if (index === -1) return new HttpResponse(null, { status: 404 });
    studies.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // GET ADDRESSES
  http.get("/api/addresses", ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const userAddresses =
      payload.role === "admin"
        ? addresses
        : addresses.filter((a) => a.userId === payload.userId);
    return HttpResponse.json(userAddresses);
  }),

  // POST ADDRESS
  http.post("/api/addresses", async ({ request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const body = await request.json();
    const newAddress = createAddress({ ...body, userId: payload.userId });
    return HttpResponse.json(newAddress, { status: 201 });
  }),

  http.put("/api/addresses/:id", async ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const body = await request.json();
    let index = 0;

    if (payload.role !== "admin") {
      index = addresses.findIndex(
        (a) => a.id === String(params.id) && a.userId === payload.userId
      );
    }else{
      index = addresses.findIndex((a) => a.id === String(params.id));
    }


    if (index === -1) return new HttpResponse(null, { status: 404 });

    addresses[index] = { ...addresses[index], ...body };
    return HttpResponse.json(addresses[index]);
  }),

  http.delete("/api/addresses/:id", ({ params, request }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    const payload = JSON.parse(atob(token));
    const index = addresses.findIndex(
      (a) => a.id === String(params.id) && a.userId === payload.userId
    );
    if (index === -1) return new HttpResponse(null, { status: 404 });
    addresses.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
