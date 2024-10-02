import { Card, CardContent } from "./ui/card";

export const VehicleDetailsInfoCard = ({
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
