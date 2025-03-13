import { Mail, Phone, MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ContactInfoSectionProps {
  title: string;
  description: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
}

export function ContactInfoSection({
  title,
  description,
  companyName,
  email,
  phone,
  address,
}: ContactInfoSectionProps) {
  return (
    <Card className="border-zinc-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-zinc-900">
          {title}
        </CardTitle>
        <CardDescription className="text-zinc-600 mt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-medium text-zinc-900">{companyName}</p>

          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-zinc-500" />
            <a
              href={`mailto:${email}`}
              className="text-zinc-700 hover:text-zinc-900 hover:underline text-sm"
            >
              {email}
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-zinc-500" />
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="text-zinc-700 hover:text-zinc-900 hover:underline text-sm"
            >
              {phone}
            </a>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-zinc-500 mt-0.5" />
            <span className="text-zinc-700 text-sm">{address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
