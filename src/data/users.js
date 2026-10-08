export const ROLES = {
  ADMIN: 'ADMIN',
  DRIVER: 'DRIVER',
  TECHNICIAN: 'IOT TECHNICIAN',
  SUPERVISOR: 'SUPERVISOR'
};

export const INITIAL_USERS = [
  {
    id: 'usr-001',
    name: 'Elena Rostova',
    email: 'admin@smartwaste.io',
    password: 'admin',
    role: ROLES.ADMIN,
    title: 'Chief Municipal Systems Director',
    department: 'Smart City Operations HQ',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-8901'
  },
  {
    id: 'usr-002',
    name: 'Marcus Vance',
    email: 'driver@smartwaste.io',
    password: 'driver',
    role: ROLES.DRIVER,
    title: 'Senior Fleet Dispatch Driver',
    department: 'Zone North Fleet Logistics',
    vehicleId: 'TRK-902',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 871-3342'
  },
  {
    id: 'usr-003',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'tech@smartwaste.io',
    password: 'tech',
    role: ROLES.TECHNICIAN,
    title: 'Lead IoT & Embedded Systems Engineer',
    department: 'Hardware Diagnostic Lab',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 492-1189'
  },
  {
    id: 'usr-004',
    name: 'Sarah Chen',
    email: 'supervisor@smartwaste.io',
    password: 'supervisor',
    role: ROLES.SUPERVISOR,
    title: 'District Environmental Supervisor',
    department: 'Metro Sanitation Oversight',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 609-7721'
  }
];
