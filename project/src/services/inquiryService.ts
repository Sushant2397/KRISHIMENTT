// export interface CreateInquiryPayload {
//   equipment: number | string;
//   buyer_name: string;
//   buyer_email: string;
//   buyer_phone?: string;
//   message: string;
// }

// export async function createInquiry(payload: CreateInquiryPayload) {
//   const numericEquipment = typeof payload.equipment === 'string' ? parseInt(payload.equipment, 10) : payload.equipment;
//   const body = {
//     ...payload,
//     equipment: numericEquipment,
//   };

//   const response = await fetch('http://localhost:8000/api/inquiries/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(body),
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     const message = error?.detail || error?.equipment || error?.message || 'Failed to send inquiry';
//     throw new Error(message);
//   }

//   return response.json();
// }

export interface BuyEquipmentPayload {
  equipment_id: number | string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  message: string;
}

export async function buyEquipment(payload: BuyEquipmentPayload) {
  const response = await fetch('http://localhost:8000/api/buy-equipment/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.detail || error?.message || 'Failed to send inquiry');
  }

  return response.json();
}



export async function getMyInquiries() {
  const tokensRaw = localStorage.getItem('tokens');
  if (!tokensRaw) throw new Error('Not authenticated');
  const tokens = JSON.parse(tokensRaw);
  const access = tokens?.access;
  if (!access) throw new Error('Not authenticated');

  const response = await fetch('http://localhost:8000/api/inquiries/mine/', {
    headers: {
      'Authorization': `Bearer ${access}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.detail || 'Failed to load inquiries');
  }

  return response.json();
}

