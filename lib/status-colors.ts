export const statusColorPresets = {
  amber: {
    label: "Amber",
    className: "bg-status-new/15 text-status-new border-status-new/20"
  },
  sand: {
    label: "Sand",
    className: "bg-status-pending/15 text-status-pending border-status-pending/20"
  },
  teal: {
    label: "Teal",
    className: "bg-status-contacted/15 text-status-contacted border-status-contacted/20"
  },
  bronze: {
    label: "Bronze",
    className: "bg-status-waiting/15 text-status-waiting border-status-waiting/20"
  },
  sage: {
    label: "Sage",
    className: "bg-status-booked/15 text-status-booked border-status-booked/20"
  },
  emerald: {
    label: "Emerald",
    className: "bg-status-won/15 text-status-won border-status-won/20"
  },
  rose: {
    label: "Rose",
    className: "bg-status-lost/15 text-status-lost border-status-lost/20"
  }
} as const;

export type StatusColorPreset = keyof typeof statusColorPresets;
