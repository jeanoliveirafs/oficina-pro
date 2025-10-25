import { useSessionContext } from "@/providers/session-provider";

export const useSession = () => {
  const context = useSessionContext();

  return context;
};