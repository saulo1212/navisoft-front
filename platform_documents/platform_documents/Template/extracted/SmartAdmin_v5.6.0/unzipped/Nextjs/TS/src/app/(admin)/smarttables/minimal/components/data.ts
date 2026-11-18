export type MinimalType = {
  id: number
  name: string
  email: string
  phone: string
  status: 'Active' | 'Inactive' | 'Pending'
  due: string
}

export const minimalData: MinimalType[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    status: 'Active',
    due: '$100.00',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    status: 'Inactive',
    due: '$200.00',
  },
  {
    id: 3,
    name: 'Jim Beam',
    email: 'jim.beam@example.com',
    phone: '555-123-4567',
    status: 'Active',
    due: '$300.00',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '415-555-0101',
    status: 'Pending',
    due: '$150.00',
  },
  {
    id: 5,
    name: 'Robert Lee',
    email: 'robert.lee@example.com',
    phone: '310-987-6543',
    status: 'Active',
    due: '$75.00',
  },
  {
    id: 6,
    name: 'Sarah Kim',
    email: 'sarah.kim@example.com',
    phone: '212-345-6789',
    status: 'Inactive',
    due: '$250.00',
  },
  {
    id: 7,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '617-890-1234',
    status: 'Active',
    due: '$400.00',
  },
  {
    id: 8,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '720-456-7891',
    status: 'Pending',
    due: '$50.00',
  },
  {
    id: 9,
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '503-234-5678',
    status: 'Active',
    due: '$125.00',
  },
  {
    id: 10,
    name: 'Linda Carter',
    email: 'linda.carter@example.com',
    phone: '858-901-2345',
    status: 'Inactive',
    due: '$175.00',
  },
  {
    id: 11,
    name: 'Thomas Green',
    email: 'thomas.green@example.com',
    phone: '206-789-0123',
    status: 'Active',
    due: '$90.00',
  },
  {
    id: 12,
    name: 'Nancy White',
    email: 'nancy.white@example.com',
    phone: '404-567-8901',
    status: 'Pending',
    due: '$225.00',
  },
  {
    id: 13,
    name: 'Paul Adams',
    email: 'paul.adams@example.com',
    phone: '713-345-6789',
    status: 'Active',
    due: '$350.00',
  },
  {
    id: 14,
    name: 'Clara Evans',
    email: 'clara.evans@example.com',
    phone: '916-123-4567',
    status: 'Inactive',
    due: '$80.00',
  },
  {
    id: 15,
    name: 'Oliver Harris',
    email: 'oliver.harris@example.com',
    phone: '312-890-1234',
    status: 'Active',
    due: '$500.00',
  },
]
