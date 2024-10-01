"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase/firebase-config";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/loading-spinner";

type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  purchasePrice: number;
  purchaseDate: string;
  vin: string;
  image: string;
};

const Vehicles = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        console.error("Token is not available");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch("/api/vehicles", { headers });
      const data = await response.json();
      setVehicles(data);
      setIsLoading(false);
    };

    fetchVehicles();
  }, []);

  const addVehicle = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formRef.current) {
      console.error("Form reference is not available");
      return;
    }

    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      console.error("Token is not available");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...data,
          purchasePrice: Number(data.purchasePrice),
          year: Number(data.year),
          mileage: Number(data.mileage),
          purchaseDate: new Date(String(data.purchaseDate)).toISOString(),
        }),
      });

      if (response.ok) {
        const newVehicle = await response.json();
        setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
        formRef.current.reset();
      } else {
        console.error("Failed to add vehicle");
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const VehicleDetails = (id: string) => {
    router.push(`/vehicles/${id}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-full flex-col items-center p-4 md:px-8 lg:items-start">
        <ScrollArea className="h-full max-h-screen w-full">
          <div className="grid min-w-[250px] grid-cols-1 gap-8 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
            <Card className="flex h-[200px] lg:w-full items-center justify-center border-2 border-dashed border-white bg-transparent text-white transition-all duration-300 ease-in-out hover:cursor-pointer hover:border-neutral-600 hover:text-neutral-600 md:h-[225px] lg:h-[250px]">
              <Dialog>
                <DialogTrigger className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Plus className="h-12 w-12" />
                    <p className="text-xl font-semibold">Add Vehicle</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="rounded-lg border-none bg-neutral-900 p-6 text-white shadow-lg sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Add New Vehicle
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-400">
                      Enter the details of the vehicle you want to add.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    ref={formRef}
                    className="grid gap-4 py-4"
                    onSubmit={addVehicle}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col">
                        <label className="text-sm">Make</label>
                        <input
                          type="text"
                          className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                          name="make"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm">Model</label>
                        <input
                          type="text"
                          className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                          name="model"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col">
                        <label className="text-sm">Year</label>
                        <input
                          type="number"
                          className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                          name="year"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm">Mileage</label>
                        <input
                          type="number"
                          className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                          name="mileage"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Purchase Price</label>
                      <input
                        type="number"
                        className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                        name="purchasePrice"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Purchase Date</label>
                      <input
                        type="date"
                        className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                        name="purchaseDate"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">VIN</label>
                      <input
                        type="text"
                        className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                        name="vin"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm">Image URL</label>
                      <input
                        type="url"
                        className="rounded-lg border border-neutral-500 bg-transparent px-4 py-2 outline-none duration-200 focus:border-neutral-50"
                        name="image"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        className="rounded-lg border border-white bg-transparent px-4 py-2  text-white transition-all duration-200 hover:bg-white hover:text-black"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg border border-white bg-white px-4 py-2 text-black transition-all duration-200 hover:bg-transparent hover:text-white"
                      >
                        Add Vehicle
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} onClick={() => VehicleDetails(vehicle.id)}>
                <Card className="relative border-none text-white transition-all ease-in-out hover:scale-95 hover:cursor-pointer">
                  <Image
                    src={vehicle.image}
                    alt="Product"
                    className="h-[200px] w-full rounded-lg object-cover transition-transform duration-300 ease-in-out md:h-[225px] lg:h-[250px]"
                    height={250}
                    width={400}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 p-4 text-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                    <CardHeader className="grid gap-1">
                      <CardTitle>
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="mt-2 text-sm">
                      <p>{vehicle.year}</p>
                      <p>${vehicle.purchasePrice}</p>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </ProtectedRoute>
  );
};

export default Vehicles;
