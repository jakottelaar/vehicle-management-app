import { NextRequest } from "next/server";
import prisma from "../../../../prisma/client";
import { auth } from "@/lib/firebase/firebase-admin-config";
import { z } from "zod";

type Vehicle = {
  make: string;
  model: string;
  year: number;
  purchasePrice: number;
  purchaseDate: string;
  mileage: number;
  vin: string;
  image: string;
  userId: string;
};

const vehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().positive(),
  purchasePrice: z.number().positive(),
  purchaseDate: z.string(),
  mileage: z.number().positive(),
  vin: z.string().length(17),
  image: z.string().url(),
});

export async function GET(req: NextRequest) {
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await auth.verifyIdToken(token);

  const vehicles = await prisma.vehicle.findMany({
    where: {
      userId: user.uid,
    },
  });

  return Response.json(vehicles);
}

export async function POST(req: NextRequest) {
  const authorizationHeader = req.headers.get("authorization");

  if (!authorizationHeader) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await auth.verifyIdToken(token);

  const body = await req.json();

  console.log(body);

  const validation = vehicleSchema.safeParse(body);

  if (!validation.success) {
    return Response.json({ error: validation.error.errors }, { status: 400 });
  }

  const newVehicle = await prisma.vehicle.create({
    data: {
      make: body.make,
      model: body.model,
      year: body.year,
      purchasePrice: body.purchasePrice,
      purchaseDate: new Date(body.purchaseDate),
      mileage: body.mileage,
      vin: body.vin,
      image: body.image,
      userId: user.uid,
    },
  });

  return Response.json(newVehicle);
}
