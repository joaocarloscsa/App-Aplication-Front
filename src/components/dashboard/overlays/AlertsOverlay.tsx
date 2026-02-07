"use client";

import { useDashboardOverlay } from "@/components/dashboard/DashboardOverlayContext";
import { useMe } from "@/components/MeContext";

export function AlertsOverlay() {
	const { activeOverlay, closeOverlay } = useDashboardOverlay();
	const { me } = useMe();

	if (activeOverlay !== "alerts") return null;

	const pending = (me as any)?.alerts?.pending;

	const alerts = Array.isArray(pending?.items)
		? pending.items
		: [];


		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
			{/* Header */}
			<div className="mb-4 flex items-center justify-between">
			<h2 className="text-lg font-semibold text-zinc-900">
			Alertas
			</h2>
			<button
			onClick={closeOverlay}
			className="rounded-lg px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100"
			>
			Fechar
			</button>
			</div>

			{/* Content */}
			{alerts.length === 0 ? (
				<div className="text-sm text-zinc-500">
				Nenhum alerta pendente.
					</div>
			) : (
			<ul className="space-y-4">
			{alerts.map((alert) => (
				<li
				key={alert.public_id}
				className="rounded-xl border border-zinc-200 p-4"
				>
				<div className="mb-1 text-sm font-semibold text-zinc-900">
				{alert.ui?.title ?? "Alerta"}
				</div>

				<div className="mb-3 text-sm text-zinc-600">
				{alert.ui?.message ?? "Sem descrição"}
				</div>

				{/* Actions */}
				<div className="flex gap-2">
				{Array.isArray(alert.ui?.actions) &&
					alert.ui.actions.includes("accept") && (
						<button
						type="button"
						className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
						>
						Aceitar
						</button>
				)}

				{Array.isArray(alert.ui?.actions) &&
					alert.ui.actions.includes("reject") && (
						<button
						type="button"
						className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
						>
						Rejeitar
						</button>
				)}

				{Array.isArray(alert.ui?.actions) &&
					alert.ui.actions.includes("ack") && (
						<button
						type="button"
						className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
						>
						Ciente
						</button>
				)}
				</div>
				</li>
			))}
			</ul>
			)}
			</div>
			</div>
		);
}

