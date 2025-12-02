export function formatVehicleId(id: string): string {
  const trimmed = id.trim().toUpperCase()
  return trimmed.startsWith('VEH-') ? trimmed : `VEH-${trimmed}`
}
