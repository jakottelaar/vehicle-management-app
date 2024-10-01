"use client";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  Hash,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../../../components/loading-spinner";
import { auth } from "@/lib/firebase/firebase-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const VehicleDetails = ({ params }: { params: { id: string } }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const vehicleResponse = await fetch(`/api/vehicles/${params.id}`, {
        headers,
      });
      const vehicleData = await vehicleResponse.json();

      setVehicle(vehicleData);
      setIsLoading(false);
    };

    fetchVehicleData();
  }, [params.id]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner />
      </ProtectedRoute>
    );
  }

  if (!vehicle) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen items-center justify-center text-white">
          <h1 className="text-2xl">Vehicle not found</h1>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen w-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${vehicle.image})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col p-4 text-white md:p-8 justify-between">
          <header className="w-full flex-col lg:flex-row flex">
            <div className="lg:me-24">
              <h1 className="mb-2 text-4xl font-bold md:text-5xl">
                {vehicle.make} {vehicle.model}
              </h1>
              <Badge variant="secondary" className="mb-6 text-lg">
                {vehicle.year}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <VehicleInfoCard
                icon={<Gauge className="h-5 w-5" />}
                title="Mileage"
                value={`${vehicle.mileage} km`}
              />
              <VehicleInfoCard
                icon={<DollarSign className="h-5 w-5" />}
                title="Purchase Price"
                value={`$${vehicle.purchasePrice}`}
              />
              <VehicleInfoCard
                icon={<Calendar className="h-5 w-5" />}
                title="Purchase Date"
                value={new Date(vehicle.purchaseDate).toLocaleDateString()}
              />
              <VehicleInfoCard
                icon={<Hash className="h-5 w-5" />}
                title="VIN"
                value={vehicle.vin}
              />
            </div>
          </header>

          <Tabs
            defaultValue="maintenance"
            className="w-full bg-black bg-opacity-20 rounded-lg backdrop-blur-3xl mt-4"
          >
            <TabsList className="grid  lg:w-[500px] grid-cols-3 m-4 bg-black text-white space-x-4">
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
              <TabsTrigger value="fuel">Fuel</TabsTrigger>
            </TabsList>
            <TabsContent className="m-4 rounded-lg " value="maintenance">
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="bg-black text-white border-none">
                  <CardHeader>
                    <CardTitle>Maintenance Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold">$1,500</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last Service
                      </p>
                      <p className="text-lg">Oil Change</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Next Due</p>
                      <p className="text-lg">Tire Rotation</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Controls */}
                <div className="flex justify-between items-center">
                  <div>
                    <Input
                      className="border-none bg-black text-white placeholder:text-white"
                      placeholder="Search"
                    />
                  </div>
                  <button className="flex flex-row items-center bg-black py-2 px-4 rounded-lg hover:bg-black/50 duration-300">
                    <Plus className="mr-2 h-4 w-4" /> New Entry
                  </button>
                </div>

                {/* Maintenance Table */}
                <div className="table-container">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Service</TableHead>
                        <TableHead className="text-white">Mileage</TableHead>
                        <TableHead className="text-right text-white">
                          Cost
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-09-15</TableCell>
                        <TableCell>Oil Change</TableCell>
                        <TableCell>50,000 km</TableCell>
                        <TableCell className="text-right">$80.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-09-15</TableCell>
                        <TableCell>Oil Change</TableCell>
                        <TableCell>50,000 km</TableCell>
                        <TableCell className="text-right">$80.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-09-15</TableCell>
                        <TableCell>Oil Change</TableCell>
                        <TableCell>50,000 km</TableCell>
                        <TableCell className="text-right">$80.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-09-15</TableCell>
                        <TableCell>Oil Change</TableCell>
                        <TableCell>50,000 km</TableCell>
                        <TableCell className="text-right">$80.00</TableCell>
                      </TableRow>
                    </TableBody>
                    <TableFooter className="bg-transparent">
                      <TableRow>
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right">$1,500.00</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              className="m-4 p-4 bg-black rounded-lg"
              value="upgrades"
            >
              Upgrades
            </TabsContent>
            <TabsContent className="m-4 p-4 bg-black rounded-lg" value="fuel">
              Fuel
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const VehicleInfoCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <Card className="bg-black bg-opacity-20 border-none backdrop-blur-3xl h-fit">
    <CardContent className="flex items-center p-4">
      <div className="mr-4 text-white">{icon}</div>
      <div>
        <h3 className="font-medium text-white">{title}</h3>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default VehicleDetails;
