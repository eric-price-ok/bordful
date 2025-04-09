import { Mail, Phone, MapPin } from "lucide-react";
// No card components needed
import config from "@/config";
import { resolveColor } from "@/lib/utils/colors";

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
  const primaryColor = resolveColor(config.ui.primaryColor);

  return (
    <div className="p-5 border rounded-lg hover:border-gray-400 transition-all">
      <div className="pb-4">
        <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
        <p className="text-zinc-600 mt-1 text-sm">{description}</p>
      </div>
      <div>
        <div className="space-y-4">
          <p className="font-medium text-zinc-900">{companyName}</p>

          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-zinc-500" />
            <a
              href={`mailto:${email}`}
              className="text-sm hover:underline"
              style={{ color: primaryColor }}
            >
              {email}
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-zinc-500" />
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="text-sm hover:underline"
              style={{ color: primaryColor }}
            >
              {phone}
            </a>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-zinc-500 mt-0.5" />
            <span className="text-zinc-700 text-sm">{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
