import { createContext, useContext, useState } from "react";

interface ClubContextType {
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
}

const ClubContext = createContext<ClubContextType>({
  selectedGroupId: null,
  setSelectedGroupId: () => {},
});

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [selectedGroupId, setSelectedGroupIdState] = useState<string | null>(
    () => localStorage.getItem("selected_group_id")
  );

  const setSelectedGroupId = (id: string | null) => {
    setSelectedGroupIdState(id);
    if (id) {
      localStorage.setItem("selected_group_id", id);
    } else {
      localStorage.removeItem("selected_group_id");
    }
  };

  return (
    <ClubContext.Provider value={{ selectedGroupId, setSelectedGroupId }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  return useContext(ClubContext);
}
