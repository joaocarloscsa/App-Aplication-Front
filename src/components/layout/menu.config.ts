// src/components/layout/menu.config.ts

export type MenuItem = {
  key: string;
  label: string;
  href?: string;
  children?: MenuItem[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
  key: "profile",
  label: "Perfil",
  href: "/dashboard/profile",
  },
  {
    key: "animals",
    label: "Animais",
    href: "/dashboard/animals",
    children: [
      {
        key: "animals-new",
        label: "Novo animal",
        href: "/dashboard/animals/new",
      },
    ],
  },
  {
    key: "agenda",
    label: "Agenda",
    href: "/dashboard/agenda",
  },
  {
    key: "clinic",
    label: "Clínica",
    href: "/dashboard/clinica",
    children: [
      {
        key: "clinic-medications",
        label: "Medicações",
        href: "/dashboard/clinica/medicamentos",
      },
      {
        key: "clinic-vaccination",
        label: "Vacinação",
        href: "/dashboard/clinica/vacinacao",
      },
      {
        key: "clinic-history",
        label: "Histórico",
        href: "/dashboard/clinica/historico",
      },
    ],
  },
  {
    key: "uploads",
    label: "Uploads",
    href: "/dashboard/uploads",
  },
];

