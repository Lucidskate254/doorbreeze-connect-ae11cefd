
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingBag,
  Truck,
  ClipboardList,
  Building,
  MapPin,
} from "lucide-react";
import { ELDORET_LOCATIONS, SERVICE_TYPES } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderDetailsFormProps {
  serviceType: string;
  deliveryAddress: string;
  instructions: string;
  onServiceTypeChange: (value: string) => void;
  onDeliveryAddressChange: (value: string) => void;
  onInstructionsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({
  serviceType,
  deliveryAddress,
  instructions,
  onServiceTypeChange,
  onDeliveryAddressChange,
  onInstructionsChange,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="serviceType" className={isMobile ? 'text-base' : ''}>Service Type</Label>
        <Select value={serviceType} onValueChange={onServiceTypeChange}>
          <SelectTrigger className={isMobile ? 'h-12' : ''}>
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent className={isMobile ? 'max-h-60' : ''}>
            {SERVICE_TYPES.map((type) => (
              <SelectItem 
                key={type.value} 
                value={type.value}
                className={isMobile ? 'py-3' : ''}
              >
                <div className="flex items-center">
                  {type.value === "Shopping" && <ShoppingBag size={isMobile ? 18 : 16} className="mr-2" />}
                  {type.value === "Delivery" && <Truck size={isMobile ? 18 : 16} className="mr-2" />}
                  {type.value === "Errand" && <ClipboardList size={isMobile ? 18 : 16} className="mr-2" />}
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress" className={isMobile ? 'text-base' : ''}>
          Delivery Address (Within Eldoret)
        </Label>
        <Select value={deliveryAddress} onValueChange={onDeliveryAddressChange}>
          <SelectTrigger className={isMobile ? 'h-12' : ''}>
            <SelectValue placeholder="Select delivery location" />
          </SelectTrigger>
          <SelectContent className={isMobile ? 'max-h-60' : ''}>
            {ELDORET_LOCATIONS.map((location) => (
              <SelectItem 
                key={location.value} 
                value={location.value}
                className={isMobile ? 'py-3' : ''}
              >
                <div className="flex items-center">
                  {location.isCBD ? (
                    <Building size={isMobile ? 18 : 16} className="mr-2" />
                  ) : (
                    <MapPin size={isMobile ? 18 : 16} className="mr-2" />
                  )}
                  {location.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instructions" className={isMobile ? 'text-base' : ''}>
          Additional Instructions (Optional)
        </Label>
        <Textarea
          id="instructions"
          placeholder="Enter any specific instructions or details for your order"
          value={instructions}
          onChange={onInstructionsChange}
          className={isMobile ? 'min-h-[100px] text-base' : ''}
        />
      </div>
    </div>
  );
};

export default OrderDetailsForm;
