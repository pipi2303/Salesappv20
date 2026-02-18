/**
 * Initialize Demo Scheduler Data
 * This function loads demo data from populateCRMData.ts into localStorage
 */

const LS_KEY_DEMOS = 'sales_monitoring_demos';

// Demo Data with Advanced Scheduling
const demosDummyData = [
  {
    id: 'D001',
    title: 'Demo Enterprise Plan - RS Harapan Sehat',
    leadName: 'Dr. Ahmad Fauzi',
    company: 'RS Harapan Sehat Jakarta',
    date: new Date(2026, 1, 10, 10, 0), // Feb 10, 2026, 10:00 AM
    time: '10:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'HMS Enterprise',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-e001',
    notes: 'Fokus pada fitur analytics dan reporting untuk manajemen rumah sakit',
    attendees: [
      {
        id: 'A001',
        name: 'Dr. Ahmad Fauzi',
        email: 'ahmad.fauzi@rsharapansehat.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A002',
        name: 'dr. Siti Rahman',
        email: 'siti.rahman@rsharapansehat.co.id',
        type: 'external',
        rsvp: 'pending'
      },
      {
        id: 'A003',
        name: 'Budi Santoso',
        email: 'budi.santoso@intramedika.com',
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
    title: 'Demo Professional Plan - Klinik Sehat Bersama',
    leadName: 'dr. Siti Rahmawati',
    company: 'Klinik Sehat Bersama',
    date: new Date(2026, 1, 12, 14, 0), // Feb 12, 2026, 2:00 PM
    time: '14:00',
    duration: 45,
    presenter: 'Siti Nurhaliza',
    product: 'HMS Professional',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-p001',
    notes: 'Tunjukkan integrasi dengan existing system dan kemudahan onboarding',
    attendees: [
      {
        id: 'A004',
        name: 'dr. Siti Rahmawati',
        email: 'siti@kliniksehatbersama.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A005',
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@intramedika.com',
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
    title: 'Demo EMR Standalone - Puskesmas Cibinong',
    leadName: 'dr. Hendra Gunawan',
    company: 'Puskesmas Cibinong',
    date: new Date(2026, 1, 15, 11, 0), // Feb 15, 2026, 11:00 AM
    time: '11:00',
    duration: 30,
    presenter: 'Dewi Lestari',
    product: 'EMR Standalone',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-emr001',
    notes: 'Demo basic features dan onboarding process untuk Puskesmas',
    attendees: [
      {
        id: 'A006',
        name: 'dr. Hendra Gunawan',
        email: 'hendra@puskesmascibinong.go.id',
        type: 'external',
        rsvp: 'pending'
      },
      {
        id: 'A007',
        name: 'Dewi Lestari',
        email: 'dewi.lestari@intramedika.com',
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
    title: 'Follow-up Demo Enterprise - RS Premier Bintaro',
    leadName: 'Dr. Ir. Johanes Surya',
    company: 'RS Premier Bintaro',
    date: new Date(2026, 1, 5, 15, 0), // Feb 5, 2026, 3:00 PM (Past - Completed)
    time: '15:00',
    duration: 60,
    presenter: 'Andi Wijaya',
    product: 'HMS Enterprise',
    status: 'completed',
    meetingLink: 'https://meet.zoom.us/demo-fb001',
    notes: 'Demo berjalan lancar, siap untuk proposal. Client sangat tertarik dengan fitur PACS dan LIS.',
    attendees: [
      {
        id: 'A008',
        name: 'Dr. Ir. Johanes Surya',
        email: 'johanes@premierbintaro.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A009',
        name: 'Rina Finance Director',
        email: 'rina@premierbintaro.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A010',
        name: 'Andi Wijaya',
        email: 'andi.wijaya@intramedika.com',
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
        name: 'Zoom Enterprise',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 20,
      after: 15
    },
    rating: 5,
    reviewerName: 'Dr. Ir. Johanes Surya',
    reviewDate: new Date(2026, 1, 5, 16, 30),
    reviewText: 'Excellent demo presentation! The presenter was very knowledgeable and addressed all our concerns. The Enterprise Plan features, especially PACS and LIS integration, align perfectly with our hospital needs. The technical team was impressed with the system architecture. Highly recommend for enterprise-level hospital implementations.'
  },
  {
    id: 'D005',
    title: 'Demo Telemedicine Module - Klinik Kimia Farma',
    leadName: 'dr. Rina Wijayanti',
    company: 'Klinik Kimia Farma Jakarta Pusat',
    date: new Date(2026, 1, 18, 13, 0), // Feb 18, 2026, 1:00 PM
    time: '13:00',
    duration: 45,
    presenter: 'Rudi Hartono',
    product: 'Telemedicine Module',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-tele001',
    notes: 'Demo fokus pada fitur telemedicine dan mobile app untuk pasien',
    attendees: [
      {
        id: 'A011',
        name: 'dr. Rina Wijayanti',
        email: 'rina@kimiafarma.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A012',
        name: 'IT Manager',
        email: 'it@kimiafarma.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A013',
        name: 'Rudi Hartono',
        email: 'rudi.hartono@intramedika.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R010',
        name: 'Meeting Room C',
        type: 'room'
      },
      {
        id: 'R011',
        name: 'Tablet Demo Device',
        type: 'equipment'
      },
      {
        id: 'R012',
        name: 'Google Meet',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 15,
      after: 10
    }
  },
  {
    id: 'D006',
    title: 'Demo HMS Professional - RS Hermina Depok',
    leadName: 'Dr. Hadi Sutrisno',
    company: 'RS Hermina Depok',
    date: new Date(2026, 1, 3, 10, 0), // Feb 3, 2026 (Past - Completed)
    time: '10:00',
    duration: 60,
    presenter: 'Budi Santoso',
    product: 'HMS Professional',
    status: 'completed',
    meetingLink: 'https://meet.zoom.us/demo-her001',
    notes: 'Demo sukses, client tertarik dengan Nurse Station Module. Follow-up untuk proposal.',
    attendees: [
      {
        id: 'A014',
        name: 'Dr. Hadi Sutrisno',
        email: 'hadi@hermina.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A015',
        name: 'Head of IT',
        email: 'it.head@hermina.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A016',
        name: 'Budi Santoso',
        email: 'budi.santoso@intramedika.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R013',
        name: 'Conference Room 1',
        type: 'room'
      },
      {
        id: 'R014',
        name: 'Projector HD',
        type: 'equipment'
      },
      {
        id: 'R015',
        name: 'Zoom Business',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 15,
      after: 15
    },
    rating: 4,
    reviewerName: 'Dr. Hadi Sutrisno',
    reviewDate: new Date(2026, 1, 3, 11, 30),
    reviewText: 'Good demo session. The Nurse Station Module features are impressive and will improve our nursing workflow significantly. The presenter explained the integration process clearly. We need more information about data migration from our current system, but overall we are very interested.'
  },
  {
    id: 'D007',
    title: 'Demo Billing System - Praktek Dokter Keluarga',
    leadName: 'dr. Lisa Permata Sari',
    company: 'Praktek Bersama Dokter Keluarga',
    date: new Date(2026, 1, 20, 16, 0), // Feb 20, 2026, 4:00 PM
    time: '16:00',
    duration: 30,
    presenter: 'Dewi Lestari',
    product: 'Billing System + EMR Standalone',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-bil001',
    notes: 'Demo untuk praktek dokter, fokus pada billing dan BPJS integration',
    attendees: [
      {
        id: 'A017',
        name: 'dr. Lisa Permata Sari',
        email: 'lisa@dokterpraktek.com',
        type: 'external',
        rsvp: 'pending'
      },
      {
        id: 'A018',
        name: 'Dewi Lestari',
        email: 'dewi.lestari@intramedika.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R016',
        name: 'Google Meet',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 5,
      after: 10
    }
  },
  {
    id: 'D008',
    title: 'Demo Laboratory LIS - RS Mitra Keluarga',
    leadName: 'Dr. Bambang Sutrisno',
    company: 'RS Mitra Keluarga Surabaya',
    date: new Date(2026, 1, 8, 9, 0), // Feb 8, 2026, 9:00 AM
    time: '09:00',
    duration: 90,
    presenter: 'Andi Wijaya',
    product: 'Laboratory LIS',
    status: 'scheduled',
    meetingLink: 'https://meet.zoom.us/demo-lis001',
    notes: 'Demo upgrade module LIS dengan auto-interface ke alat lab',
    attendees: [
      {
        id: 'A019',
        name: 'Dr. Bambang Sutrisno, Sp.PD',
        email: 'bambang@rsmitrakeluarga-sby.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A020',
        name: 'Lab Manager',
        email: 'lab@rsmitrakeluarga-sby.co.id',
        type: 'external',
        rsvp: 'accepted'
      },
      {
        id: 'A021',
        name: 'Andi Wijaya',
        email: 'andi.wijaya@intramedika.com',
        type: 'internal',
        rsvp: 'accepted'
      },
      {
        id: 'A022',
        name: 'Technical Support',
        email: 'tech@intramedika.com',
        type: 'internal',
        rsvp: 'accepted'
      }
    ],
    resources: [
      {
        id: 'R017',
        name: 'Innovation Lab',
        type: 'room'
      },
      {
        id: 'R018',
        name: 'Lab Equipment Demo',
        type: 'equipment'
      },
      {
        id: 'R019',
        name: 'LIS Sandbox Environment',
        type: 'software'
      }
    ],
    bufferTime: {
      before: 30,
      after: 20
    }
  }
];

/**
 * Initialize demos data to localStorage
 */
export function initializeDemosData(): {
  success: boolean;
  message: string;
  count: number;
} {
  try {
    // Check if demos already exist
    const existingDemos = localStorage.getItem(LS_KEY_DEMOS);
    
    if (!existingDemos || JSON.parse(existingDemos).length === 0) {
      localStorage.setItem(LS_KEY_DEMOS, JSON.stringify(demosDummyData));
      console.log('✅ Demo Scheduler data initialized successfully');
      console.log(`📊 Total Demos: ${demosDummyData.length}`);
      console.log(`   - Scheduled: ${demosDummyData.filter(d => d.status === 'scheduled').length}`);
      console.log(`   - Completed: ${demosDummyData.filter(d => d.status === 'completed').length}`);
      
      return {
        success: true,
        message: `Demo Scheduler data initialized with ${demosDummyData.length} demos`,
        count: demosDummyData.length,
      };
    }
    
    const existingCount = JSON.parse(existingDemos).length;
    console.log(`ℹ️ Demo data already exists (${existingCount} demos)`);
    
    return {
      success: true,
      message: 'Demo data already exists',
      count: existingCount,
    };
  } catch (error) {
    console.error('❌ Error initializing demos:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to initialize demos',
      count: 0,
    };
  }
}

/**
 * Clear all demos from localStorage
 */
export function clearDemosData(): {
  success: boolean;
  message: string;
} {
  try {
    localStorage.removeItem(LS_KEY_DEMOS);
    console.log('🗑️ Demo Scheduler data cleared');
    
    return {
      success: true,
      message: 'Demo Scheduler data cleared successfully',
    };
  } catch (error) {
    console.error('❌ Error clearing demos:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to clear demos',
    };
  }
}

/**
 * Get demos statistics
 */
export function getDemosStatistics(): {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
} {
  try {
    const demos = JSON.parse(localStorage.getItem(LS_KEY_DEMOS) || '[]');
    
    return {
      total: demos.length,
      scheduled: demos.filter((d: any) => d.status === 'scheduled').length,
      completed: demos.filter((d: any) => d.status === 'completed').length,
      cancelled: demos.filter((d: any) => d.status === 'cancelled').length,
    };
  } catch (error) {
    console.error('❌ Error getting demos statistics:', error);
    return {
      total: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };
  }
}
