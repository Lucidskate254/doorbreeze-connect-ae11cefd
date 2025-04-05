
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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select value={serviceType} onValueChange={onServiceTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center">
                  {type.value === "Shopping" && <ShoppingBag size={16} className="mr-2" />}
                  {type.value === "Delivery" && <Truck size={16} className="mr-2" />}
                  {type.value === "Errand" && <ClipboardList size={16} className="mr-2" />}
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Delivery Address (Within Eldoret)</Label>
        <Select value={deliveryAddress} onValueChange={onDeliveryAddressChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select delivery location" />
          </SelectTrigger>
          <SelectContent>
            {ELDORET_LOCATIONS.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                <div className="flex items-center">
                  {location.isCBD ? (
                    <Building size={16} className="mr-2" />
                  ) : (
                    <MapPin size={16} className="mr-2" />
                  )}
                  {location.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
        <Textarea
          id="instructions"
          placeholder="Enter any specific instructions or details for your order"
          value={instructions}
          onChange={onInstructionsChange}
        />
      </div>
    </div>
  );
};

export default OrderDetailsForm;
