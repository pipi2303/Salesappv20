// Demo Dummy Data with Advanced Scheduling Features
export const demoDummyData = [
  {
    id: 'D001',
    title: 'Demo Enterprise Plan',
    leadName: 'Ahmad Hidayat',
    company: 'PT Maju Jaya',
    date: new Date(2026, 0, 22).toISOString(),
    time: '10:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'Enterprise Plan',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12345',
    notes: 'Fokus pada fitur analytics dan reporting',
    attendees: [
      {
        id: 'A001',
        name: 'Ahmad Hidayat',
        email: 'ahmad@majujaya.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A002',
        name: 'Siti Rahman',
        email: 'siti@majujaya.co.id',
        type: 'external',
        rsvp: 'pending'
      },
      {
        id: 'A003',
        name: 'Budi Santoso',
        email: 'budi@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      },
      {
        id: 'A004',
        name: 'Desi Marketing',
        email: 'desi@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R001',
        name: 'Meeting Room A',
        type: 'room'
      },
      {
        id: 'R002',
        name: 'Projector 4K',
        type: 'equipment'
      },
      {
        id: 'R003',
        name: 'Zoom Premium',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 15,
      after: 15
    }
  },
  {
    id: 'D002',
    title: 'Demo Professional Plan',
    leadName: 'Siti Nurhaliza',
    company: 'CV Berkah Mandiri',
    date: new Date(2026, 0, 22).toISOString(),
    time: '14:00',
    duration: 45,
    presenter: 'Ani Wijaya',
    product: 'Professional Plan',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12346',
    notes: 'Tunjukkan integrasi dengan existing system',
    attendees: [
      {
        id: 'A005',
        name: 'Siti Nurhaliza',
        email: 'siti@berkahmandiri.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A006',
        name: 'Ani Wijaya',
        email: 'ani@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R004',
        name: 'Meeting Room B',
        type: 'room'
      },
      {
        id: 'R005',
        name: 'Google Meet',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 10,
      after: 10
    }
  },
  {
    id: 'D003',
    title: 'Demo Starter Plan',
    leadName: 'Dewi Lestari',
    company: 'PT Teknologi Masa Depan',
    date: new Date(2026, 0, 23).toISOString(),
    time: '11:00',
    duration: 30,
    presenter: 'Citra Dewi',
    product: 'Starter Plan',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12347',
    notes: 'Demo basic features dan onboarding process',
    attendees: [
      {
        id: 'A007',
        name: 'Dewi Lestari',
        email: 'dewi@teknomasadepan.co.id',
        type: 'external',
        rsvp: 'pending'
      },
      {
        id: 'A008',
        name: 'Citra Dewi',
        email: 'citra@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R006',
        name: 'Microsoft Teams',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 5,
      after: 10
    }
  },
  {
    id: 'D004',
    title: 'Follow-up Demo Enterprise',
    leadName: 'Bambang Suryono',
    company: 'PT Digital Nusantara',
    date: new Date(2026, 0, 20).toISOString(),
    time: '15:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'Enterprise Plan',
    status: 'completed',
    meetingLink: 'https://meet.zoom.us/demo-12348',
    notes: 'Demo berjalan lancar, siap untuk proposal',
    attendees: [
      {
        id: 'A009',
        name: 'Bambang Suryono',
        email: 'bambang@digitalnusantara.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A010',
        name: 'Rina Finance',
        email: 'rina@digitalnusantara.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A011',
        name: 'Dedi IT Manager',
        email: 'dedi@digitalnusantara.com',
        type: 'external',
        rsvp: 'declined'
      },
      {
        id: 'A012',
        name: 'Budi Santoso',
        email: 'budi@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R007',
        name: 'Conference Room Executive',
        type: 'room'
      },
      {
        id: 'R008',
        name: 'LED Display 65"',
        type: 'equipment'
      },
      {
        id: 'R009',
        name: 'Wireless Mic',
        type: 'equipment'
      },
      {
        id: 'R010',
        name: 'Zoom Enterprise',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 20,
      after: 15
    },
    rating: 5,
    reviewerName: 'Bambang Suryono',
    reviewDate: new Date(2026, 0, 20).toISOString(),
    reviewText: 'Excellent demo presentation! The presenter was very knowledgeable and addressed all our concerns. The Enterprise Plan features align perfectly with our business needs. Highly recommend this solution for enterprise-level implementations.'
  },
  {
    id: 'D005',
    title: 'Demo Custom Development',
    leadName: 'Rina Susanti',
    company: 'PT Solusi Digital',
    date: new Date(2026, 0, 24).toISOString(),
    time: '13:00',
    duration: 90,
    presenter: 'Eka Putri',
    product: 'Custom Development',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-12349',
    notes: 'Demo custom solutions dan integration capabilities',
    attendees: [
      {
        id: 'A013',
        name: 'Rina Susanti',
        email: 'rina@solusidigital.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A014',
        name: 'Agus CTO',
        email: 'agus@solusidigital.com',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A015',
        name: 'Eka Putri',
        email: 'eka@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      },
      {
        id: 'A016',
        name: 'Fajar Tech Lead',
        email: 'fajar@salesapp.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R011',
        name: 'Innovation Lab',
        type: 'room'
      },
      {
        id: 'R012',
        name: 'Whiteboard Digital',
        type: 'equipment'
      },
      {
        id: 'R013',
        name: 'Development Sandbox',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 30,
      after: 20
    }
  }
];