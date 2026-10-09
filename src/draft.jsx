import { createContext, useContext, useState } from 'react';

// The moment being made: chosen photo (already resized) carried between the upload steps.
const DraftContext = createContext(null);

export function DraftProvider({ children }) {
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ caption: '', pin: '', agreed: false });
  const reset = () => {
    setPhoto(null);
    setForm({ caption: '', pin: '', agreed: false });
  };
  return <DraftContext.Provider value={{ photo, setPhoto, form, setForm, reset }}>{children}</DraftContext.Provider>;
}

export const useDraft = () => useContext(DraftContext);
