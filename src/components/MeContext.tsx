// /var/www/GSA/animal/frontend/src/components/MeContext.tsx

"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
} from "react";
import { fetchMe, MeResponse } from "@/services/me";
import { clearAccessToken } from "@/stores/auth";

type MeContextValue = {
	me: MeResponse | null;
	loading: boolean;
	loadMe: () => Promise<void>;
	resetMe: () => void;
};

const MeContext = createContext<MeContextValue | undefined>(undefined);

export function MeProvider({ children }: { children: ReactNode }) {
	const [me, setMe] = useState<MeResponse | null>(null);
	const [loading, setLoading] = useState(false);

	async function loadMe() {
		setLoading(true);
		try {
			const data = await fetchMe();
			setMe(data);
		} catch(err) {
			if(err instanceof Error){
				setMe(null);
				clearAccessToken();
			}
		} finally {
			setLoading(false);
		}
	}

	function resetMe() {
		setMe(null);
		setLoading(false);
	}

	return (
		<MeContext.Provider
		value={{
			me,
			loading,
			loadMe,
			resetMe,
		}}
		>
		{children}
		</MeContext.Provider>
	);
}

export function useMe(): MeContextValue {
	const ctx = useContext(MeContext);
	if (!ctx) {
		throw new Error("useMe must be used inside MeProvider");
	}
	return ctx;
}

