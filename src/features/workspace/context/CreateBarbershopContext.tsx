import React, { createContext, useState, useContext } from "react";

export interface CreateBarbershopFormData {
  name: string;
  logo?: File;
  description?: string;
  address?: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  serviceId?: string;
  barberInvites: { email?: string; phone?: string }[];
}

interface CreateBarbershopContextType {
  formData: Partial<CreateBarbershopFormData>;
  updateFormData: (data: Partial<CreateBarbershopFormData>) => void;
  resetFormData: () => void;
}

const CreateBarbershopContext = createContext<
  CreateBarbershopContextType | undefined
>(undefined);

export function CreateBarbershopProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<Partial<CreateBarbershopFormData>>(
    {}
  );

  const updateFormData = (data: Partial<CreateBarbershopFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => setFormData({});

  return (
    <CreateBarbershopContext.Provider
      value={{ formData, updateFormData, resetFormData }}
    >
      {children}
    </CreateBarbershopContext.Provider>
  );
}

export function useCreateBarbershopForm() {
  const context = useContext(CreateBarbershopContext);
  if (!context) {
    throw new Error(
      "useCreateBarbershopForm must be used within CreateBarbershopProvider"
    );
  }
  return context;
}
