import React, { createContext, useState, useContext } from "react";

export interface SelectedService {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface NewBookingFormData {
  customerName: string;
  contact: string;
  notes: string;
  barberId: string | null;
  barberName: string | null;
  serviceIds: string[];
  selectedServices: SelectedService[];
  scheduledAt: string | null;
}

interface NewBookingContextType {
  formData: NewBookingFormData;
  updateFormData: (data: Partial<NewBookingFormData>) => void;
  setBarber: (id: string, name: string) => void;
  setServices: (services: SelectedService[]) => void;
  resetFormData: () => void;
}

const defaultFormData: NewBookingFormData = {
  customerName: "",
  contact: "",
  notes: "",
  barberId: null,
  barberName: null,
  serviceIds: [],
  selectedServices: [],
  scheduledAt: null,
};

const NewBookingContext = createContext<NewBookingContextType | undefined>(
  undefined,
);

export function NewBookingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<NewBookingFormData>(defaultFormData);

  const updateFormData = (data: Partial<NewBookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const setBarber = (id: string, name: string) => {
    setFormData((prev) => ({ ...prev, barberId: id, barberName: name }));
  };

  const setServices = (services: SelectedService[]) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: services,
      serviceIds: services.map((s) => s.id),
    }));
  };

  const resetFormData = () => setFormData(defaultFormData);

  return (
    <NewBookingContext.Provider
      value={{
        formData,
        updateFormData,
        setBarber,
        setServices,
        resetFormData,
      }}
    >
      {children}
    </NewBookingContext.Provider>
  );
}

export function useNewBookingForm() {
  const context = useContext(NewBookingContext);
  if (!context) {
    throw new Error("useNewBookingForm must be used within NewBookingProvider");
  }
  return context;
}
